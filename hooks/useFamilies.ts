'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { homesteadApi, type FamilyRecord } from '@/lib/homestead-api';
import { createQueryState, type QueryOptions, toErrorMessage } from './query-utils';

type FamiliesStore = {
    fetchFamilies: () => Promise<FamilyRecord[]>;
    query: ReturnType<typeof createQueryState<FamilyRecord[]>>;
};

const emptyFamilies: FamilyRecord[] = [];

const useFamiliesStore = create<FamiliesStore>((set) => ({
    fetchFamilies: async () => {
        set((state) => ({
            query: {
                ...state.query,
                error: null,
                isLoading: true,
            },
        }));

        try {
            const families = await homesteadApi.families.list();

            set({
                query: {
                    data: families,
                    error: null,
                    isLoaded: true,
                    isLoading: false,
                },
            });

            return families;
        } catch (error) {
            const message = toErrorMessage(error, 'Failed to load families.');

            set((state) => ({
                query: {
                    ...state.query,
                    error: message,
                    isLoaded: true,
                    isLoading: false,
                },
            }));

            throw error;
        }
    },
    query: createQueryState(emptyFamilies),
}));

export function useFamilies(options: QueryOptions = {}) {
    const enabled = options.enabled ?? true;
    const query = useFamiliesStore((state) => state.query);
    const fetchFamilies = useFamiliesStore((state) => state.fetchFamilies);

    useEffect(() => {
        if (!enabled || query.isLoaded || query.isLoading) {
            return;
        }

        void fetchFamilies();
    }, [enabled, fetchFamilies, query.isLoaded, query.isLoading]);

    return {
        error: query.error,
        families: query.data,
        isLoaded: query.isLoaded,
        isLoading: query.isLoading,
        refetch: fetchFamilies,
    };
}
