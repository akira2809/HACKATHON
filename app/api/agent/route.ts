import { NextRequest, NextResponse } from 'next/server';
import { invokeBedrockAgent } from '@/lib/bedrock-agent';

/**
 * POST /api/agent
 *
 * Proxies frontend requests to the configured AWS Bedrock agent runtime.
 * The frontend should call this route instead of talking to AWS directly.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return NextResponse.json(
                { error: 'A JSON object payload is required.' },
                { status: 400 },
            );
        }

        const result = await invokeBedrockAgent(body as Record<string, unknown>);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Agent invocation failed:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to invoke agent.',
            },
            { status: 500 },
        );
    }
}
