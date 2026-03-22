/**
 * hooks/index.ts
 *
 * Central export for all hooks
 */

// Session hooks
export { useChildSession, getChildSession, setChildSession, clearChildSession } from './useChildSession';
export type { ChildSession } from './useChildSession';
export { useParentSession, getParentSession, setParentSession, clearParentSession } from './useParentSession';
export type { ParentSession } from './useParentSession';

// Dashboard data hooks
export { useChildDashboardData } from './useChildDashboardData';
export { useParentDashboardData } from './useParentDashboardData';

// Individual data hooks
export { useChildren } from './useChildren';
export { useActivities } from './useActivities';
export { useGoals } from './useGoals';
export { useTodayQuests } from './useTodayQuests';
export { useFamilies } from './useFamilies';
export { useGenerateQuests } from './useGenerateQuests';
export { useProximity, formatDistance, isGeolocationSupported } from './useProximity';

// Query utilities
export {
    createQueryState,
    getTodayDateString,
    toErrorMessage,
    createMissingParameterError,
    type QueryOptions,
    type QueryState,
} from './query-utils';
