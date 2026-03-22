'use client';

/**
 * useParentDashboardData.ts
 *
 * Hook tổng hợp data cho Parent Dashboard
 * Tự động trigger re-render khi session thay đổi
 */

import { useCallback } from 'react';
import type { GoalRecord, QuestRecord } from '@/lib/homestead-api';
import type { ParentGoal, ParentQuest } from '@/state/appState';
import { useActivities } from './useActivities';
import { useChildren } from './useChildren';
import { useFamilies } from './useFamilies';
import { useGoals, useGoalsMap } from './useGoals';
import { useMomentNotifications } from './useMomentNotifications';
import { useTodayQuests } from './useTodayQuests';
import { useParentSession, setParentSession } from './useParentSession';

type UseParentDashboardDataOptions = {
    demoState?: string;
};

function inferQuestCategory(quest: QuestRecord): ParentQuest['category'] {
    const normalizedText = `${quest.title} ${quest.description}`.toLowerCase();

    if (normalizedText.includes('walk') || normalizedText.includes('move') || normalizedText.includes('stretch')) {
        return 'Movement';
    }

    if (normalizedText.includes('clean') || normalizedText.includes('set the table') || normalizedText.includes('help')) {
        return 'Responsibility';
    }

    if (normalizedText.includes('care') || normalizedText.includes('water') || normalizedText.includes('kind')) {
        return 'Care';
    }

    return 'Learning';
}

function mapQuestStatus(status: QuestRecord['status']): ParentQuest['status'] {
    if (status === 'completed') {
        return 'completed';
    }

    if (status === 'ongoing') {
        return 'ongoing';
    }

    return 'pending';
}

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

export function useParentDashboardData({
    demoState,
}: UseParentDashboardDataOptions = {}) {
    // Lấy session - sẽ trigger re-render khi localStorage thay đổi
    const { familyId: sessionFamilyId, parentName, hasSession } = useParentSession();

    // Fetch families
    const familiesQuery = useFamilies();
    const family = sessionFamilyId
        ? familiesQuery.families.find((item) => item.id === sessionFamilyId) ?? familiesQuery.families[0] ?? null
        : familiesQuery.families[0] ?? null;

    const familyId = sessionFamilyId ?? family?.id ?? null;

    // Fetch children
    const childrenQuery = useChildren(familyId ?? undefined, {
        enabled: Boolean(familyId),
    });

    const childRecords = demoState === 'no-children' ? [] : childrenQuery.children;
    const activeChildRecord = childRecords[0] ?? null;

    useEffect(() => {
        if (!activeChildRecord || activeChildRecord.id === selectedChildId) {
            return;
        }

        selectChild(activeChildRecord.id);
    }, [activeChildRecord, selectChild, selectedChildId]);

    const childGoalsQuery = useGoalsMap(
        childRecords.map((child) => child.id),
        {
            enabled: childRecords.length > 0,
        },
    );

    // Goals
    const goalsQuery = useGoals(activeChildRecord?.id, {
        enabled: Boolean(activeChildRecord?.id),
    });
    const currentGoalRecord = selectCurrentGoal(goalsQuery.goals);
    const currentGoal = mapGoal(currentGoalRecord);

    // Quests
    const todayQuestsQuery = useTodayQuests(activeChildRecord?.id, undefined, {
        enabled: Boolean(activeChildRecord?.id),
    });

    // Activities
    const activitiesQuery = useActivities(familyId ?? undefined, {
        enabled: Boolean(familyId),
        refetchIntervalMs: 10000,
    });
    const momentNotifications = useMomentNotifications({
        activities: activitiesQuery.activities,
        children: childRecords,
        familyId,
    });

    // Build child items
    const childItems = childRecords.map((child) => ({
        age: child.childAge,
        agentChildId: child.id,
        aiTokens: 0,
        generationError: undefined,
        goal: child.id === activeChildRecord?.id ? currentGoal : null,
        id: child.id,
        introMessage: '',
        moment: null,
        momentError: undefined,
        name: child.name,
        networkIssue: undefined,
        proximityDistance: 0,
        quests: [],
        seeds: child.coins,
    }));

    const activeChild = activeChildRecord
        ? {
            age: activeChildRecord.childAge,
            agentChildId: activeChildRecord.id,
            aiTokens: 0,
            generationError: undefined,
            goal: currentGoal,
            id: activeChildRecord.id,
            introMessage: `Good evening. Let's prepare ${activeChildRecord.name}'s adventures for today.`,
            moment: null,
            momentError: undefined,
            name: activeChildRecord.name,
            networkIssue: undefined,
            proximityDistance: 0,
            quests: todayQuestsQuery.quests.map((quest) => ({
                assignedDate: quest.assignedDate,
                category: inferQuestCategory(quest),
                completedAt: quest.completedAt,
                description: quest.description,
                id: quest.id,
                reward: quest.reward,
                status: mapQuestStatus(quest.status),
                title: quest.title,
            })),
            seeds: activeChildRecord.coins,
        }
        : null;

    const pendingQuests = activeChild?.quests.filter((quest) => quest.status === 'pending') ?? [];
    const ongoingQuests = activeChild?.quests.filter((quest) => quest.status === 'ongoing') ?? [];
    const momentsCount = activeChild
        ? activitiesQuery.activities.filter((activity) => activity.childId === activeChild.id).length
        : 0;

    const dashboardError = familiesQuery.error || childrenQuery.error || childGoalsQuery.error || goalsQuery.error || activitiesQuery.error
        ? 'Something did not come through just yet. Please try again.'
        : null;

    // Select child
    const selectChild = useCallback((childId: string) => {
        // Just trigger - session hook sẽ handle re-render
    }, []);

    // Set family
    const setFamily = useCallback((newFamilyId: string, newFamilyName: string) => {
        setParentSession({
            parentId: '',
            familyId: newFamilyId,
            parentName: parentName ?? '',
            familyName: newFamilyName,
        });
    }, [parentName]);

    // Refetch all parent dashboard data
    const refetchDashboardData = useCallback(async () => {
        await Promise.all([
            familiesQuery.refetch?.(),
            childrenQuery.refetch?.(),
            goalsQuery.refetch?.(),
            activitiesQuery.refetch?.(),
            todayQuestsQuery.refetch?.(),
        ]);
    }, [familiesQuery, childrenQuery, goalsQuery, activitiesQuery, todayQuestsQuery]);

    return {
        // Session info
        familyId,
        family,
        familyName: family?.name ?? 'Family Board',
        familySummary: family?.name ?? 'Family Board',
        parentName,
        hasSession,

        // Children
        children: childRecords,
        activeChild,
        childItems,
        hasNoChildren: !childrenQuery.isLoading && childItems.length === 0,
        selectedChildId: activeChild?.id,

        // Quests
        suggestedQuests,
        approvedQuests,
        quests: activeChild?.quests ?? [],

        // Goals
        currentGoal,
        goalsQuery,

        // Activities
        momentsCount,

        // Loading states
        isLoading: familiesQuery.isLoading || childrenQuery.isLoading,
        isChildrenLoading: childrenQuery.isLoading,
        isChildSelectorLoading: familiesQuery.isLoading || childrenQuery.isLoading,
        isOverviewLoading: Boolean(activeChildRecord?.id) && todayQuestsQuery.isLoading,
        isFamiliesLoading: familiesQuery.isLoading,

        // Errors
        dashboardError,
        todayQuestsError: todayQuestsQuery.error,

        // Hero text
        heroDescription: activeChild
            ? `Good evening. Let's prepare ${activeChild.name}'s adventures for today.`
            : 'The family board will fill in once a child profile is ready.',

        // Actions
        selectChild,
        setFamily,
        refetchDashboardData,
        questActions: {
            completeQuest: todayQuestsQuery.completeQuest,
            createQuests: todayQuestsQuery.createQuests,
            refetch: todayQuestsQuery.refetch,
            removeQuest: todayQuestsQuery.removeQuest,
            startQuest: todayQuestsQuery.startQuest,
        },
    };
}
