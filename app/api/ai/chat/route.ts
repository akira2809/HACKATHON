import { NextResponse } from 'next/server';
import { hasBedrockAgentConfig, invokeBedrockAgent } from '@/lib/bedrock-agent';

type AgentChatRequest = {
    prompt?: string;
};

export async function POST(request: Request) {
    try {
        const body = await request.json() as AgentChatRequest;

        if (!hasBedrockAgentConfig()) {
            return NextResponse.json(
                { error: 'The Bedrock agent is not configured yet.' },
                { status: 503 },
            );
        }

        if (!body.prompt) {
            return NextResponse.json(
                { error: 'prompt is required.' },
                { status: 400 },
            );
        }

        const result = await invokeBedrockAgent({
            prompt: body.prompt,
        });

        return NextResponse.json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Agent chat request failed.';

        return NextResponse.json(
            { error: message },
            { status: 500 },
        );
    }
}
