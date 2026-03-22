'use client';

import { useEffect } from 'react';
import type { ActivityRecord, CalendarEventRecord, GoalRecord } from '@/lib/homestead-api';
import { useAppState, type ParentChild, type ParentGoal } from '@/state/appState';
import { useActivities } from './useActivities';
import { useCalendarEvents } from './useCalendarEvents';
import { useChildren } from './useChildren';
import { useFamilies } from './useFamilies';
import { useGoalsMap } from './useGoals';
import { useParents } from './useParents';

type UseParentMomentsDataOptions = {
    activityIdOverride?: string | null;
    childIdOverride?: string | null;
    eventIdOverride?: string | null;
};

function selectCurrentGoal(goals: GoalRecord[]) {
    return [...goals].sort((goalA, goalB) => {
        const goalATime = new Date(goalA.deadline).getTime();
        const goalBTime = new Date(goalB.deadline).getTime();

        return goalATime - goalBTime;
    })[0] ?? null;
}

function mapGoal(goal: GoalRecord | null): ParentGoal | null {
    if (!goal) {
        return null;
    }

    return {
        milestone: Math.max(10, Math.round(goal.target_coins * 0.5)),
        note: `Each completed quest adds steady progress toward ${goal.title}.`,
        target: goal.target_coins,
        title: goal.title,
    };
}

function buildChildSummary(child: {
    childAge: number;
    coins: number;
    id: string;
    name: string;
}, goal: ParentGoal | null): ParentChild {
    return {
        age: child.childAge,
        agentChildId: child.id,
        aiTokens: 0,
        generationError: undefined,
        goal,
        id: child.id,
        introMessage: '',
        moment: null,
        momentError: undefined,
        name: child.name,
        networkIssue: undefined,
        proximityDistance: 0,
        quests: [],
        seeds: child.coins,
    };
}

function selectCurrentActivity(activities: ActivityRecord[], activityIdOverride?: string | null) {
    if (activityIdOverride) {
        return activities.find((activity) => activity.id === activityIdOverride) ?? null;
    }

    const pendingActivities = activities.filter((activity) => !activity.completed);
    return pendingActivities[pendingActivities.length - 1] ?? null;
}

function selectScheduledEvent(
    events: CalendarEventRecord[],
    activityTitle: string | null,
    eventIdOverride?: string | null,
) {
    if (eventIdOverride) {
        return events.find((event) => event.id === eventIdOverride) ?? null;
    }

    if (!activityTitle) {
        return null;
    }

    return [...events]
        .filter((event) => event.title === activityTitle)
        .sort((eventA, eventB) => new Date(eventB.startTime).getTime() - new Date(eventA.startTime).getTime())[0] ?? null;
}

export function useParentMomentsData({
    activityIdOverride,
    childIdOverride,
    eventIdOverride,
}: UseParentMomentsDataOptions = {}) {
    const configuredFamilyId = useAppState((state) => state.familyId);
    const selectedChildId = useAppState((state) => state.selectedChildId);
    const selectChild = useAppState((state) => state.selectChild);
    const activeChildId = childIdOverride ?? selectedChildId;

    const familiesQuery = useFamilies();
    const family = familiesQuery.families.find((item) => item.id === configuredFamilyId) ?? familiesQuery.families[0] ?? null;
    const familyId = family?.id;

    const childrenQuery = useChildren(familyId, {
        enabled: Boolean(familyId),
    });
    const childRecords = childrenQuery.children;
    const activitiesQuery = useActivities(familyId, {
        enabled: Boolean(familyId),
        refetchIntervalMs: 10000,
    });
    const selectedChildActivity = selectedChildId
        ? activitiesQuery.activities.find((activity) => activity.childId === selectedChildId && !activity.completed) ?? null
        : null;
    const familyCurrentActivity = selectCurrentActivity(activitiesQuery.activities, activityIdOverride);
    const resolvedChildId = childIdOverride
        ?? (selectedChildActivity ? selectedChildId : familyCurrentActivity?.childId)
        ?? activeChildId;
    const activeChildRecord = childRecords.find((child) => child.id === resolvedChildId) ?? childRecords[0] ?? null;

    useEffect(() => {
        if (!activeChildRecord || childIdOverride || activeChildRecord.id === selectedChildId) {
            return;
        }

        selectChild(activeChildRecord.id);
    }, [activeChildRecord, childIdOverride, selectChild, selectedChildId]);

    const childGoalsQuery = useGoalsMap(
        childRecords.map((child) => child.id),
        {
            enabled: childRecords.length > 0,
        },
    );

    const childItems = childRecords.map((child) =>
        buildChildSummary(
            child,
            mapGoal(selectCurrentGoal(childGoalsQuery.goalsByChild[child.id] ?? [])),
        ),
    );

    const activeChild = activeChildRecord
        ? buildChildSummary(
            activeChildRecord,
            mapGoal(selectCurrentGoal(childGoalsQuery.goalsByChild[activeChildRecord.id] ?? [])),
        )
        : null;

    const parentsQuery = useParents(familyId, {
        enabled: Boolean(familyId),
    });
    const parent = parentsQuery.parents[0] ?? null;

    const activitiesForChild = activeChild
        ? activitiesQuery.activities.filter((activity) => activity.childId === activeChild.id)
        : [];
    const currentActivity = selectCurrentActivity(activitiesForChild, activityIdOverride);

    const calendarEventsQuery = useCalendarEvents(parent?.id, {
        enabled: Boolean(parent?.id),
    });
    const scheduledEvent = selectScheduledEvent(
        calendarEventsQuery.events,
        currentActivity?.activity ?? null,
        eventIdOverride,
    );

    const momentsError = familiesQuery.error
        || childrenQuery.error
        || childGoalsQuery.error
        || parentsQuery.error
        || activitiesQuery.error
        || calendarEventsQuery.error
            ? 'Something did not come through just yet. Please try again.'
            : null;
    const isPlannerLoading = familiesQuery.isLoading
        || childrenQuery.isLoading
        || childGoalsQuery.isLoading
        || parentsQuery.isLoading
        || activitiesQuery.isLoading
        || calendarEventsQuery.isLoading;

    return {
        activeChild,
        activitiesForChild,
        activitiesQuery,
        calendarEventsQuery,
        childItems,
        currentActivity,
        familyId,
        familySummary: family?.name ?? 'Family Board',
        hasNoChildren: !childrenQuery.isLoading && childItems.length === 0,
        isChildSelectorLoading: familiesQuery.isLoading || childrenQuery.isLoading || childGoalsQuery.isLoading,
        isPlannerLoading,
        momentsError,
        parent,
        parentsQuery,
        scheduledEvent,
        selectedChildId: activeChild?.id ?? selectedChildId,
        selectChild,
    };
}
