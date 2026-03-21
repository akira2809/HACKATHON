'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { homesteadApi, type CreateGoalInput, type GoalRecord, type UpdateGoalInput } from '@/lib/homestead-api';
import { createMissingParameterError, createQueryState, type QueryOptions, toErrorMessage } from './query-utils';

type GoalsQueryState = ReturnType<typeof createQueryState<GoalRecord[]>>;
type GoalsStore = {
    createGoal: (input: CreateGoalInput) => Promise<GoalRecord | null>;
    fetchGoals: (childId: string) => Promise<GoalRecord[]>;
    queries: Record<string, GoalsQueryState>;
    updateGoal: (childId: string, goalId: string, input: UpdateGoalInput) => Promise<GoalRecord | null>;
};

const emptyGoals: GoalRecord[] = [];

const useGoalsStore = create<GoalsStore>((set) => ({
    createGoal: async (input) => {
        const goal = await homesteadApi.goals.create(input);

        if (!goal) {
            return null;
        }

        set((state) => {
            const query = state.queries[input.childId];

            if (!query) {
                return state;
            }

            return {
                queries: {
                    ...state.queries,
                    [input.childId]: {
                        ...query,
                        data: [...query.data, goal],
                        error: null,
                        isLoaded: true,
                    },
                },
            };
        });

        return goal;
    },
    fetchGoals: async (childId) => {
        set((state) => ({
            queries: {
                ...state.queries,
                [childId]: {
                    ...(state.queries[childId] ?? createQueryState(emptyGoals)),
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
                    [childId]: {
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
                    [childId]: {
                        ...(state.queries[childId] ?? createQueryState(emptyGoals)),
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
            const query = state.queries[childId];

            if (!query) {
                return state;
            }

            return {
                queries: {
                    ...state.queries,
                    [childId]: {
                        ...query,
                        data: query.data.map((item) => (item.id === goalId ? goal : item)),
                    },
                },
            };
        });

        return goal;
    },
}));

export function useGoals(childId?: string, options: QueryOptions = {}) {
    const enabled = options.enabled ?? true;
    const query = useGoalsStore((state) => (childId ? state.queries[childId] : undefined));
    const fetchGoals = useGoalsStore((state) => state.fetchGoals);
    const createGoal = useGoalsStore((state) => state.createGoal);
    const updateGoal = useGoalsStore((state) => state.updateGoal);
    const resolvedQuery = query ?? createQueryState(emptyGoals);

    useEffect(() => {
        if (!enabled || !childId || resolvedQuery.isLoaded || resolvedQuery.isLoading) {
            return;
        }

        void fetchGoals(childId);
    }, [childId, enabled, fetchGoals, resolvedQuery.isLoaded, resolvedQuery.isLoading]);

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

            return fetchGoals(childId);
        },
        updateGoal: (goalId: string, input: UpdateGoalInput) => {
            if (!childId) {
                return Promise.reject(createMissingParameterError('childId'));
            }

            return updateGoal(childId, goalId, input);
        },
    };
}
