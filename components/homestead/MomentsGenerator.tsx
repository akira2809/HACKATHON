'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateMomentsWithAgent, type GeneratedActivityItem } from '@/lib/agent';
import { useChildDashboardData } from '@/hooks/useChildDashboardData';

interface MomentsGeneratorProps {
  onCreated?: () => void;
}

export function useMomentsGenerator() {
  const router = useRouter();
  const {
    familyId,
    childId,
    activityActions,
    activitiesQuery,
  } = useChildDashboardData();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMoments, setGeneratedMoments] = useState<GeneratedActivityItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generate = React.useCallback(async () => {
    if (!familyId || !childId) {
      setError('Missing family or child information');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateMomentsWithAgent({
        familyId,
        childId,
        childAge: undefined,
        location: undefined,
        theme: undefined,
      });

      const moments = response.suggestions ?? response.activities ?? [];
      setGeneratedMoments(moments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate moments');
    } finally {
      setIsGenerating(false);
    }
  }, [familyId, childId]);

  const selectMoment = React.useCallback(async (moment: GeneratedActivityItem) => {
    if (!familyId || !childId) return;

    try {
      await activityActions.createActivity({
        activity: moment.title,
        locationName: moment.location || 'Home',
        mapsLink: '',
        familyId,
        childId,
      });

      // Refresh activities
      await activitiesQuery.refetch?.();
      setGeneratedMoments([]);
      router.push('/moments');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create moment');
    }
  }, [familyId, childId, activityActions, activitiesQuery, router]);

  const clearMoments = React.useCallback(() => {
    setGeneratedMoments([]);
    setError(null);
  }, []);

  return {
    error,
    generatedMoments,
    isGenerating,
    generate,
    selectMoment,
    clearMoments,
  };
}
