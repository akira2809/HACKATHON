'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import {
    generateQuestsWithAgent,
    type GenerateQuestsRouteResponse,
    type GeneratedQuestRouteItem,
} from '@/lib/agent';
import { createMissingParameterError, createQueryState, type QueryOptions, toErrorMessage } from './query-utils';

type GenerateQuestsInput = {
    childAge: number;
    childId: string;
    familyId: string;
    focusAreas?: string[];
};

type GenerateQuestsQueryState = ReturnType<typeof createQueryState<GeneratedQuestRouteItem[]>>;
type GenerateQuestsStore = {
    generate: (input: GenerateQuestsInput) => Promise<GeneratedQuestRouteItem[]>;
    queries: Record<string, GenerateQuestsQueryState>;
    reset: (input?: GenerateQuestsInput) => void;
};

function getQueryKey(input: GenerateQuestsInput) {
    return [
        input.familyId,
        input.childId,
        input.childAge,
        ...(input.focusAreas ?? []),
    ].join(':');
}

function normalizeGeneratedQuests(response: GenerateQuestsRouteResponse) {
    if (Array.isArray(response.quests)) {
        return response.quests;
    }

    if (!Array.isArray(response.suggestions)) {
        return [];
    }

    return response.suggestions.map((suggestion, index) => ({
        id: `generated-${index + 1}`,
        title: suggestion.title ?? '',
        reward: suggestion.reward ?? 0,
        category: suggestion.category ?? 'learning',
        description: suggestion.description ?? '',
        status: 'suggested' as const,
    }));
}

const useGenerateQuestsStore = create<GenerateQuestsStore>((set) => ({
    generate: async (input) => {
        const queryKey = getQueryKey(input);

        set((state) => ({
            queries: {
                ...state.queries,
                [queryKey]: {
                    ...(state.queries[queryKey] ?? createQueryState<GeneratedQuestRouteItem[]>([])),
                    error: null,
                    isLoading: true,
                },
            },
        }));

        try {
            const response = await generateQuestsWithAgent(input);
            const quests = normalizeGeneratedQuests(response);

            set((state) => ({
                queries: {
                    ...state.queries,
                    [queryKey]: {
                        data: quests,
                        error: null,
                        isLoaded: true,
                        isLoading: false,
                    },
                },
            }));

            return quests;
        } catch (error) {
            const message = toErrorMessage(error, 'Failed to generate quests.');

            set((state) => ({
                queries: {
                    ...state.queries,
                    [queryKey]: {
                        ...(state.queries[queryKey] ?? createQueryState<GeneratedQuestRouteItem[]>([])),
                        error: message,
                        isLoaded: true,
                        isLoading: false,
                    },
                },
            }));

            throw error;
        }
    },
    queries: {},
    reset: (input) => {
        if (!input) {
            set({ queries: {} });
            return;
        }

        const queryKey = getQueryKey(input);

        set((state) => {
            const nextQueries = { ...state.queries };
            delete nextQueries[queryKey];
            return { queries: nextQueries };
        });
    },
}));

export function useGenerateQuests(input?: GenerateQuestsInput, options: QueryOptions = {}) {
    const enabled = options.enabled ?? false;
    const queryKey = input ? getQueryKey(input) : '';
    const query = useGenerateQuestsStore((state) => state.queries[queryKey]);
    const generate = useGenerateQuestsStore((state) => state.generate);
    const reset = useGenerateQuestsStore((state) => state.reset);
    const resolvedQuery = query ?? createQueryState<GeneratedQuestRouteItem[]>([]);

    useEffect(() => {
        if (!enabled || !input || resolvedQuery.isLoaded || resolvedQuery.isLoading) {
            return;
        }

        void generate(input);
    }, [enabled, generate, input, resolvedQuery.isLoaded, resolvedQuery.isLoading]);

    return {
        error: resolvedQuery.error,
        generatedQuests: resolvedQuery.data,
        generate: (nextInput?: GenerateQuestsInput) => {
            const requestInput = nextInput ?? input;

            if (!requestInput) {
                return Promise.reject(createMissingParameterError('generateQuestsInput'));
            }

            return generate(requestInput);
        },
        isLoaded: resolvedQuery.isLoaded,
        isLoading: resolvedQuery.isLoading,
        reset: () => reset(input),
    };
}
