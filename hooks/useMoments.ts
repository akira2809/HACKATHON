'use client';

import { useState, useCallback } from 'react';
import { generateMomentsWithAgent, type GeneratedActivityItem } from '@/lib/agent';

type UseMomentsGeneratorOptions = {
    familyId?: string;
    childId?: string;
    childAge?: number;
};

export function useMomentsGenerator(options: UseMomentsGeneratorOptions = {}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activities, setActivities] = useState<GeneratedActivityItem[]>([]);

    const generate = useCallback(async (overrides?: Partial<UseMomentsGeneratorOptions>) => {
        const familyId = overrides?.familyId ?? options.familyId;
        const childId = overrides?.childId ?? options.childId;
        const childAge = overrides?.childAge ?? options.childAge;

        if (!familyId || !childId) {
            setError('familyId and childId are required');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await generateMomentsWithAgent({
                familyId,
                childId,
                childAge,
            });

            const activities = response.suggestions ?? response.activities ?? [];
            setActivities(activities);
            return activities;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to generate moments';
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [options.familyId, options.childId, options.childAge]);

    const reset = useCallback(() => {
        setActivities([]);
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        activities,
        error,
        generate,
        isLoading,
        reset,
    };
}
