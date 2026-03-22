'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { homesteadApi, type CreateEventLogInput, type EventLogRecord } from '@/lib/homestead-api';
import { createMissingParameterError, createQueryState, type QueryOptions, toErrorMessage } from './query-utils';

type EventLogsQueryState = ReturnType<typeof createQueryState<EventLogRecord[]>>;
type EventLogsStore = {
    createEventLog: (familyId: string, input: CreateEventLogInput) => Promise<EventLogRecord | null>;
    fetchEventLogs: (familyId: string) => Promise<EventLogRecord[]>;
    queries: Record<string, EventLogsQueryState>;
};

const emptyEventLogs: EventLogRecord[] = [];

const useEventLogsStore = create<EventLogsStore>((set) => ({
    createEventLog: async (familyId, input) => {
        const eventLog = await homesteadApi.eventLogs.create(input);

        if (!eventLog) {
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
                        data: [...query.data, eventLog],
                        error: null,
                        isLoaded: true,
                    },
                },
            };
        });

        return eventLog;
    },
    fetchEventLogs: async (familyId) => {
        set((state) => ({
            queries: {
                ...state.queries,
                [familyId]: {
                    ...(state.queries[familyId] ?? createQueryState(emptyEventLogs)),
                    error: null,
                    isLoading: true,
                },
            },
        }));

        try {
            const eventLogs = await homesteadApi.eventLogs.listByFamily(familyId);

            set((state) => ({
                queries: {
                    ...state.queries,
                    [familyId]: {
                        data: eventLogs,
                        error: null,
                        isLoaded: true,
                        isLoading: false,
                    },
                },
            }));

            return eventLogs;
        } catch (error) {
            const message = toErrorMessage(error, 'Failed to load event logs.');

            set((state) => ({
                queries: {
                    ...state.queries,
                    [familyId]: {
                        ...(state.queries[familyId] ?? createQueryState(emptyEventLogs)),
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

export function useEventLogs(familyId?: string, options: QueryOptions = {}) {
    const enabled = options.enabled ?? true;
    const query = useEventLogsStore((state) => (familyId ? state.queries[familyId] : undefined));
    const createEventLog = useEventLogsStore((state) => state.createEventLog);
    const fetchEventLogs = useEventLogsStore((state) => state.fetchEventLogs);
    const resolvedQuery = query ?? createQueryState(emptyEventLogs);

    useEffect(() => {
        if (!enabled || !familyId || resolvedQuery.isLoaded || resolvedQuery.isLoading) {
            return;
        }

        void fetchEventLogs(familyId);
    }, [enabled, familyId, fetchEventLogs, resolvedQuery.isLoaded, resolvedQuery.isLoading]);

    return {
        createEventLog: (input: CreateEventLogInput) => {
            if (!familyId) {
                return Promise.reject(createMissingParameterError('familyId'));
            }

            return createEventLog(familyId, input);
        },
        error: resolvedQuery.error,
        eventLogs: resolvedQuery.data,
        isLoaded: resolvedQuery.isLoaded,
        isLoading: resolvedQuery.isLoading,
        refetch: () => {
            if (!familyId) {
                return Promise.reject(createMissingParameterError('familyId'));
            }

            return fetchEventLogs(familyId);
        },
    };
}
