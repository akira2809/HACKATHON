'use client';

import { useEffect, useRef } from 'react';
import { useEffect, useRef } from 'react';
import { create } from 'zustand';
import { homesteadApi, type CreateQuestInput, type QuestRecord } from '@/lib/homestead-api';
import { createMissingParameterError, createQueryState, getTodayDateString, type QueryOptions, toErrorMessage } from './query-utils';

type TodayQuestsQueryState = ReturnType<typeof createQueryState<QuestRecord[]>>;
type TodayQuestsStore = {
    completeQuest: (questId: string) => Promise<QuestRecord | null>;
    createQuests: (input: CreateQuestInput[]) => Promise<QuestRecord[]>;
    fetchTodayQuests: (childId: string, assignedDate?: string, sessionVersion?: number) => Promise<QuestRecord[]>;
    queries: Record<string, TodayQuestsQueryState>;
    removeQuest: (questId: string) => Promise<void>;
    startQuest: (questId: string) => Promise<QuestRecord | null>;
};

const emptyQuests: QuestRecord[] = [];

function getQueryKey(childId: string, assignedDate: string, sessionVersion: number) {
    return `${childId}:${assignedDate}:${sessionVersion}`;
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

const useTodayQuestsStore = create<TodayQuestsStore>((set, get) => ({
    completeQuest: async (questId) => {
        // Complete the quest
        const quest = await homesteadApi.quests.complete(questId);
        if (!quest) {
            return null;
        }

        // Update the child's coins
        const { childId, reward } = quest;
        try {
            // Fetch the child record by ID
            const child = await homesteadApi.children.getById(childId);
            if (child && typeof child.coins === 'number') {
                const newCoins = child.coins + (reward || 0);
                await homesteadApi.children.update(childId, { coins: newCoins });
            }
        } catch (error) {
            // Log but don't fail if coin update fails
            console.error('Failed to update child coins:', error);
        }

        set((state) => ({
            queries: updateQuestAcrossQueries(state.queries, questId, () => quest),
        }));
        broadcastQuestSync(quest.childId, quest.assignedDate);

        return quest;
    },
    createQuests: async (input) => {
        const quests = await homesteadApi.quests.create(input);

        set((state) => {
            const nextQueries = { ...state.queries };

            quests.forEach((quest) => {
                // Update ALL query versions for this childId
                Object.keys(nextQueries).forEach((key) => {
                    if (key.startsWith(quest.childId)) {
                        nextQueries[key] = {
                            ...nextQueries[key],
                            data: [...nextQueries[key].data, quest],
                            error: null,
                            isLoaded: true,
                        };
                    }
                });
            });

            return { queries: nextQueries };
        });
        quests.forEach((quest) => {
            broadcastQuestSync(quest.childId, quest.assignedDate);
        });

        return quests;
    },
    fetchTodayQuests: async (childId, assignedDate = getTodayDateString(), sessionVersion = 0) => {
        const queryKey = getQueryKey(childId, assignedDate, sessionVersion);

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
        const removedQuest = Object.values(get().queries)
            .flatMap((query) => query.data)
            .find((quest) => quest.id === questId);

        await homesteadApi.quests.remove(questId);

        set((state) => ({
            queries: updateQuestAcrossQueries(state.queries, questId, () => null),
        }));

        if (removedQuest) {
            broadcastQuestSync(removedQuest.childId, removedQuest.assignedDate);
        }
    },
    startQuest: async (questId) => {
        const quest = await homesteadApi.quests.start(questId);

        if (!quest) {
            return null;
        }

        set((state) => ({
            queries: updateQuestAcrossQueries(state.queries, questId, () => quest),
        }));
        broadcastQuestSync(quest.childId, quest.assignedDate);

        return quest;
    },
}));

export function useTodayQuests(childId?: string, assignedDate = getTodayDateString(), options: QueryOptions = {}) {
    const { sessionVersion = 0 } = options as QueryOptions & { sessionVersion?: number };
    const enabled = options.enabled ?? true;
    const queryKey = childId ? getQueryKey(childId, assignedDate, sessionVersion) : '';
    const query = useTodayQuestsStore((state) => state.queries[queryKey]);
    const fetchTodayQuests = useTodayQuestsStore((state) => state.fetchTodayQuests);
    const createQuests = useTodayQuestsStore((state) => state.createQuests);
    const startQuest = useTodayQuestsStore((state) => state.startQuest);
    const completeQuest = useTodayQuestsStore((state) => state.completeQuest);
    const removeQuest = useTodayQuestsStore((state) => state.removeQuest);
    const resolvedQuery = query ?? createQueryState(emptyQuests);

    // Track previous session version
    const prevSessionVersionRef = useRef(sessionVersion);

    useEffect(() => {
        if (!enabled || !childId) {
            return;
        }

        const channel = getQuestSyncChannel();

        if (!channel) {
            const handleStorage = (event: StorageEvent) => {
                if (!event.newValue || event.key !== QUEST_SYNC_STORAGE_KEY) {
                    return;
                }

                try {
                    const payload = JSON.parse(event.newValue) as QuestSyncMessage;

                    if (
                        payload.type !== 'quest-updated'
                        || payload.source === QUEST_SYNC_SOURCE
                        || payload.childId !== childId
                        || payload.assignedDate !== assignedDate
                    ) {
                        return;
                    }

                    void fetchTodayQuests(childId, assignedDate);
                } catch {
                    return;
                }
            };

            window.addEventListener('storage', handleStorage);

            return () => {
                window.removeEventListener('storage', handleStorage);
            };
        }

        const handleMessage = (event: MessageEvent<QuestSyncMessage>) => {
            const payload = event.data;

            if (
                payload.type !== 'quest-updated'
                || payload.source === QUEST_SYNC_SOURCE
                || payload.childId !== childId
                || payload.assignedDate !== assignedDate
            ) {
                return;
            }

            void fetchTodayQuests(childId, assignedDate);
        };

        channel.addEventListener('message', handleMessage);

        const handleStorage = (event: StorageEvent) => {
            if (!event.newValue || event.key !== QUEST_SYNC_STORAGE_KEY) {
                return;
            }

            try {
                const payload = JSON.parse(event.newValue) as QuestSyncMessage;

                if (
                    payload.type !== 'quest-updated'
                    || payload.source === QUEST_SYNC_SOURCE
                    || payload.childId !== childId
                    || payload.assignedDate !== assignedDate
                ) {
                    return;
                }

                void fetchTodayQuests(childId, assignedDate);
            } catch {
                return;
            }
        };

        window.addEventListener('storage', handleStorage);

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                void fetchTodayQuests(childId, assignedDate);
            }
        };

        const handleFocus = () => {
            void fetchTodayQuests(childId, assignedDate);
        };

        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('focus', handleFocus);

        return () => {
            channel.removeEventListener('message', handleMessage);
            window.removeEventListener('storage', handleStorage);
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('focus', handleFocus);
        };
    }, [assignedDate, childId, enabled, fetchTodayQuests]);

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

            return fetchTodayQuests(childId, assignedDate, sessionVersion);
        },
        removeQuest,
        startQuest,
    };
}
