'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { homesteadApi, type CalendarEventRecord, type CreateCalendarEventInput, type UpdateCalendarEventInput } from '@/lib/homestead-api';
import { createMissingParameterError, createQueryState, type QueryOptions, toErrorMessage } from './query-utils';

type CalendarEventsQueryState = ReturnType<typeof createQueryState<CalendarEventRecord[]>>;
type CalendarEventsStore = {
    createCalendarEvent: (parentId: string, input: CreateCalendarEventInput) => Promise<CalendarEventRecord | null>;
    fetchCalendarEvents: (parentId: string) => Promise<CalendarEventRecord[]>;
    queries: Record<string, CalendarEventsQueryState>;
    updateCalendarEvent: (parentId: string, eventId: string, input: UpdateCalendarEventInput) => Promise<CalendarEventRecord | null>;
};

const emptyCalendarEvents: CalendarEventRecord[] = [];

const useCalendarEventsStore = create<CalendarEventsStore>((set) => ({
    createCalendarEvent: async (parentId, input) => {
        const event = await homesteadApi.calendarEvents.create(input);

        if (!event) {
            return null;
        }

        set((state) => {
            const query = state.queries[parentId];

            if (!query) {
                return state;
            }

            return {
                queries: {
                    ...state.queries,
                    [parentId]: {
                        ...query,
                        data: [...query.data, event],
                        error: null,
                        isLoaded: true,
                    },
                },
            };
        });

        return event;
    },
    fetchCalendarEvents: async (parentId) => {
        set((state) => ({
            queries: {
                ...state.queries,
                [parentId]: {
                    ...(state.queries[parentId] ?? createQueryState(emptyCalendarEvents)),
                    error: null,
                    isLoading: true,
                },
            },
        }));

        try {
            const events = await homesteadApi.calendarEvents.listByParent(parentId);

            set((state) => ({
                queries: {
                    ...state.queries,
                    [parentId]: {
                        data: events,
                        error: null,
                        isLoaded: true,
                        isLoading: false,
                    },
                },
            }));

            return events;
        } catch (error) {
            const message = toErrorMessage(error, 'Failed to load calendar events.');

            set((state) => ({
                queries: {
                    ...state.queries,
                    [parentId]: {
                        ...(state.queries[parentId] ?? createQueryState(emptyCalendarEvents)),
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
    updateCalendarEvent: async (parentId, eventId, input) => {
        const event = await homesteadApi.calendarEvents.update(eventId, input);

        if (!event) {
            return null;
        }

        set((state) => {
            const query = state.queries[parentId];

            if (!query) {
                return state;
            }

            return {
                queries: {
                    ...state.queries,
                    [parentId]: {
                        ...query,
                        data: query.data.map((item) => (item.id === eventId ? event : item)),
                    },
                },
            };
        });

        return event;
    },
}));

export function useCalendarEvents(parentId?: string, options: QueryOptions = {}) {
    const enabled = options.enabled ?? true;
    const query = useCalendarEventsStore((state) => (parentId ? state.queries[parentId] : undefined));
    const createCalendarEvent = useCalendarEventsStore((state) => state.createCalendarEvent);
    const fetchCalendarEvents = useCalendarEventsStore((state) => state.fetchCalendarEvents);
    const updateCalendarEvent = useCalendarEventsStore((state) => state.updateCalendarEvent);
    const resolvedQuery = query ?? createQueryState(emptyCalendarEvents);

    useEffect(() => {
        if (!enabled || !parentId || resolvedQuery.isLoaded || resolvedQuery.isLoading) {
            return;
        }

        void fetchCalendarEvents(parentId);
    }, [enabled, fetchCalendarEvents, parentId, resolvedQuery.isLoaded, resolvedQuery.isLoading]);

    return {
        createCalendarEvent: (input: CreateCalendarEventInput) => {
            if (!parentId) {
                return Promise.reject(createMissingParameterError('parentId'));
            }

            return createCalendarEvent(parentId, input);
        },
        error: resolvedQuery.error,
        events: resolvedQuery.data,
        isLoaded: resolvedQuery.isLoaded,
        isLoading: resolvedQuery.isLoading,
        refetch: () => {
            if (!parentId) {
                return Promise.reject(createMissingParameterError('parentId'));
            }

            return fetchCalendarEvents(parentId);
        },
        updateCalendarEvent: (eventId: string, input: UpdateCalendarEventInput) => {
            if (!parentId) {
                return Promise.reject(createMissingParameterError('parentId'));
            }

            return updateCalendarEvent(parentId, eventId, input);
        },
    };
}
