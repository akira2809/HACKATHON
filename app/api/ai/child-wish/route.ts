import { NextResponse } from 'next/server';
import { hasBedrockAgentConfig, invokeBedrockAgent } from '@/lib/bedrock-agent';

type ChildWishRequest = {
    familyId?: string;
    childId?: string;
    activity?: string;
};

export async function POST(request: Request) {
    try {
        const body = await request.json() as ChildWishRequest;

        if (!hasBedrockAgentConfig()) {
            return NextResponse.json(
                { error: 'The Bedrock agent is not configured yet.' },
                { status: 503 },
            );
        }

        if (!body.familyId || !body.childId || !body.activity) {
            return NextResponse.json(
                { error: 'familyId, childId, and activity are required.' },
                { status: 400 },
            );
        }

        const result = await invokeBedrockAgent({
            intent: 'childWish',
            familyId: body.familyId,
            childId: body.childId,
            activity: body.activity,
        });

        return NextResponse.json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Child wish request failed.';

        return NextResponse.json(
            { error: message },
            { status: 500 },
        );
    }
}
