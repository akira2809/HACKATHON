'use client';

import { useEffect, useRef } from 'react';
import { create } from 'zustand';
import { homesteadApi, type ActivityRecord, type CreateActivityInput, type UpdateActivityInput } from '@/lib/homestead-api';
import { createMissingParameterError, createQueryState, type QueryOptions, toErrorMessage } from './query-utils';

type ActivitiesQueryState = ReturnType<typeof createQueryState<ActivityRecord[]>>;
type ActivitiesStore = {
    completeActivity: (familyId: string, activityId: string, input: UpdateActivityInput) => Promise<ActivityRecord | null>;
    createActivity: (input: CreateActivityInput) => Promise<ActivityRecord | null>;
    fetchActivities: (familyId: string, sessionVersion?: number) => Promise<ActivityRecord[]>;
    queries: Record<string, ActivitiesQueryState>;
    updateActivity: (familyId: string, activityId: string, input: UpdateActivityInput) => Promise<ActivityRecord | null>;
};

const emptyActivities: ActivityRecord[] = [];
const ACTIVITY_SYNC_CHANNEL_NAME = 'homestead-activities';
const ACTIVITY_SYNC_STORAGE_KEY = 'homestead-activities-sync';
const ACTIVITY_SYNC_SOURCE = `activities-${Math.random().toString(36).slice(2)}`;

type ActivitySyncMessage = {
    familyId: string;
    source: string;
    type: 'activity-updated';
};

let activitySyncChannel: BroadcastChannel | null = null;

function getActivitySyncChannel() {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
        return null;
    }

    if (!activitySyncChannel) {
        activitySyncChannel = new BroadcastChannel(ACTIVITY_SYNC_CHANNEL_NAME);
    }

    return activitySyncChannel;
}

function broadcastActivitySync(familyId: string) {
    const payload = {
        familyId,
        source: ACTIVITY_SYNC_SOURCE,
        type: 'activity-updated',
    } satisfies ActivitySyncMessage;
    const channel = getActivitySyncChannel();

    if (channel) {
        channel.postMessage(payload);
    }

    if (typeof window !== 'undefined') {
        window.localStorage.setItem(ACTIVITY_SYNC_STORAGE_KEY, JSON.stringify(payload));
    }
}

const useActivitiesStore = create<ActivitiesStore>((set) => ({
    completeActivity: async (familyId, activityId, input) => {
        const activity = await homesteadApi.activities.complete(activityId, input);

        if (!activity) {
            return null;
        }

        // If the activity has a reward and childId, update the child's coins
        const { childId } = activity;
        const reward = (input as any).reward || 0;
        if (childId && reward) {
            try {
                const child = await homesteadApi.children.getById(childId);
                if (child && typeof child.coins === 'number') {
                    const newCoins = child.coins + reward;
                    await homesteadApi.children.update(childId, { coins: newCoins });
                }
            } catch (error) {
                // Log but don't fail if coin update fails
                console.error('Failed to update child coins:', error);
            }
        }

        set((state) => {
            // Update in ALL query versions for this familyId
            const nextQueries: Record<string, ActivitiesQueryState> = {};
            Object.entries(state.queries).forEach(([key, query]) => {
                if (key.startsWith(familyId)) {
                    nextQueries[key] = {
                        ...query,
                        data: query.data.map((item) => (item.id === activityId ? activity : item)),
                    };
                } else {
                    nextQueries[key] = query;
                }
            });

            return { queries: nextQueries };
        });
        broadcastActivitySync(familyId);

        return activity;
    },
    createActivity: async (input) => {
        const activity = await homesteadApi.activities.create(input);

        if (!activity) {
            return null;
        }

        set((state) => {
            // Update in ALL query versions for this familyId
            const nextQueries: Record<string, ActivitiesQueryState> = {};
            Object.entries(state.queries).forEach(([key, query]) => {
                if (key.startsWith(input.familyId)) {
                    nextQueries[key] = {
                        ...query,
                        data: [...query.data, activity],
                        error: null,
                        isLoaded: true,
                    };
                } else {
                    nextQueries[key] = query;
                }
            });

            return { queries: nextQueries };
        });
        broadcastActivitySync(input.familyId);

        return activity;
    },
    fetchActivities: async (familyId, sessionVersion = 0) => {
        const queryKey = `${familyId}:${sessionVersion}`;

        set((state) => ({
            queries: {
                ...state.queries,
                [queryKey]: {
                    ...(state.queries[queryKey] ?? createQueryState(emptyActivities)),
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
                    [queryKey]: {
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
                    [queryKey]: {
                        ...(state.queries[queryKey] ?? createQueryState(emptyActivities)),
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
    updateActivity: async (familyId, activityId, input) => {
        const activity = await homesteadApi.activities.update(activityId, input);

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
        broadcastActivitySync(familyId);

        return activity;
    },
}));

export function useActivities(familyId?: string, options: QueryOptions = {}) {
    const { sessionVersion = 0 } = options as QueryOptions & { sessionVersion?: number };
    const enabled = options.enabled ?? true;
    const queryKey = familyId ? `${familyId}:${sessionVersion}` : '';
    const query = useActivitiesStore((state) => (queryKey ? state.queries[queryKey] : undefined));
    const fetchActivities = useActivitiesStore((state) => state.fetchActivities);
    const createActivity = useActivitiesStore((state) => state.createActivity);
    const completeActivity = useActivitiesStore((state) => state.completeActivity);
    const updateActivity = useActivitiesStore((state) => state.updateActivity);
    const resolvedQuery = query ?? createQueryState(emptyActivities);

    // Track previous session version to detect changes
    const prevSessionVersionRef = useRef(sessionVersion);

    useEffect(() => {
        if (!enabled || !familyId) {
            return;
        }

        // Re-fetch when session version changes
        const sessionChanged = prevSessionVersionRef.current !== sessionVersion;
        prevSessionVersionRef.current = sessionVersion;

        if (sessionChanged || !resolvedQuery.isLoaded) {
            if (!resolvedQuery.isLoading) {
                void fetchActivities(familyId, sessionVersion);
            }
        }
    }, [enabled, familyId, sessionVersion, fetchActivities, resolvedQuery.isLoaded, resolvedQuery.isLoading]);

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

            return fetchActivities(familyId, sessionVersion);
        },
    };
}
