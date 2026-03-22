'use client';

import { useEffect } from 'react';
import type { GoalRecord, QuestRecord } from '@/lib/homestead-api';
import { useAppState, type ParentChild, type ParentGoal, type ParentQuest } from '@/state/appState';
import { useActivities } from './useActivities';
import { useChildren } from './useChildren';
import { useFamilies } from './useFamilies';
import { useGoals, useGoalsMap } from './useGoals';
import { useMomentNotifications } from './useMomentNotifications';
import { useTodayQuests } from './useTodayQuests';

type UseParentDashboardDataOptions = {
    demoState?: string;
    selectedChildIdOverride?: string | null;
    syncSelectedChild?: boolean;
};

function asArray<T>(value: T[] | null | undefined): T[] {
    return Array.isArray(value) ? value : [];
}

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

export function useParentDashboardData({
    demoState,
    selectedChildIdOverride,
    syncSelectedChild = true,
}: UseParentDashboardDataOptions = {}) {
    const configuredFamilyId = useAppState((state) => state.familyId);
    const selectedChildId = useAppState((state) => state.selectedChildId);
    const selectChild = useAppState((state) => state.selectChild);
    const resolvedSelectedChildId = selectedChildIdOverride ?? selectedChildId;

    const familiesQuery = useFamilies();
    const familyRecords = asArray(familiesQuery.families);
    const family = familyRecords.find((item) => item.id === configuredFamilyId) ?? familyRecords[0] ?? null;
    const familyId = demoState === 'no-children' ? family?.id : family?.id;

    const childrenQuery = useChildren(familyId, {
        enabled: Boolean(familyId),
    });

    const childRecords = demoState === 'no-children' ? [] : asArray(childrenQuery.children);
    const activeChildRecord = childRecords.find((child) => child.id === resolvedSelectedChildId) ?? childRecords[0] ?? null;

    useEffect(() => {
        if (!syncSelectedChild || !activeChildRecord || activeChildRecord.id === selectedChildId) {
            return;
        }

        selectChild(activeChildRecord.id);
    }, [activeChildRecord, selectChild, selectedChildId, syncSelectedChild]);

    const childGoalsQuery = useGoalsMap(
        childRecords.map((child) => child.id),
        {
            enabled: childRecords.length > 0,
        },
    );

    const goalsQuery = useGoals(activeChildRecord?.id, {
        enabled: Boolean(activeChildRecord?.id),
    });
    const currentGoalRecord = selectCurrentGoal(asArray(goalsQuery.goals));
    const currentGoal = mapGoal(currentGoalRecord);

    const todayQuestsQuery = useTodayQuests(activeChildRecord?.id, undefined, {
        enabled: Boolean(activeChildRecord?.id),
    });
    const activitiesQuery = useActivities(familyId, {
        enabled: Boolean(familyId),
        refetchIntervalMs: 10000,
    });
    const todayQuestRecords = asArray(todayQuestsQuery.quests);
    const activityRecords = asArray(activitiesQuery.activities);

    const momentNotifications = useMomentNotifications({
        activities: activityRecords,
        children: childRecords,
        familyId,
    });

    const childItems = childRecords.map((child) =>
        buildChildSummary(
            child,
            mapGoal(selectCurrentGoal(childGoalsQuery.goalsByChild[child.id] ?? [])),
        ),
    );

    const activeChild = activeChildRecord
        ? {
            ...buildChildSummary(activeChildRecord, currentGoal),
            introMessage: `Good evening. Let's prepare ${activeChildRecord.name}'s adventures for today.`,
            quests: todayQuestRecords.map((quest) => ({
                assignedDate: quest.assignedDate,
                category: inferQuestCategory(quest),
                completedAt: quest.completedAt,
                description: quest.description,
                id: quest.id,
                reward: quest.reward,
                status: mapQuestStatus(quest.status),
                title: quest.title,
            })),
        }
        : null;

    const pendingQuests = activeChild?.quests.filter((quest) => quest.status === 'pending') ?? [];
    const ongoingQuests = activeChild?.quests.filter((quest) => quest.status === 'ongoing') ?? [];
    const momentsCount = activeChild
        ? activityRecords.filter((activity) => activity.childId === activeChild.id).length
        : 0;

    const dashboardError = familiesQuery.error || childrenQuery.error || childGoalsQuery.error || goalsQuery.error || activitiesQuery.error
        ? 'Something did not come through just yet. Please try again.'
        : null;

    return {
        activeChild,
        childItems,
        dashboardError,
        family,
        familyId,
        familySummary: family?.name ?? 'Family Board',
        goalsQuery,
        hasNoChildren: !childrenQuery.isLoading && childItems.length === 0,
        heroDescription: activeChild
            ? `Good evening. Let's prepare ${activeChild.name}'s adventures for today.`
            : 'The family board will fill in once a child profile is ready.',
        hasUnreadMomentRequests: momentNotifications.hasUnreadMomentRequests,
        isChildSelectorLoading: familiesQuery.isLoading || childrenQuery.isLoading || childGoalsQuery.isLoading,
        isOverviewLoading: Boolean(activeChildRecord?.id) && todayQuestsQuery.isLoading,
        latestUnreadMomentRequest: momentNotifications.latestUnreadMomentRequest,
        momentsCount,
        ongoingQuests,
        pendingQuests,
        questActions: {
            completeQuest: todayQuestsQuery.completeQuest,
            createQuests: todayQuestsQuery.createQuests,
            refetch: todayQuestsQuery.refetch,
            removeQuest: todayQuestsQuery.removeQuest,
            startQuest: todayQuestsQuery.startQuest,
        },
        selectedChildId: activeChild?.id ?? resolvedSelectedChildId,
        selectChild,
        todayQuestsError: todayQuestsQuery.error,
    };
}
