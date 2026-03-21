'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { homesteadApi, type CreateQuestInput, type QuestRecord } from '@/lib/homestead-api';
import { createMissingParameterError, createQueryState, getTodayDateString, type QueryOptions, toErrorMessage } from './query-utils';

type TodayQuestsQueryState = ReturnType<typeof createQueryState<QuestRecord[]>>;
type TodayQuestsStore = {
    completeQuest: (questId: string) => Promise<QuestRecord | null>;
    createQuests: (input: CreateQuestInput[]) => Promise<QuestRecord[]>;
    fetchTodayQuests: (childId: string, assignedDate?: string) => Promise<QuestRecord[]>;
    queries: Record<string, TodayQuestsQueryState>;
    removeQuest: (questId: string) => Promise<void>;
    startQuest: (questId: string) => Promise<QuestRecord | null>;
};

const emptyQuests: QuestRecord[] = [];

function getQueryKey(childId: string, assignedDate: string) {
    return `${childId}:${assignedDate}`;
}

function updateQuestAcrossQueries(
    queries: Record<string, TodayQuestsQueryState>,
    questId: string,
    update: (quest: QuestRecord) => QuestRecord | null,
) {
    return Object.fromEntries(
        Object.entries(queries).map(([key, query]) => [
            key,
            {
                ...query,
                data: query.data.flatMap((quest) => {
                    if (quest.id !== questId) {
                        return [quest];
                    }

                    const nextQuest = update(quest);
                    return nextQuest ? [nextQuest] : [];
                }),
            },
        ]),
    );
}

const useTodayQuestsStore = create<TodayQuestsStore>((set) => ({
    completeQuest: async (questId) => {
        const quest = await homesteadApi.quests.complete(questId);

        if (!quest) {
            return null;
        }

        set((state) => ({
            queries: updateQuestAcrossQueries(state.queries, questId, () => quest),
        }));

        return quest;
    },
    createQuests: async (input) => {
        const quests = await homesteadApi.quests.create(input);

        set((state) => {
            const nextQueries = { ...state.queries };

            quests.forEach((quest) => {
                const queryKey = getQueryKey(quest.childId, quest.assignedDate);
                const query = nextQueries[queryKey];

                if (!query) {
                    return;
                }

                nextQueries[queryKey] = {
                    ...query,
                    data: [...query.data, quest],
                    error: null,
                    isLoaded: true,
                };
            });

            return { queries: nextQueries };
        });

        return quests;
    },
    fetchTodayQuests: async (childId, assignedDate = getTodayDateString()) => {
        const queryKey = getQueryKey(childId, assignedDate);

        set((state) => ({
            queries: {
                ...state.queries,
                [queryKey]: {
                    ...(state.queries[queryKey] ?? createQueryState(emptyQuests)),
                    error: null,
                    isLoading: true,
                },
            },
        }));

        try {
            const quests = await homesteadApi.quests.listToday(childId, assignedDate);

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
            const message = toErrorMessage(error, 'Failed to load quests.');

            set((state) => ({
                queries: {
                    ...state.queries,
                    [queryKey]: {
                        ...(state.queries[queryKey] ?? createQueryState(emptyQuests)),
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
    removeQuest: async (questId) => {
        await homesteadApi.quests.remove(questId);

        set((state) => ({
            queries: updateQuestAcrossQueries(state.queries, questId, () => null),
        }));
    },
    startQuest: async (questId) => {
        const quest = await homesteadApi.quests.start(questId);

        if (!quest) {
            return null;
        }

        set((state) => ({
            queries: updateQuestAcrossQueries(state.queries, questId, () => quest),
        }));

        return quest;
    },
}));

export function useTodayQuests(childId?: string, assignedDate = getTodayDateString(), options: QueryOptions = {}) {
    const enabled = options.enabled ?? true;
    const queryKey = childId ? getQueryKey(childId, assignedDate) : '';
    const query = useTodayQuestsStore((state) => state.queries[queryKey]);
    const fetchTodayQuests = useTodayQuestsStore((state) => state.fetchTodayQuests);
    const createQuests = useTodayQuestsStore((state) => state.createQuests);
    const startQuest = useTodayQuestsStore((state) => state.startQuest);
    const completeQuest = useTodayQuestsStore((state) => state.completeQuest);
    const removeQuest = useTodayQuestsStore((state) => state.removeQuest);
    const resolvedQuery = query ?? createQueryState(emptyQuests);

    useEffect(() => {
        if (!enabled || !childId || resolvedQuery.isLoaded || resolvedQuery.isLoading) {
            return;
        }

        void fetchTodayQuests(childId, assignedDate);
    }, [assignedDate, childId, enabled, fetchTodayQuests, resolvedQuery.isLoaded, resolvedQuery.isLoading]);

    return {
        completeQuest,
        createQuests,
        error: resolvedQuery.error,
        isLoaded: resolvedQuery.isLoaded,
        isLoading: resolvedQuery.isLoading,
        quests: resolvedQuery.data,
        refetch: () => {
            if (!childId) {
                return Promise.reject(createMissingParameterError('childId'));
            }

            return fetchTodayQuests(childId, assignedDate);
        },
        removeQuest,
        startQuest,
    };
}
