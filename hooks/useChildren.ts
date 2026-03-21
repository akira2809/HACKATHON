'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { homesteadApi, type ChildRecord, type CreateChildInput, type UpdateChildInput } from '@/lib/homestead-api';
import { createMissingParameterError, createQueryState, type QueryOptions, toErrorMessage } from './query-utils';

type ChildrenQueryState = ReturnType<typeof createQueryState<ChildRecord[]>>;
type ChildrenStore = {
    createChild: (input: CreateChildInput) => Promise<ChildRecord | null>;
    fetchChildren: (familyId: string) => Promise<ChildRecord[]>;
    queries: Record<string, ChildrenQueryState>;
    removeChild: (familyId: string, childId: string) => Promise<void>;
    updateChild: (familyId: string, childId: string, input: UpdateChildInput) => Promise<ChildRecord | null>;
};

const emptyChildren: ChildRecord[] = [];

const useChildrenStore = create<ChildrenStore>((set) => ({
    createChild: async (input) => {
        const child = await homesteadApi.children.create(input);

        if (!child) {
            return null;
        }

        set((state) => {
            const query = state.queries[input.familyId];

            if (!query) {
                return state;
            }

            return {
                queries: {
                    ...state.queries,
                    [input.familyId]: {
                        ...query,
                        data: [...query.data, child],
                        error: null,
                        isLoaded: true,
                    },
                },
            };
        });

        return child;
    },
    fetchChildren: async (familyId) => {
        set((state) => ({
            queries: {
                ...state.queries,
                [familyId]: {
                    ...(state.queries[familyId] ?? createQueryState(emptyChildren)),
                    error: null,
                    isLoading: true,
                },
            },
        }));

        try {
            const children = await homesteadApi.children.listByFamily(familyId);

            set((state) => ({
                queries: {
                    ...state.queries,
                    [familyId]: {
                        data: children,
                        error: null,
                        isLoaded: true,
                        isLoading: false,
                    },
                },
            }));

            return children;
        } catch (error) {
            const message = toErrorMessage(error, 'Failed to load children.');

            set((state) => ({
                queries: {
                    ...state.queries,
                    [familyId]: {
                        ...(state.queries[familyId] ?? createQueryState(emptyChildren)),
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
    removeChild: async (familyId, childId) => {
        await homesteadApi.children.remove(childId);

        set((state) => {
            const query = state.queries[familyId];

            if (!query) {
                return state;
            }

            return {
                queries: {
                    ...state.queries,
                    [familyId]: {
                        ...query,
                        data: query.data.filter((child) => child.id !== childId),
                    },
                },
            };
        });
    },
    updateChild: async (familyId, childId, input) => {
        const child = await homesteadApi.children.update(childId, input);

        if (!child) {
            return null;
        }

        set((state) => {
            const query = state.queries[familyId];

            if (!query) {
                return state;
            }

            return {
                queries: {
                    ...state.queries,
                    [familyId]: {
                        ...query,
                        data: query.data.map((item) => (item.id === childId ? child : item)),
                    },
                },
            };
        });

        return child;
    },
}));

export function useChildren(familyId?: string, options: QueryOptions = {}) {
    const enabled = options.enabled ?? true;
    const query = useChildrenStore((state) => (familyId ? state.queries[familyId] : undefined));
    const fetchChildren = useChildrenStore((state) => state.fetchChildren);
    const createChild = useChildrenStore((state) => state.createChild);
    const updateChild = useChildrenStore((state) => state.updateChild);
    const removeChild = useChildrenStore((state) => state.removeChild);
    const resolvedQuery = query ?? createQueryState(emptyChildren);

    useEffect(() => {
        if (!enabled || !familyId || resolvedQuery.isLoaded || resolvedQuery.isLoading) {
            return;
        }

        void fetchChildren(familyId);
    }, [enabled, familyId, fetchChildren, resolvedQuery.isLoaded, resolvedQuery.isLoading]);

    return {
        children: resolvedQuery.data,
        createChild,
        error: resolvedQuery.error,
        isLoaded: resolvedQuery.isLoaded,
        isLoading: resolvedQuery.isLoading,
        refetch: () => {
            if (!familyId) {
                return Promise.reject(createMissingParameterError('familyId'));
            }

            return fetchChildren(familyId);
        },
        removeChild: (childId: string) => {
            if (!familyId) {
                return Promise.reject(createMissingParameterError('familyId'));
            }

            return removeChild(familyId, childId);
        },
        updateChild: (childId: string, input: UpdateChildInput) => {
            if (!familyId) {
                return Promise.reject(createMissingParameterError('familyId'));
            }

            return updateChild(familyId, childId, input);
        },
    };
}
