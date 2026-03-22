'use client';

/**
 * useChildDashboardData.ts
 *
 * Hook tổng hợp data cho Child Dashboard
 * Kết hợp useChildSession + useChildren + useGoals + useTodayQuests + useActivities
 * Tối ưu: Dùng sessionVersion từ useChildSession để trigger refetch khi session thay đổi
 */

import { useCallback } from 'react';
import { useChildren } from './useChildren';
import { useActivities } from './useActivities';
import { useGoals } from './useGoals';
import { useTodayQuests } from './useTodayQuests';
import { useChildSession, setChildSession } from './useChildSession';

export type { ChildSession } from './useChildSession';

export function useChildDashboardData() {
    // Lấy session + sessionVersion từ hook (sẽ trigger re-render khi localStorage thay đổi)
    const { childId, familyId, childName, childAge, hasSession } = useChildSession();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _sessionVersion = useChildSession().childId; // Trigger re-render khi childId thay đổi

    // Fetch children list với familyId làm query key
    const childrenQuery = useChildren(familyId ?? undefined, {
        enabled: Boolean(familyId),
    });

    // Lấy child record hiện tại
    const currentChild = childrenQuery.children.find((c) => c.id === childId) ?? childrenQuery.children[0] ?? null;

    // Fetch quests cho child hiện tại (dùng childId làm query key)
    const questsQuery = useTodayQuests(currentChild?.id, undefined, {
        enabled: Boolean(currentChild?.id),
    });

    // Fetch goals cho child hiện tại
    const goalsQuery = useGoals(currentChild?.id, {
        enabled: Boolean(currentChild?.id),
    });

    // Fetch activities cho family
    const activitiesQuery = useActivities(familyId ?? undefined, {
        enabled: Boolean(familyId),
    });

    // Get current goal (sorted by deadline)
    const currentGoal = [...goalsQuery.goals].sort((a, b) => {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    })[0] ?? null;

    // Calculate progress
    const seeds = currentChild?.coins ?? 0;
    const goalProgress = currentGoal ? Math.round((seeds / currentGoal.target_coins) * 100) : 0;

    // Quest stats
    const pendingQuests = questsQuery.quests.filter((q) => q.status === 'pending');
    const completedQuests = questsQuery.quests.filter((q) => q.status === 'completed');
    const ongoingQuests = questsQuery.quests.filter((q) => q.status === 'ongoing');

    // Activities for current child
    const childActivities = activitiesQuery.activities.filter((a) => a.childId === currentChild?.id);

    // Select child - cập nhật session và trigger re-render
    const selectChild = useCallback((newChildId: string) => {
        const child = childrenQuery.children.find((c) => c.id === newChildId);
        if (child && familyId) {
            setChildSession({
                childId: child.id,
                familyId: familyId,
                childName: child.name,
                childAge: child.childAge,
            });
            // Session hook sẽ trigger re-render tự động
        }
    }, [childrenQuery.children, familyId]);

    // Refetch all dashboard data
    const refetchDashboardData = useCallback(async () => {
        await Promise.all([
            childrenQuery.refetch?.(),
            questsQuery.refetch?.(),
            goalsQuery.refetch?.(),
            activitiesQuery.refetch?.(),
        ]);
    }, [childrenQuery, questsQuery, goalsQuery, activitiesQuery]);

    return {
        // Session info
        childId,
        familyId,
        childName: currentChild?.name ?? childName,
        childAge: currentChild?.childAge ?? childAge,
        hasSession,

        // Child info
        currentChild,
        children: childrenQuery.children,

        // Quests
        quests: questsQuery.quests,
        pendingQuests,
        completedQuests,
        ongoingQuests,
        questsQuery,

        // Goals
        goals: goalsQuery.goals,
        currentGoal,
        goalProgress,
        goalsQuery,

        // Activities
        activities: childActivities,
        activitiesQuery,

        // Seeds
        seeds,

        // Loading states
        isLoading: childrenQuery.isLoading || questsQuery.isLoading || goalsQuery.isLoading,
        isChildrenLoading: childrenQuery.isLoading,
        isQuestsLoading: questsQuery.isLoading,
        isGoalsLoading: goalsQuery.isLoading,
        isActivitiesLoading: activitiesQuery.isLoading,

        // Errors
        error: childrenQuery.error || questsQuery.error || goalsQuery.error || activitiesQuery.error,
        questsError: questsQuery.error,
        goalsError: goalsQuery.error,

        // Actions
        selectChild,
        refetchDashboardData,
        questActions: {
            startQuest: questsQuery.startQuest,
            completeQuest: questsQuery.completeQuest,
            removeQuest: questsQuery.removeQuest,
            createQuests: questsQuery.createQuests,
            refetchQuests: questsQuery.refetch,
        },
        goalActions: {
            createGoal: goalsQuery.createGoal,
            updateGoal: goalsQuery.updateGoal,
            refetchGoals: goalsQuery.refetch,
        },
        activityActions: {
            createActivity: activitiesQuery.createActivity,
            completeActivity: activitiesQuery.completeActivity,
            refetchActivities: activitiesQuery.refetch,
        },
    };
}
