import { NextResponse } from 'next/server';
import { hasBedrockAgentConfig, invokeBedrockAgent } from '@/lib/bedrock-agent';
import { generateDailyQuests } from '@/lib/openai';

type GenerateQuestsRequest = {
    familyId?: string;
    childId?: string;
    childName?: string;
    age?: number;
    childAge?: number;
    categories?: string[];
    focusAreas?: string[];
    goalTitle?: string | null;
    householdName?: string;
    tone?: string;
};

type AgentQuestSuggestion = {
    title?: string;
    description?: string;
    category?: string;
    reward?: number;
    guidingQuestions?: Array<{
        step?: number;
        type?: string;
        prompt?: string;
    }>;
};

type AgentQuestResponse = {
    intent?: string;
    suggestions?: AgentQuestSuggestion[];
};

const DEFAULT_FOCUS_AREAS = ['learning', 'exercise', 'responsibility'];

function mapAgentCategory(category?: string) {
    switch (category?.toLowerCase()) {
        case 'learning':
            return 'Learning';
        case 'responsibility':
            return 'Responsibility';
        case 'exercise':
            return 'Movement';
        case 'habit':
            return 'Care';
        default:
            return 'Learning';
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as GenerateQuestsRequest;
        const childAge = body.childAge ?? body.age;
        const focusAreas = body.focusAreas ?? body.categories ?? DEFAULT_FOCUS_AREAS;
        const isContractRequest = Boolean(body.familyId || body.childId || typeof body.childAge === 'number' || body.focusAreas?.length);

        if (isContractRequest) {
            if (!hasBedrockAgentConfig()) {
                return NextResponse.json(
                    { error: 'The Bedrock agent is not configured yet. Add the AWS agent environment variables before using the contract payload.' },
                    { status: 503 },
                );
            }

            if (!body.familyId || !body.childId || typeof childAge !== 'number') {
                return NextResponse.json(
                    { error: 'familyId, childId, and childAge are required for the generateQuests contract payload.' },
                    { status: 400 },
                );
            }

            const agentResponse = await invokeBedrockAgent({
                intent: 'generateQuests',
                familyId: body.familyId,
                childId: body.childId,
                childAge,
                focusAreas,
            }) as AgentQuestResponse;

            const suggestions = Array.isArray(agentResponse.suggestions)
                ? agentResponse.suggestions
                : [];

            const quests = suggestions.map((suggestion, index) => ({
                id: `agent-${body.childId}-${index + 1}`,
                title: suggestion.title?.trim() || `Quest ${index + 1}`,
                reward: typeof suggestion.reward === 'number' ? suggestion.reward : 10,
                category: mapAgentCategory(suggestion.category),
                description: suggestion.description?.trim() || 'A gentle quest from Lena is ready for review.',
                status: 'suggested' as const,
            }));

            return NextResponse.json({
                intent: agentResponse.intent ?? 'generateQuests',
                suggestions,
                quests,
            });
        }

        if (!body.childName || typeof childAge !== 'number') {
            return NextResponse.json(
                { error: 'Provide familyId, childId, and childAge for the contract payload, or childName and age for the legacy fallback route.' },
                { status: 400 },
            );
        }

        const quests = await generateDailyQuests({
            childName: body.childName,
            age: childAge,
            categories: focusAreas,
            goalTitle: body.goalTitle,
            householdName: body.householdName,
            tone: body.tone,
        });

        return NextResponse.json({ quests });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Quest generation failed.';

        return NextResponse.json(
            { error: message },
            { status: 500 },
        );
    }
}
