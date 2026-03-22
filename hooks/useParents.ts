'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { homesteadApi, type ParentRecord } from '@/lib/homestead-api';
import { createMissingParameterError, createQueryState, type QueryOptions, toErrorMessage } from './query-utils';

type ParentsQueryState = ReturnType<typeof createQueryState<ParentRecord[]>>;
type ParentsStore = {
    fetchParents: (familyId: string) => Promise<ParentRecord[]>;
    queries: Record<string, ParentsQueryState>;
};

const emptyParents: ParentRecord[] = [];

const useParentsStore = create<ParentsStore>((set) => ({
    fetchParents: async (familyId) => {
        set((state) => ({
            queries: {
                ...state.queries,
                [familyId]: {
                    ...(state.queries[familyId] ?? createQueryState(emptyParents)),
                    error: null,
                    isLoading: true,
                },
            },
        }));

        try {
            const parents = await homesteadApi.parents.listByFamily(familyId);

            set((state) => ({
                queries: {
                    ...state.queries,
                    [familyId]: {
                        data: parents,
                        error: null,
                        isLoaded: true,
                        isLoading: false,
                    },
                },
            }));

            return parents;
        } catch (error) {
            const message = toErrorMessage(error, 'Failed to load parents.');

            set((state) => ({
                queries: {
                    ...state.queries,
                    [familyId]: {
                        ...(state.queries[familyId] ?? createQueryState(emptyParents)),
                        error: message,
                        isLoaded: true,
                        isLoading: false,
                    },
                },
            }));

            throw error;
        }
    },
    queries: {},
}));

export function useParents(familyId?: string, options: QueryOptions = {}) {
    const enabled = options.enabled ?? true;
    const query = useParentsStore((state) => (familyId ? state.queries[familyId] : undefined));
    const fetchParents = useParentsStore((state) => state.fetchParents);
    const resolvedQuery = query ?? createQueryState(emptyParents);

    useEffect(() => {
        if (!enabled || !familyId || resolvedQuery.isLoaded || resolvedQuery.isLoading) {
            return;
        }

        void fetchParents(familyId);
    }, [enabled, familyId, fetchParents, resolvedQuery.isLoaded, resolvedQuery.isLoading]);

    return {
        error: resolvedQuery.error,
        isLoaded: resolvedQuery.isLoaded,
        isLoading: resolvedQuery.isLoading,
        parents: resolvedQuery.data,
        refetch: () => {
            if (!familyId) {
                return Promise.reject(createMissingParameterError('familyId'));
            }

            return fetchParents(familyId);
        },
    };
}
