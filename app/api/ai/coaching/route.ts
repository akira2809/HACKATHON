import { NextResponse } from 'next/server';
import { hasBedrockAgentConfig, invokeBedrockAgent } from '@/lib/bedrock-agent';

type ParentCoachingRequest = {
    familyId?: string;
    question?: string;
};

export async function POST(request: Request) {
    try {
        const body = await request.json() as ParentCoachingRequest;

        if (!hasBedrockAgentConfig()) {
            return NextResponse.json(
                { error: 'The Bedrock agent is not configured yet.' },
                { status: 503 },
            );
        }

        if (!body.familyId || !body.question) {
            return NextResponse.json(
                { error: 'familyId and question are required.' },
                { status: 400 },
            );
        }

        const result = await invokeBedrockAgent({
            intent: 'parentCoaching',
            familyId: body.familyId,
            question: body.question,
        });

        return NextResponse.json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Parent coaching request failed.';

        return NextResponse.json(
            { error: message },
            { status: 500 },
        );
    }
}
