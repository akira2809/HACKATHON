import 'server-only';

import { randomUUID } from 'crypto';
import {
    BedrockAgentCoreClient,
    InvokeAgentRuntimeCommand,
} from '@aws-sdk/client-bedrock-agentcore';
import {
    BedrockAgentRuntimeClient,
    InvokeAgentCommand,
    type ResponseStream,
} from '@aws-sdk/client-bedrock-agent-runtime';

type AgentPayload = Record<string, unknown>;
type AgentTarget =
    | {
        kind: 'agentcore-runtime';
        agentRuntimeArn: string;
        qualifier: string;
    }
    | {
        kind: 'bedrock-agent';
        agentId: string;
        agentAliasId: string;
    };

const decoder = new TextDecoder();
let cachedBedrockClient: BedrockAgentRuntimeClient | null = null;
let cachedAgentCoreClient: BedrockAgentCoreClient | null = null;

function getRequiredEnv(name: string) {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`${name} is not configured.`);
    }

    return value;
}

function resolveAgentTarget(): AgentTarget {
    const explicitAgentId = process.env.AGENT_ID?.trim();
    const explicitAgentAliasId = process.env.AGENT_ALIAS_ID?.trim();

    if (explicitAgentId && explicitAgentAliasId) {
        return {
            kind: 'bedrock-agent',
            agentId: explicitAgentId,
            agentAliasId: explicitAgentAliasId,
        };
    }

    const agentArn = process.env.AGENT_ARN?.trim();

    if (!agentArn) {
        throw new Error('Set AGENT_ARN or both AGENT_ID and AGENT_ALIAS_ID.');
    }

    if (agentArn.includes(':bedrock-agentcore:') && /:runtime\/[^/]+$/i.test(agentArn)) {
        return {
            kind: 'agentcore-runtime',
            agentRuntimeArn: agentArn,
            qualifier: process.env.AGENT_QUALIFIER?.trim() || 'DEFAULT',
        };
    }

    const aliasMatch = agentArn.match(/agent-alias\/([^/]+)\/([^/]+)$/);

    if (!aliasMatch) {
        throw new Error(
            'AGENT_ARN must be either a Bedrock AgentCore runtime ARN ending with runtime/<runtimeId> or a Bedrock agent alias ARN ending with agent-alias/<agentId>/<agentAliasId>, or use AGENT_ID and AGENT_ALIAS_ID.',
        );
    }

    return {
        kind: 'bedrock-agent',
        agentId: aliasMatch[1],
        agentAliasId: aliasMatch[2],
    };
}

function getBedrockClient() {
    if (cachedBedrockClient) {
        return cachedBedrockClient;
    }

    cachedBedrockClient = new BedrockAgentRuntimeClient({
        region: getRequiredEnv('AWS_REGION'),
        credentials: {
            accessKeyId: getRequiredEnv('AWS_ACCESS_KEY_ID'),
            secretAccessKey: getRequiredEnv('AWS_SECRET_ACCESS_KEY'),
        },
    });

    return cachedBedrockClient;
}

function getAgentCoreClient() {
    if (cachedAgentCoreClient) {
        return cachedAgentCoreClient;
    }

    cachedAgentCoreClient = new BedrockAgentCoreClient({
        region: getRequiredEnv('AWS_REGION'),
        credentials: {
            accessKeyId: getRequiredEnv('AWS_ACCESS_KEY_ID'),
            secretAccessKey: getRequiredEnv('AWS_SECRET_ACCESS_KEY'),
        },
    });

    return cachedAgentCoreClient;
}

export function hasBedrockAgentConfig() {
    try {
        getRequiredEnv('AWS_REGION');
        getRequiredEnv('AWS_ACCESS_KEY_ID');
        getRequiredEnv('AWS_SECRET_ACCESS_KEY');
        resolveAgentTarget();

        return true;
    } catch {
        return false;
    }
}

function serializeAgentPayload(payload: AgentPayload) {
    if (typeof payload.prompt === 'string' && Object.keys(payload).length === 1) {
        return payload.prompt;
    }

    return JSON.stringify(payload);
}

function parseAgentJsonCandidate(value: string) {
    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    const candidates = [
        trimmed,
        trimmed.replace(/^```(?:json)?\s*|\s*```$/g, '').trim(),
    ];

    for (const candidate of candidates) {
        if (!candidate) {
            continue;
        }

        try {
            return JSON.parse(candidate) as unknown;
        } catch {
            continue;
        }
    }

    return null;
}

function getBedrockStreamError(event: ResponseStream) {
    const record = event as unknown as Record<string, unknown>;
    const errorKeys = [
        'internalServerException',
        'validationException',
        'resourceNotFoundException',
        'serviceQuotaExceededException',
        'throttlingException',
        'accessDeniedException',
        'conflictException',
        'dependencyFailedException',
        'badGatewayException',
        'modelNotReadyException',
    ];

    for (const key of errorKeys) {
        const candidate = record[key];

        if (candidate && typeof candidate === 'object') {
            const message = 'message' in candidate && typeof candidate.message === 'string'
                ? candidate.message
                : `${key} surfaced while invoking the Bedrock agent.`;

            return message;
        }
    }

    return null;
}

async function readBedrockAgentCompletion(completion: AsyncIterable<ResponseStream> | undefined) {
    const chunks: string[] = [];

    if (!completion) {
        return '';
    }

    for await (const event of completion) {
        const errorMessage = getBedrockStreamError(event);

        if (errorMessage) {
            throw new Error(errorMessage);
        }

        const chunkBytes = (event as { chunk?: { bytes?: Uint8Array } }).chunk?.bytes;

        if (chunkBytes) {
            chunks.push(decoder.decode(chunkBytes));
        }
    }

    return chunks.join('').trim();
}

async function readAgentCoreResponse(
    response:
        | {
            transformToString?: () => Promise<string>;
            [Symbol.asyncIterator]?: () => AsyncIterator<Uint8Array | Buffer | string>;
        }
        | undefined,
) {
    if (!response) {
        return '';
    }

    if (typeof response.transformToString === 'function') {
        return (await response.transformToString()).trim();
    }

    if (typeof response[Symbol.asyncIterator] === 'function') {
        const chunks: string[] = [];
        const stream = response as AsyncIterable<Uint8Array | Buffer | string>;

        for await (const chunk of stream) {
            if (typeof chunk === 'string') {
                chunks.push(chunk);
                continue;
            }

            chunks.push(decoder.decode(chunk instanceof Buffer ? new Uint8Array(chunk) : chunk));
        }

        return chunks.join('').trim();
    }

    return '';
}

function normalizeAgentResponse(rawResponse: string) {
    const parsed = parseAgentJsonCandidate(rawResponse);

    if (parsed !== null) {
        return parsed;
    }

    return {
        result: {
            role: 'assistant',
            content: [
                {
                    text: rawResponse,
                },
            ],
        },
    };
}

export async function invokeBedrockAgent(payload: AgentPayload) {
    const agentTarget = resolveAgentTarget();
    let rawResponse = '';

    if (agentTarget.kind === 'agentcore-runtime') {
        const client = getAgentCoreClient();
        const response = await client.send(
            new InvokeAgentRuntimeCommand({
                agentRuntimeArn: agentTarget.agentRuntimeArn,
                runtimeSessionId: randomUUID(),
                qualifier: agentTarget.qualifier,
                contentType: 'application/json',
                accept: 'application/json',
                payload: Buffer.from(JSON.stringify(payload)),
            }),
        );

        rawResponse = await readAgentCoreResponse(response.response);
    } else {
        const client = getBedrockClient();
        const response = await client.send(
            new InvokeAgentCommand({
                agentId: agentTarget.agentId,
                agentAliasId: agentTarget.agentAliasId,
                sessionId: randomUUID(),
                enableTrace: false,
                inputText: serializeAgentPayload(payload),
            }),
        );

        rawResponse = await readBedrockAgentCompletion(response.completion);
    }

    return normalizeAgentResponse(rawResponse);
}
