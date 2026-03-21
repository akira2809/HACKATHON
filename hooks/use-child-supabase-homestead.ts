'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppStore, useDreamStore, useMomentStore, useQuestStore } from '@/stores';
import { fetchChildHomesteadSnapshot, upsertChildPreference } from '@/lib/supabase/homestead-api';
import { hasSupabaseBrowserConfig } from '@/lib/supabase/client';

function toEventTimeLabel(value?: string | null) {
  if (!value) {
    return 'Recently';
  }

  const date = new Date(value);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function useChildSupabaseHomestead() {
  const familyId = useAppStore((state) => state.familyId);
  const childId = useAppStore((state) => state.childId);
  const setActiveDream = useDreamStore((state) => state.setActiveDream);
  const setSeedHistory = useDreamStore((state) => state.setSeedHistory);
  const initMomentData = useMomentStore((state) => state.initFromData);
  const initQuestData = useQuestStore((state) => state.initFromData);
  const questSeeds = useQuestStore((state) => state.seeds);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasSupabase = useMemo(
    () =>
      hasSupabaseBrowserConfig()
      && Boolean(process.env.NEXT_PUBLIC_SUPABASE_CHILD_ID)
      && Boolean(process.env.NEXT_PUBLIC_SUPABASE_FAMILY_ID),
    []
  );

  const syncHomestead = useCallback(async () => {
    if (!hasSupabase || !childId || !familyId) {
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const snapshot = await fetchChildHomesteadSnapshot(childId, familyId);

      initQuestData({
        seeds: snapshot.coins,
      });

      setActiveDream(
        snapshot.goal
          ? {
              id: snapshot.goal.id ?? `goal-${childId}`,
              title: snapshot.goal.title,
              current: questSeeds,
              goal: snapshot.goal.target,
              message: snapshot.goal.note,
              badge: 'FAMILY DREAM',
              badgeColor: 'bg-yellow-400',
            }
          : null
      );

      initMomentData({
        activeMoment: snapshot.moment
          ? {
              id: snapshot.moment.id ?? `moment-${childId}`,
              title: snapshot.moment.title,
              description: snapshot.moment.description,
              time: snapshot.moment.duration,
              badge: 'Family Suggestion',
              badgeColor: 'bg-[#FACC15]',
              xpReward: snapshot.moment.rewardTokens,
              seedsReward: snapshot.moment.rewardSeeds,
              participants: [
                { role: 'parent', name: 'Parent' },
                { role: 'child', name: 'You' },
              ],
              status: 'active',
            }
          : null,
      });

      setSeedHistory(snapshot.eventLogs.slice(0, 5).map((log, index) => {
        const title = typeof log.metadata?.questTitle === 'string'
          ? log.metadata.questTitle
          : typeof log.metadata?.activityTitle === 'string'
            ? log.metadata.activityTitle
            : log.eventType.replace(/_/g, ' ');

        return {
          id: log.id ?? `seed-log-${index}`,
          title,
          time: toEventTimeLabel(log.created_at ?? log.createdAt),
          amount: typeof log.metadata?.reward === 'number' ? log.metadata.reward : 0,
          icon: log.eventType.includes('moment') ? 'favorite' : 'check_circle',
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
        };
      }));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync child homestead.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [childId, familyId, hasSupabase, initMomentData, initQuestData, questSeeds, setActiveDream, setSeedHistory]);

  useEffect(() => {
    void syncHomestead();
  }, [syncHomestead]);

  const recordPreference = useCallback(async (label: string, score = 1) => {
    if (!hasSupabase || !childId) {
      return false;
    }

    try {
      await upsertChildPreference({ childId, label, score });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update child preference.');
      return false;
    }
  }, [childId, hasSupabase]);

  return {
    error,
    hasSupabase,
    isLoading,
    recordPreference,
    syncHomestead,
  };
}
