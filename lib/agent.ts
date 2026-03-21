export type GeneratedQuestRouteItem = {
    id: string;
    title: string;
    reward: number;
    category: string;
    description: string;
    status: 'suggested';
};

export type GenerateQuestsRouteResponse = {
    intent: 'generateQuests' | string;
    suggestions?: Array<{
        title?: string;
        description?: string;
        category?: string;
        reward?: number;
        guidingQuestions?: Array<{
            step?: number;
            type?: string;
            prompt?: string;
        }>;
    }>;
    quests?: GeneratedQuestRouteItem[];
};

export async function callAgent(payload: Record<string, unknown>) {
    const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        const message =
            data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
                ? data.error
                : 'Failed to call agent.';

        throw new Error(message);
    }

    return data;
}

export async function generateQuestsWithAgent(payload: {
    familyId: string;
    childId: string;
    childAge: number;
    focusAreas?: string[];
}) {
    const response = await fetch('/api/ai/quests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            familyId: payload.familyId,
            childId: payload.childId,
            childAge: payload.childAge,
            focusAreas: payload.focusAreas,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        const message =
            data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
                ? data.error
                : 'Failed to generate quests.';

        throw new Error(message);
    }

    return data as GenerateQuestsRouteResponse;
}

export function requestParentCoaching(payload: {
    familyId: string;
    question: string;
}) {
    return callAgent({
        intent: 'parentCoaching',
        familyId: payload.familyId,
        question: payload.question,
    });
}

export function requestChildWish(payload: {
    familyId: string;
    childId: string;
    activity: string;
}) {
    return callAgent({
        intent: 'childWish',
        familyId: payload.familyId,
        childId: payload.childId,
        activity: payload.activity,
    });
}

export function promptLena(prompt: string) {
    return callAgent({ prompt });
}
