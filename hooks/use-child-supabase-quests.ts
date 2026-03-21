'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppStore, useQuestStore } from '@/stores';
import {
  createEventLog,
  fetchChildQuestSnapshot,
  updateChildCoins,
  updateQuestStatus,
  updateQuestStreak,
  upsertChildPreference,
} from '@/lib/supabase/homestead-api';
import { hasSupabaseBrowserConfig } from '@/lib/supabase/client';
import type { QuestStatus } from '@/stores';

export function useChildSupabaseQuests() {
  const configuredChildId = useAppStore((state) => state.childId);
  const familyId = useAppStore((state) => state.familyId);
  const setChildId = useAppStore((state) => state.setChildId);
  const initFromData = useQuestStore((state) => state.initFromData);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const childId = useMemo(() => {
    if (configuredChildId) {
      return configuredChildId;
    }

    const envChildId = process.env.NEXT_PUBLIC_SUPABASE_CHILD_ID;
    return envChildId ?? null;
  }, [configuredChildId]);

  const hasSupabase = hasSupabaseBrowserConfig() && Boolean(process.env.NEXT_PUBLIC_SUPABASE_CHILD_ID);

  const mapRemoteStatus = (status: string): QuestStatus => {
    if (status === 'ongoing') {
      return 'ongoing';
    }

    if (status === 'completed') {
      return 'completed';
    }

    if (status === 'failed') {
      return 'failed';
    }

    return 'pending';
  };

  const syncChildState = useCallback(async () => {
    if (!hasSupabase || !childId) {
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const snapshot = await fetchChildQuestSnapshot(childId);
      initFromData({
        todayQuests: snapshot.quests.map((quest) => ({
          ...quest,
          status: mapRemoteStatus(quest.status),
        })),
        streak: snapshot.streak,
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync child quests.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [childId, hasSupabase, initFromData]);

  useEffect(() => {
    if (childId) {
      setChildId(childId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('active-child-id', childId);
      }
    }

    void syncChildState();
  }, [childId, setChildId, syncChildState]);

  const updateRemoteStatus = useCallback(async (
    questId: string,
    status: 'ongoing' | 'completed' | 'failed',
    options?: {
      nextCoins?: number;
      reward?: number;
      questTitle?: string;
      nextStreak?: number;
      longestStreak?: number;
    }
  ) => {
    if (!hasSupabase) {
      return false;
    }

    try {
      await updateQuestStatus(questId, status);
      if (status === 'completed' && childId && familyId) {
        if (typeof options?.nextCoins === 'number') {
          await updateChildCoins(childId, options.nextCoins);
        }

        await createEventLog({
          familyId,
          childId,
          eventType: 'quest_completed',
          metadata: {
            questTitle: options?.questTitle ?? 'Quest',
            reward: options?.reward ?? 0,
          },
        });

        if (options?.questTitle) {
          await upsertChildPreference({
            childId,
            label: options.questTitle,
            score: 2,
          });
        }

        if (typeof options?.nextStreak === 'number') {
          await updateQuestStreak(
            childId,
            options.nextStreak,
            Math.max(options.longestStreak ?? options.nextStreak, options.nextStreak),
          );
        }
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quest status.');
      return false;
    }
  }, [childId, familyId, hasSupabase]);

  return {
    childId,
    error,
    hasSupabase,
    isLoading,
    syncChildState,
    updateRemoteStatus,
  };
}
