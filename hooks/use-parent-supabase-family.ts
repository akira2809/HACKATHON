'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ParentGoal, ParentMoment, ParentQuest } from '@/state/appState';
import { useAppState } from '@/state/appState';
import {
  completeActivity,
  createActivity,
  createAdvisorMessage,
  createApprovedQuests,
  createCalendarEvent,
  createEventLog,
  createGoal,
  fetchChildPreferences,
  fetchParentFamilySnapshot,
  storePlaceCache,
  updateAdvisorMessageStatus,
  updateChildCoins,
  updateGoalTarget,
  updateQuestStatus,
} from '@/lib/supabase/homestead-api';
import { hasSupabaseBrowserConfig } from '@/lib/supabase/client';

function parseDurationMinutes(duration: string) {
  const match = duration.match(/\d+/);
  return Math.max(1, match ? Number(match[0]) : 20);
}

export function useParentSupabaseFamily() {
  const fallbackFamilyId = useAppState((state) => state.familyId);
  const parentId = useAppState((state) => state.parentId);
  const hydrateRemoteFamily = useAppState((state) => state.hydrateRemoteFamily);
  const setGoalForChild = useAppState((state) => state.setGoalForChild);
  const setMomentForChild = useAppState((state) => state.setMomentForChild);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const familyId = useMemo(
    () => process.env.NEXT_PUBLIC_SUPABASE_FAMILY_ID ?? fallbackFamilyId,
    [fallbackFamilyId]
  );
  const hasSupabase = useMemo(
    () => hasSupabaseBrowserConfig() && Boolean(process.env.NEXT_PUBLIC_SUPABASE_FAMILY_ID),
    []
  );

  const refetch = useCallback(async () => {
    if (!hasSupabase || !familyId) {
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const snapshot = await fetchParentFamilySnapshot(familyId);
      hydrateRemoteFamily(snapshot);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync family data.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [familyId, hasSupabase, hydrateRemoteFamily]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const runMutation = useCallback(async <T,>(action: () => Promise<T>) => {
    setIsMutating(true);
    setError(null);

    try {
      return await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Supabase mutation failed.');
      return null;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const approveSuggestedQuests = useCallback(async (childId: string, quests: ParentQuest[]) => {
    if (!hasSupabase || !quests.length) {
      return false;
    }

    const result = await runMutation(async () => {
      await createApprovedQuests(
        quests.map((quest) => ({
          childId,
          title: quest.title,
          description: quest.description,
          reward: quest.reward,
        }))
      );
      await refetch();
      return true;
    });

    return Boolean(result);
  }, [hasSupabase, refetch, runMutation]);

  const markQuestOngoing = useCallback(async (questId: string) => {
    if (!hasSupabase) {
      return false;
    }

    const result = await runMutation(async () => {
      await updateQuestStatus(questId, 'ongoing');
      return true;
    });

    return Boolean(result);
  }, [hasSupabase, runMutation]);

  const markQuestCompleted = useCallback(async (input: {
    questId: string;
    childId: string;
    nextCoins: number;
    reward: number;
    questTitle: string;
  }) => {
    if (!hasSupabase || !familyId) {
      return false;
    }

    const result = await runMutation(async () => {
      await updateQuestStatus(input.questId, 'completed');
      await updateChildCoins(input.childId, input.nextCoins);
      await createEventLog({
        familyId,
        childId: input.childId,
        eventType: 'quest_completed',
        metadata: {
          questTitle: input.questTitle,
          reward: input.reward,
        },
      });
      return true;
    });

    return Boolean(result);
  }, [familyId, hasSupabase, runMutation]);

  const syncChildCoins = useCallback(async (childId: string, nextCoins: number, reason: string, amount: number) => {
    if (!hasSupabase || !familyId) {
      return false;
    }

    const result = await runMutation(async () => {
      await updateChildCoins(childId, nextCoins);
      await createEventLog({
        familyId,
        childId,
        eventType: reason,
        metadata: { amount },
      });
      return true;
    });

    return Boolean(result);
  }, [familyId, hasSupabase, runMutation]);

  const createDefaultGoal = useCallback(async (childId: string, childName: string) => {
    if (!hasSupabase) {
      return false;
    }

    const result = await runMutation(async () => {
      const goal = await createGoal({
        childId,
        title: `${childName}'s Special Goal`,
        targetCoins: 100,
        deadline: null,
      });

      setGoalForChild(childId, goal);
      return true;
    });

    return Boolean(result);
  }, [hasSupabase, runMutation, setGoalForChild]);

  const raiseGoalTarget = useCallback(async (childId: string, goal: ParentGoal | null, increment = 20) => {
    if (!hasSupabase || !goal?.id) {
      return false;
    }

    const goalId = goal.id;

    const result = await runMutation(async () => {
      const nextGoal = await updateGoalTarget(goalId, goal.target + increment);
      setGoalForChild(childId, nextGoal);
      return true;
    });

    return Boolean(result);
  }, [hasSupabase, runMutation, setGoalForChild]);

  const generateMomentSuggestion = useCallback(async (input: {
    childId: string;
    childName: string;
    age: number;
  }) => {
    if (!hasSupabase || !familyId || !parentId) {
      return null;
    }

    const result = await runMutation(async () => {
      const preferences = await fetchChildPreferences(input.childId);
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childName: input.childName,
          age: input.age,
          preferences: preferences
            .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
            .slice(0, 3)
            .map((item) => item.label)
            .filter(Boolean),
          durationMinutes: 20,
          householdName: "Lena's Homestead",
        }),
      });

      const payload = await response.json() as {
        error?: string;
        suggestion?: {
          activity: string;
          duration: string;
          rationale: string;
          supplies: string[];
          encouragement: string;
          nearbySuggestions: Array<{
            name: string;
            query: string;
            distanceLabel: string;
            ratingLabel: string;
            note: string;
          }>;
        };
      };

      if (!response.ok || !payload.suggestion) {
        throw new Error(payload.error ?? 'Advisor suggestion failed.');
      }

      const suggestion = payload.suggestion;
      const advisorRow = await createAdvisorMessage({
        familyId,
        parentId,
        childId: input.childId,
        message: suggestion.encouragement,
        suggestedActivity: suggestion.activity,
      });

      await Promise.all(
        suggestion.nearbySuggestions.slice(0, 2).map((place) =>
          storePlaceCache({
            query: place.query,
            placeName: place.name,
            rating: Number.parseFloat(place.ratingLabel) || 4.5,
            openNow: true,
            mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`,
          })
        )
      );

      const moment = {
        advisorMessageId: advisorRow.id,
        title: suggestion.activity,
        duration: suggestion.duration,
        description: suggestion.rationale,
        supplies: suggestion.supplies.length ? suggestion.supplies : ['home setup'],
        rewardSeeds: 5,
        rewardTokens: 3,
        mapsLink: suggestion.nearbySuggestions[0]
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(suggestion.nearbySuggestions[0].name)}`
          : undefined,
      };

      setMomentForChild(input.childId, moment);
      return {
        encouragement: suggestion.encouragement,
        moment,
      };
    });

    return result;
  }, [familyId, hasSupabase, parentId, runMutation, setMomentForChild]);

  const ensureMomentActivity = useCallback(async (
    childId: string,
    moment: ParentMoment,
  ) => {
    if (!hasSupabase) {
      return { activityId: moment.id ?? null, calendarEventId: moment.calendarEventId ?? null };
    }

    const result = await runMutation(async () => {
      const activityRow = moment.id
        ? { id: moment.id }
        : await createActivity({
            familyId,
            childId,
            activity: moment.title,
            locationName: 'Home',
            mapsLink: moment.mapsLink,
          });

      let calendarEventId = moment.calendarEventId ?? null;
      if (!calendarEventId && parentId && familyId) {
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + parseDurationMinutes(moment.duration) * 60_000);
        const calendarEvent = await createCalendarEvent({
          parentId,
          familyId,
          title: moment.title,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        });
        calendarEventId = calendarEvent.id;
      }

      if (moment.advisorMessageId) {
        await updateAdvisorMessageStatus(moment.advisorMessageId, 'accepted');
      }

      return {
        activityId: activityRow.id,
        calendarEventId,
      };
    });

    return result ?? { activityId: null, calendarEventId: null };
  }, [familyId, hasSupabase, parentId, runMutation]);

  const markMomentCompleted = useCallback(async (input: {
    momentId?: string | null;
    childId: string;
    nextCoins: number;
    rewardSeeds: number;
    title: string;
  }) => {
    if (!hasSupabase || !familyId || !input.momentId) {
      return false;
    }

    const momentId = input.momentId;

    const result = await runMutation(async () => {
      await completeActivity(momentId);
      await updateChildCoins(input.childId, input.nextCoins);
      await createEventLog({
        familyId,
        childId: input.childId,
        eventType: 'moment_completed',
        metadata: {
          activityTitle: input.title,
          reward: input.rewardSeeds,
        },
      });
      return true;
    });

    return Boolean(result);
  }, [familyId, hasSupabase, runMutation]);

  return {
    error,
    hasSupabase,
    isLoading,
    isMutating,
    refetch,
    approveSuggestedQuests,
    createDefaultGoal,
    ensureMomentActivity,
    generateMomentSuggestion,
    markMomentCompleted,
    markQuestCompleted,
    markQuestOngoing,
    raiseGoalTarget,
    syncChildCoins,
  };
}
