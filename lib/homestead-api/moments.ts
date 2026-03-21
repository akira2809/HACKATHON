import {
    eq,
    supabaseInsertOne,
    supabaseList,
    supabaseUpdateOne,
} from '@/lib/supabase';
import type {
    ActivityRecord,
    AdvisorMessageRecord,
    CalendarEventRecord,
    CreateActivityInput,
    CreateAdvisorMessageInput,
    CreateCalendarEventInput,
    CreateEventLogInput,
    CreatePlaceCacheInput,
    EventLogRecord,
    PlaceCacheRecord,
    UpdateActivityInput,
    UpdateAdvisorMessageInput,
} from './types';

export const activitiesApi = {
    complete: (activityId: string, input: UpdateActivityInput) =>
        supabaseUpdateOne<ActivityRecord>('activities', input, { id: eq(activityId) }),
    create: (input: CreateActivityInput) => supabaseInsertOne<ActivityRecord>('activities', input),
    listByFamily: (familyId: string) =>
        supabaseList<ActivityRecord>('activities', { familyId: eq(familyId) }),
};

export const advisorMessagesApi = {
    create: (input: CreateAdvisorMessageInput) =>
        supabaseInsertOne<AdvisorMessageRecord>('advisor_messages', input),
    listByFamily: (familyId: string) =>
        supabaseList<AdvisorMessageRecord>('advisor_messages', { familyId: eq(familyId) }),
    updateStatus: (messageId: string, input: UpdateAdvisorMessageInput) =>
        supabaseUpdateOne<AdvisorMessageRecord>('advisor_messages', input, { id: eq(messageId) }),
};

export const eventLogsApi = {
    create: (input: CreateEventLogInput) => supabaseInsertOne<EventLogRecord>('event_logs', input),
    listByFamily: (familyId: string) => supabaseList<EventLogRecord>('event_logs', { familyId: eq(familyId) }),
};

export const placeCacheApi = {
    create: (input: CreatePlaceCacheInput) => supabaseInsertOne<PlaceCacheRecord>('place_cache', input),
    listByQuery: (query: string) => supabaseList<PlaceCacheRecord>('place_cache', { query: eq(query) }),
};

export const calendarEventsApi = {
    create: (input: CreateCalendarEventInput) =>
        supabaseInsertOne<CalendarEventRecord>('calendar_events', input),
    listByParent: (parentId: string) =>
        supabaseList<CalendarEventRecord>('calendar_events', { parentId: eq(parentId) }),
};
