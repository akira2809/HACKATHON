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
        broadcastActivitySync(input.familyId);

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
    const enabled = options.enabled ?? true;
    const query = useActivitiesStore((state) => (familyId ? state.queries[familyId] : undefined));
    const fetchActivities = useActivitiesStore((state) => state.fetchActivities);
    const createActivity = useActivitiesStore((state) => state.createActivity);
    const completeActivity = useActivitiesStore((state) => state.completeActivity);
    const updateActivity = useActivitiesStore((state) => state.updateActivity);
    const resolvedQuery = query ?? createQueryState(emptyActivities);

    useEffect(() => {
        if (!enabled || !familyId || resolvedQuery.isLoaded || resolvedQuery.isLoading) {
            return;
        }

        void fetchActivities(familyId);
    }, [enabled, familyId, fetchActivities, resolvedQuery.isLoaded, resolvedQuery.isLoading]);

    useEffect(() => {
        if (!enabled || !familyId) {
            return;
        }

        const handleSyncMessage = (payload: ActivitySyncMessage) => {
            if (
                payload.type !== 'activity-updated'
                || payload.source === ACTIVITY_SYNC_SOURCE
                || payload.familyId !== familyId
            ) {
                return;
            }

            void fetchActivities(familyId);
        };

        const channel = getActivitySyncChannel();

        const handleChannelMessage = (event: MessageEvent<ActivitySyncMessage>) => {
            handleSyncMessage(event.data);
        };

        const handleStorage = (event: StorageEvent) => {
            if (!event.newValue || event.key !== ACTIVITY_SYNC_STORAGE_KEY) {
                return;
            }

            try {
                handleSyncMessage(JSON.parse(event.newValue) as ActivitySyncMessage);
            } catch {
                return;
            }
        };

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                void fetchActivities(familyId);
            }
        };

        const handleFocus = () => {
            void fetchActivities(familyId);
        };

        if (channel) {
            channel.addEventListener('message', handleChannelMessage);
        }

        window.addEventListener('storage', handleStorage);
        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('focus', handleFocus);

        return () => {
            if (channel) {
                channel.removeEventListener('message', handleChannelMessage);
            }

            window.removeEventListener('storage', handleStorage);
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('focus', handleFocus);
        };
    }, [enabled, familyId, fetchActivities]);

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
        updateActivity: (activityId: string, input: UpdateActivityInput) => {
            if (!familyId) {
                return Promise.reject(createMissingParameterError('familyId'));
            }

            return updateActivity(familyId, activityId, input);
        },
    };
}
