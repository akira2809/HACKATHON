import { activitiesApi, advisorMessagesApi, calendarEventsApi, eventLogsApi, placeCacheApi } from './moments';
import { childrenApi, familiesApi, parentsApi } from './household';
import { childPreferencesApi, goalsApi, questStreaksApi, questsApi } from './quests';

export * from './types';

export const homesteadApi = {
    activities: activitiesApi,
    advisorMessages: advisorMessagesApi,
    calendarEvents: calendarEventsApi,
    childPreferences: childPreferencesApi,
    children: childrenApi,
    eventLogs: eventLogsApi,
    families: familiesApi,
    goals: goalsApi,
    parents: parentsApi,
    placeCache: placeCacheApi,
    questStreaks: questStreaksApi,
    quests: questsApi,
};
