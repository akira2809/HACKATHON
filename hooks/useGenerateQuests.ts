'use client';

import { create } from 'zustand';
import { generateQuestsWithAgent, type GenerateQuestsRouteResponse } from '@/lib/agent';
import type { ParentQuest } from '@/state/appState';
import { createQueryState, toErrorMessage } from './query-utils';

export type GenerateQuestSuggestionsInput = {
    childAge: number;
    childId: string;
    familyId: string;
    focusAreas?: string[];
    excludeTitles?: string[];
    lockedOptions?: ParentQuest[];
};

type GenerateQuestsQueryState = ReturnType<typeof createQueryState<ParentQuest[]>>;
type GenerateQuestsStore = {
    generate: (input: GenerateQuestSuggestionsInput) => Promise<ParentQuest[]>;
    queries: Record<string, GenerateQuestsQueryState>;
    reset: (input?: GenerateQuestSuggestionsInput) => void;
    versions: Record<string, number>;
};

const suggestionCatalog: Array<Omit<ParentQuest, 'id' | 'status'>> = [
    { title: 'Learn three new story words', description: 'A quiet language quest that feels curious and easy to begin.', reward: 10, category: 'Learning' },
    { title: 'Set the dinner table gently', description: 'A simple family help moment that feels calm and useful.', reward: 8, category: 'Responsibility' },
    { title: 'Take a five-minute stretch path', description: 'A movement reset that supports focus without raising the energy too much.', reward: 8, category: 'Movement' },
    { title: 'Water something living', description: 'A nurturing care quest that keeps the evening soft and grounded.', reward: 9, category: 'Care' },
    { title: 'Practice one tiny bedtime habit', description: 'A steady habit quest that helps the day close well.', reward: 7, category: 'Habit' },
    { title: 'Do a short balance challenge', description: 'A light exercise moment with just enough challenge to feel fun.', reward: 9, category: 'Exercise' },
    { title: 'Read ten calm pages', description: 'A focused reading quest that gives the day a warm landing.', reward: 10, category: 'Learning' },
    { title: 'Put away one shared space', description: 'A small responsibility quest that helps the room feel lighter.', reward: 8, category: 'Responsibility' },
    { title: 'Walk a quiet hallway lap', description: 'A gentle movement quest for a little reset indoors.', reward: 7, category: 'Movement' },
    { title: 'Write down one kind observation', description: 'A care quest that builds warmth without needing much time.', reward: 8, category: 'Care' },
    { title: 'Keep a tiny after-dinner routine', description: 'A habit quest that rewards consistency over intensity.', reward: 7, category: 'Habit' },
    { title: 'Do six slow star jumps', description: 'A short exercise quest that stays playful and controlled.', reward: 9, category: 'Exercise' },
];

function getQueryKey(input: GenerateQuestSuggestionsInput) {
    return `${input.familyId}:${input.childId}:${input.childAge}`;
}

function normalizeCategory(category?: string) {
    const normalizedCategory = (category?.trim() || 'learning').toLowerCase();
    const knownCategoryMap = {
        care: 'Care',
        exercise: 'Exercise',
        habit: 'Habit',
        learning: 'Learning',
        movement: 'Movement',
        responsibility: 'Responsibility',
    } as const;

    return knownCategoryMap[normalizedCategory as keyof typeof knownCategoryMap] ?? 'Learning';
}

function normalizeAgentOptions(
    response: GenerateQuestsRouteResponse,
    queryKey: string,
    version: number,
) {
    const sourceItems = response.quests?.length
        ? response.quests.map((quest) => ({
            category: quest.category,
            description: quest.description,
            id: quest.id,
            reward: quest.reward,
            title: quest.title,
        }))
        : (response.suggestions ?? []).map((suggestion, index) => ({
            category: suggestion.category,
            description: suggestion.description ?? '',
            id: `suggestion-${index + 1}`,
            reward: suggestion.reward ?? 0,
            title: suggestion.title ?? '',
        }));

    return sourceItems
        .filter((item) => item.title.trim())
        .map((item, index) => ({
            category: normalizeCategory(item.category),
            description: item.description,
            id: item.id || `${queryKey}-generated-${version}-${index}`,
            reward: item.reward,
            status: 'suggested' as const,
            title: item.title,
        }));
}

function buildSuggestionSet(
    input: GenerateQuestSuggestionsInput,
    agentOptions: ParentQuest[],
    version: number,
) {
    const queryKey = getQueryKey(input);
    const lockedOptions = input.lockedOptions ?? [];
    const excludedTitles = new Set((input.excludeTitles ?? []).map((title) => title.trim().toLowerCase()));
    const seenTitles = new Set<string>();
    const options: ParentQuest[] = [];

    lockedOptions.forEach((option, index) => {
        const titleKey = option.title.trim().toLowerCase();

        if (!titleKey || seenTitles.has(titleKey)) {
            return;
        }

        seenTitles.add(titleKey);
        options.push({
            ...option,
            id: option.id || `${queryKey}-locked-${index}`,
            status: 'suggested',
        });
    });

    agentOptions.forEach((option, index) => {
        const titleKey = option.title.trim().toLowerCase();

        if (!titleKey || excludedTitles.has(titleKey) || seenTitles.has(titleKey)) {
            return;
        }

        seenTitles.add(titleKey);
        options.push({
            ...option,
            id: option.id || `${queryKey}-agent-${version}-${index}`,
            status: 'suggested',
        });
    });

    const rotationOffset = (input.childAge + version * 3) % suggestionCatalog.length;

    for (let index = 0; index < suggestionCatalog.length && options.length < 5; index += 1) {
        const suggestion = suggestionCatalog[(rotationOffset + index) % suggestionCatalog.length];
        const titleKey = suggestion.title.trim().toLowerCase();

        if (excludedTitles.has(titleKey) || seenTitles.has(titleKey)) {
            continue;
        }

        seenTitles.add(titleKey);
        options.push({
            ...suggestion,
            id: `${queryKey}-${version}-${options.length + 1}`,
            status: 'suggested',
        });
    }

    return options;
}

const useGenerateQuestsStore = create<GenerateQuestsStore>((set, get) => ({
    generate: async (input) => {
        const queryKey = getQueryKey(input);
        const nextVersion = (get().versions[queryKey] ?? 0) + 1;

        set((state) => ({
            queries: {
                ...state.queries,
                [queryKey]: {
                    ...(state.queries[queryKey] ?? createQueryState<ParentQuest[]>([])),
                    error: null,
                    isLoading: true,
                },
            },
            versions: {
                ...state.versions,
                [queryKey]: nextVersion,
            },
        }));

        try {
            const response = await generateQuestsWithAgent({
                familyId: input.familyId,
                childAge: input.childAge,
                childId: input.childId,
                focusAreas: input.focusAreas,
            });
            const normalizedAgentOptions = normalizeAgentOptions(response, queryKey, nextVersion);
            const options = buildSuggestionSet(input, normalizedAgentOptions, nextVersion);

            set((state) => ({
                queries: {
                    ...state.queries,
                    [queryKey]: {
                        data: options,
                        error: null,
                        isLoaded: true,
                        isLoading: false,
                    },
                },
            }));

            return options;
        } catch (error) {
            const message = toErrorMessage(error, 'Failed to prepare quest suggestions.');

            set((state) => ({
                queries: {
                    ...state.queries,
                    [queryKey]: {
                        ...(state.queries[queryKey] ?? createQueryState<ParentQuest[]>([])),
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
            set({
                queries: {},
                versions: {},
            });
            return;
        }

        const queryKey = getQueryKey(input);

        set((state) => {
            const nextQueries = { ...state.queries };
            const nextVersions = { ...state.versions };
            delete nextQueries[queryKey];
            delete nextVersions[queryKey];

            return {
                queries: nextQueries,
                versions: nextVersions,
            };
        });
    },
    versions: {},
}));

export function useGenerateQuests(input?: GenerateQuestSuggestionsInput) {
    const queryKey = input ? getQueryKey(input) : '';
    const query = useGenerateQuestsStore((state) => state.queries[queryKey]);
    const generate = useGenerateQuestsStore((state) => state.generate);
    const reset = useGenerateQuestsStore((state) => state.reset);
    const resolvedQuery = query ?? createQueryState<ParentQuest[]>([]);

    return {
        error: resolvedQuery.error,
        generate: (nextInput?: GenerateQuestSuggestionsInput) => {
            const requestInput = nextInput ?? input;

            if (!requestInput) {
                return Promise.reject(new Error('generateQuestSuggestionsInput is required.'));
            }

            return generate(requestInput);
        },
        isLoaded: resolvedQuery.isLoaded,
        isLoading: resolvedQuery.isLoading,
        questOptions: resolvedQuery.data,
        reset: () => reset(input),
    };
}
