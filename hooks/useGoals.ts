'use client';

import { useEffect, useRef } from 'react';
import { create } from 'zustand';
import { homesteadApi, type CreateGoalInput, type GoalRecord, type UpdateGoalInput } from '@/lib/homestead-api';
import { createMissingParameterError, createQueryState, type QueryOptions, toErrorMessage } from './query-utils';

type GoalsQueryState = ReturnType<typeof createQueryState<GoalRecord[]>>;
type GoalsStore = {
    createGoal: (input: CreateGoalInput) => Promise<GoalRecord | null>;
    fetchGoals: (childId: string, sessionVersion?: number) => Promise<GoalRecord[]>;
    queries: Record<string, GoalsQueryState>;
    updateGoal: (childId: string, goalId: string, input: UpdateGoalInput) => Promise<GoalRecord | null>;
};

const emptyGoals: GoalRecord[] = [];

function normalizeChildIds(childIds: string[]) {
    return Array.from(new Set(childIds.filter(Boolean)));
}

const useGoalsStore = create<GoalsStore>((set) => ({
    createGoal: async (input) => {
        const goal = await homesteadApi.goals.create(input);

        if (!goal) {
            return null;
        }

        set((state) => {
            // Update in ALL query versions for this childId
            const nextQueries: Record<string, GoalsQueryState> = {};
            Object.entries(state.queries).forEach(([key, query]) => {
                if (key.startsWith(input.childId)) {
                    nextQueries[key] = {
                        ...query,
                        data: [...query.data, goal],
                        error: null,
                        isLoaded: true,
                    };
                } else {
                    nextQueries[key] = query;
                }
            });

            return { queries: nextQueries };
        });

        return goal;
    },
    fetchGoals: async (childId, sessionVersion = 0) => {
        const queryKey = `${childId}:${sessionVersion}`;

        set((state) => ({
            queries: {
                ...state.queries,
                [queryKey]: {
                    ...(state.queries[queryKey] ?? createQueryState(emptyGoals)),
                    error: null,
                    isLoading: true,
                },
            },
        }));

        try {
            const goals = await homesteadApi.goals.listByChild(childId);

            set((state) => ({
                queries: {
                    ...state.queries,
                    [queryKey]: {
                        data: goals,
                        error: null,
                        isLoaded: true,
                        isLoading: false,
                    },
                },
            }));

            return goals;
        } catch (error) {
            const message = toErrorMessage(error, 'Failed to load goals.');

            set((state) => ({
                queries: {
                    ...state.queries,
                    [queryKey]: {
                        ...(state.queries[queryKey] ?? createQueryState(emptyGoals)),
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
    updateGoal: async (childId, goalId, input) => {
        const goal = await homesteadApi.goals.update(goalId, input);

        if (!goal) {
            return null;
        }

        set((state) => {
            // Update in ALL query versions for this childId
            const nextQueries: Record<string, GoalsQueryState> = {};
            Object.entries(state.queries).forEach(([key, query]) => {
                if (key.startsWith(childId)) {
                    nextQueries[key] = {
                        ...query,
                        data: query.data.map((item) => (item.id === goalId ? goal : item)),
                    };
                } else {
                    nextQueries[key] = query;
                }
            });

            return { queries: nextQueries };
        });

        return goal;
    },
}));

export function useGoals(childId?: string, options: QueryOptions = {}) {
    const { sessionVersion = 0 } = options as QueryOptions & { sessionVersion?: number };
    const enabled = options.enabled ?? true;
    const queryKey = childId ? `${childId}:${sessionVersion}` : '';
    const query = useGoalsStore((state) => (queryKey ? state.queries[queryKey] : undefined));
    const fetchGoals = useGoalsStore((state) => state.fetchGoals);
    const createGoal = useGoalsStore((state) => state.createGoal);
    const updateGoal = useGoalsStore((state) => state.updateGoal);
    const resolvedQuery = query ?? createQueryState(emptyGoals);

    // Track previous session version
    const prevSessionVersionRef = useRef(sessionVersion);

    useEffect(() => {
        if (!enabled || !childId) {
            return;
        }

        // Re-fetch when session version changes
        const sessionChanged = prevSessionVersionRef.current !== sessionVersion;
        prevSessionVersionRef.current = sessionVersion;

        if (sessionChanged || !resolvedQuery.isLoaded) {
            if (!resolvedQuery.isLoading) {
                void fetchGoals(childId, sessionVersion);
            }
        }
    }, [enabled, childId, sessionVersion, fetchGoals, resolvedQuery.isLoaded, resolvedQuery.isLoading]);

    return {
        createGoal,
        error: resolvedQuery.error,
        goals: resolvedQuery.data,
        isLoaded: resolvedQuery.isLoaded,
        isLoading: resolvedQuery.isLoading,
        refetch: () => {
            if (!childId) {
                return Promise.reject(createMissingParameterError('childId'));
            }

            return fetchGoals(childId, sessionVersion);
        },
        updateGoal: (goalId: string, input: UpdateGoalInput) => {
            if (!childId) {
                return Promise.reject(createMissingParameterError('childId'));
            }

            return updateGoal(childId, goalId, input);
        },
    };
}

export function useGoalsMap(childIds: string[] = [], options: QueryOptions = {}) {
    const enabled = options.enabled ?? true;
    const fetchGoals = useGoalsStore((state) => state.fetchGoals);
    const queries = useGoalsStore((state) => state.queries);
    const normalizedChildIds = normalizeChildIds(childIds);

    useEffect(() => {
        if (!enabled || !normalizedChildIds.length) {
            return;
        }

        normalizedChildIds.forEach((childId) => {
            const query = queries[childId];

            if (query?.isLoaded || query?.isLoading) {
                return;
            }

            void fetchGoals(childId);
        });
    }, [childIds, enabled, fetchGoals, normalizedChildIds, queries]);

    const goalsByChild = normalizedChildIds.reduce<Record<string, GoalRecord[]>>((result, childId) => {
        result[childId] = queries[childId]?.data ?? emptyGoals;
        return result;
    }, {});

    return {
        error: normalizedChildIds.map((childId) => queries[childId]?.error).find(Boolean) ?? null,
        goalsByChild,
        isLoaded: normalizedChildIds.every((childId) => queries[childId]?.isLoaded ?? false),
        isLoading: enabled && normalizedChildIds.some((childId) => {
            const query = queries[childId];
            return !query || query.isLoading || !query.isLoaded;
        }),
        refetch: () => Promise.all(normalizedChildIds.map((childId) => fetchGoals(childId))),
    };
}
