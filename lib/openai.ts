import 'server-only';

export type GenerateQuestsInput = {
    childName: string;
    age: number;
    categories: string[];
    goalTitle?: string | null;
    householdName?: string;
    tone?: string;
};

export type GeneratedQuest = {
    title: string;
    reward: number;
    category: string;
    description: string;
};

export type GenerateAdvisorSuggestionInput = {
    childName: string;
    age: number;
    preferences: string[];
    durationMinutes: number;
    theme?: string;
    householdName?: string;
};

export type NearbySuggestion = {
    name: string;
    query: string;
    distanceLabel: string;
    ratingLabel: string;
    note: string;
};

export type AdvisorSuggestion = {
    activity: string;
    duration: string;
    rationale: string;
    supplies: string[];
    encouragement: string;
    nearbySuggestions: NearbySuggestion[];
};

type StructuredResponseOptions = {
    schemaName: string;
    schema: Record<string, unknown>;
    prompt: string;
    model?: string;
};

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';

function getOpenAIApiKey() {
    const apiKey = process.env.OPENAI_API_KEY
        ?? process.env.CHATGPT_API_KEY
        ?? process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error(
            'OpenAI API key is missing. Add OPENAI_API_KEY to .env.local before using the AI provider.',
        );
    }

    return apiKey;
}

function getOpenAIModel(model?: string) {
    return model
        ?? process.env.OPENAI_MODEL
        ?? process.env.NEXT_PUBLIC_OPENAI_MODEL
        ?? 'gpt-4.1-mini';
}

function stripCodeFence(value: string) {
    return value
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
}

async function createStructuredResponse<T>({
    schemaName,
    schema,
    prompt,
    model,
}: StructuredResponseOptions): Promise<T> {
    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${getOpenAIApiKey()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: getOpenAIModel(model),
            input: prompt,
            text: {
                format: {
                    type: 'json_schema',
                    name: schemaName,
                    schema,
                    strict: true,
                },
            },
        }),
        cache: 'no-store',
    });

    const data = await response.json() as {
        output_text?: string;
        error?: {
            message?: string;
        };
    };

    if (!response.ok) {
        throw new Error(data.error?.message ?? 'OpenAI request failed.');
    }

    if (!data.output_text) {
        throw new Error('OpenAI response did not include structured output text.');
    }

    return JSON.parse(stripCodeFence(data.output_text)) as T;
}

export async function generateDailyQuests(input: GenerateQuestsInput) {
    const categories = input.categories.length
        ? input.categories.join(', ')
        : 'learning, exercise, responsibility';
    const prompt = [
        'You are Lena AI Steward for a calm family companion app.',
        'Generate exactly 3 daily quests for one child.',
        'Each quest should feel warm, practical, age-appropriate, and easy to approve for a parent.',
        'Avoid punishments, guilt, or task-manager language.',
        '',
        `Household: ${input.householdName ?? 'Lena\'s Homestead'}`,
        `Child: ${input.childName}`,
        `Age: ${input.age}`,
        `Goal: ${input.goalTitle ?? 'No active goal yet'}`,
        `Tone: ${input.tone ?? 'calm, premium, emotionally warm'}`,
        `Categories: ${categories}`,
        '',
        'Return rewards between 6 and 14 glowing seeds.',
        'Descriptions should be 1 sentence and explain why the quest fits the child.',
    ].join('\n');

    return createStructuredResponse<GeneratedQuest[]>({
        schemaName: 'daily_quests',
        prompt,
        schema: {
            type: 'array',
            minItems: 3,
            maxItems: 3,
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['title', 'reward', 'category', 'description'],
                properties: {
                    title: {
                        type: 'string',
                        minLength: 3,
                    },
                    reward: {
                        type: 'number',
                        minimum: 1,
                    },
                    category: {
                        type: 'string',
                    },
                    description: {
                        type: 'string',
                        minLength: 10,
                    },
                },
            },
        },
    });
}

export async function generateAdvisorSuggestion(input: GenerateAdvisorSuggestionInput) {
    const prompt = [
        'You are Lena AI Steward for a premium family dashboard called Lena\'s Homestead.',
        'Suggest one calm shared family activity for a parent and child.',
        'The activity should feel cozy, warm, and realistic for a hackathon demo.',
        'Also include up to 2 nearby place ideas that match the child\'s interests.',
        '',
        `Household: ${input.householdName ?? 'Lena\'s Homestead'}`,
        `Child: ${input.childName}`,
        `Age: ${input.age}`,
        `Preferences: ${input.preferences.join(', ') || 'cozy homestead'}`,
        `Theme: ${input.theme ?? 'cozy homestead'}`,
        `Duration: ${input.durationMinutes} minutes`,
    ].join('\n');

    return createStructuredResponse<AdvisorSuggestion>({
        schemaName: 'advisor_suggestion',
        prompt,
        schema: {
            type: 'object',
            additionalProperties: false,
            required: ['activity', 'duration', 'rationale', 'supplies', 'encouragement', 'nearbySuggestions'],
            properties: {
                activity: {
                    type: 'string',
                    minLength: 3,
                },
                duration: {
                    type: 'string',
                    minLength: 3,
                },
                rationale: {
                    type: 'string',
                    minLength: 10,
                },
                supplies: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                encouragement: {
                    type: 'string',
                    minLength: 10,
                },
                nearbySuggestions: {
                    type: 'array',
                    maxItems: 2,
                    items: {
                        type: 'object',
                        additionalProperties: false,
                        required: ['name', 'query', 'distanceLabel', 'ratingLabel', 'note'],
                        properties: {
                            name: {
                                type: 'string',
                            },
                            query: {
                                type: 'string',
                            },
                            distanceLabel: {
                                type: 'string',
                            },
                            ratingLabel: {
                                type: 'string',
                            },
                            note: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        },
    });
}
