import { NextResponse } from 'next/server';
import { hasBedrockAgentConfig, invokeBedrockAgent } from '@/lib/bedrock-agent';

type GenerateMomentsRequest = {
    familyId?: string;
    childId?: string;
    childAge?: number;
    location?: string;
    theme?: string;
};

type AgentMomentSuggestion = {
    title?: string;
    description?: string;
    duration?: string;
    location?: string;
    supplies?: string[];
    rewards?: {
        seeds?: number;
        tokens?: number;
    };
};

type AgentMomentsResponse = {
    intent?: string;
    suggestions?: AgentMomentSuggestion[];
};

export async function POST(request: Request) {
    try {
        const body = await request.json() as GenerateMomentsRequest;
        const childAge = body.childAge ?? 8;

        if (!hasBedrockAgentConfig()) {
            return NextResponse.json(
                { error: 'The Bedrock agent is not configured yet. Add the AWS agent environment variables before using the plannerMoments contract.' },
                { status: 503 },
            );
        }

        if (!body.familyId || !body.childId) {
            return NextResponse.json(
                { error: 'familyId and childId are required for the plannerMoments contract payload.' },
                { status: 400 },
            );
        }

        const agentResponse = await invokeBedrockAgent({
            intent: 'planMoment',
            familyId: body.familyId,
            childId: body.childId,
            childAge,
            location: body.location,
            theme: body.theme,
        }) as AgentMomentsResponse;

        const suggestions = Array.isArray(agentResponse.suggestions)
            ? agentResponse.suggestions
            : [];

        const activities = suggestions.map((suggestion, index) => ({
            id: `moment-${body.childId}-${Date.now()}-${index + 1}`,
            title: suggestion.title?.trim() || `Family Moment ${index + 1}`,
            description: suggestion.description?.trim() || 'A wonderful family moment awaits.',
            duration: suggestion.duration || '15 minutes',
            location: suggestion.location || body.location || 'Home',
            supplies: suggestion.supplies || [],
            rewards: {
                seeds: suggestion.rewards?.seeds ?? 5,
                tokens: suggestion.rewards?.tokens ?? 3,
            },
        }));

        return NextResponse.json({
            intent: agentResponse.intent ?? 'planMoment',
            suggestions,
            activities,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Moment generation failed.';

        return NextResponse.json(
            { error: message },
            { status: 500 },
        );
    }
}
