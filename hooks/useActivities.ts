'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { homesteadApi, type ActivityRecord, type CreateActivityInput, type UpdateActivityInput } from '@/lib/homestead-api';
import { createMissingParameterError, createQueryState, type QueryOptions, toErrorMessage } from './query-utils';

type ActivitiesQueryState = ReturnType<typeof createQueryState<ActivityRecord[]>>;
type ActivitiesStore = {
    completeActivity: (familyId: string, activityId: string, input: UpdateActivityInput) => Promise<ActivityRecord | null>;
    createActivity: (input: CreateActivityInput) => Promise<ActivityRecord | null>;
    fetchActivities: (familyId: string) => Promise<ActivityRecord[]>;
    queries: Record<string, ActivitiesQueryState>;
};

const emptyActivities: ActivityRecord[] = [];

const useActivitiesStore = create<ActivitiesStore>((set) => ({
    completeActivity: async (familyId, activityId, input) => {
        const activity = await homesteadApi.activities.complete(activityId, input);

        if (!activity) {
            return null;
        }

        set((state) => {
            const query = state.queries[familyId];

            if (!query) {
                return state;
            }

            return {
                queries: {
                    ...state.queries,
                    [familyId]: {
                        ...query,
                        data: query.data.map((item) => (item.id === activityId ? activity : item)),
                    },
                },
            };
        });

        return activity;
    },
    createActivity: async (input) => {
        const activity = await homesteadApi.activities.create(input);

        if (!activity) {
            return null;
        }

        set((state) => {
            const query = state.queries[input.familyId];

            if (!query) {
                return state;
            }

            return {
                queries: {
                    ...state.queries,
                    [input.familyId]: {
                        ...query,
                        data: [...query.data, activity],
                        error: null,
                        isLoaded: true,
                    },
                },
            };
        });

        return activity;
    },
    fetchActivities: async (familyId) => {
        set((state) => ({
            queries: {
                ...state.queries,
                [familyId]: {
                    ...(state.queries[familyId] ?? createQueryState(emptyActivities)),
                    error: null,
                    isLoading: true,
                },
            },
        }));

        try {
            const activities = await homesteadApi.activities.listByFamily(familyId);

            set((state) => ({
                queries: {
                    ...state.queries,
                    [familyId]: {
                        data: activities,
                        error: null,
                        isLoaded: true,
                        isLoading: false,
                    },
                },
            }));

            return activities;
        } catch (error) {
            const message = toErrorMessage(error, 'Failed to load activities.');

            set((state) => ({
                queries: {
                    ...state.queries,
                    [familyId]: {
                        ...(state.queries[familyId] ?? createQueryState(emptyActivities)),
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
}));

export function useActivities(familyId?: string, options: QueryOptions = {}) {
    const enabled = options.enabled ?? true;
    const query = useActivitiesStore((state) => (familyId ? state.queries[familyId] : undefined));
    const fetchActivities = useActivitiesStore((state) => state.fetchActivities);
    const createActivity = useActivitiesStore((state) => state.createActivity);
    const completeActivity = useActivitiesStore((state) => state.completeActivity);
    const resolvedQuery = query ?? createQueryState(emptyActivities);

    useEffect(() => {
        if (!enabled || !familyId || resolvedQuery.isLoaded || resolvedQuery.isLoading) {
            return;
        }

        void fetchActivities(familyId);
    }, [enabled, familyId, fetchActivities, resolvedQuery.isLoaded, resolvedQuery.isLoading]);

    return {
        activities: resolvedQuery.data,
        completeActivity: (activityId: string, input: UpdateActivityInput) => {
            if (!familyId) {
                return Promise.reject(createMissingParameterError('familyId'));
            }

            return completeActivity(familyId, activityId, input);
        },
        createActivity,
        error: resolvedQuery.error,
        isLoaded: resolvedQuery.isLoaded,
        isLoading: resolvedQuery.isLoading,
        refetch: () => {
            if (!familyId) {
                return Promise.reject(createMissingParameterError('familyId'));
            }

            return fetchActivities(familyId);
        },
    };
}
