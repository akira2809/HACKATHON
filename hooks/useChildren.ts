'use client';

import { useEffect, useRef } from 'react';
import { create } from 'zustand';
import { homesteadApi, type ChildRecord, type CreateChildInput, type UpdateChildInput } from '@/lib/homestead-api';
import { createMissingParameterError, createQueryState, type QueryOptions, toErrorMessage } from './query-utils';

type ChildrenQueryState = ReturnType<typeof createQueryState<ChildRecord[]>>;
type ChildrenStore = {
    createChild: (input: CreateChildInput) => Promise<ChildRecord | null>;
    fetchChildren: (familyId: string, sessionVersion?: number) => Promise<ChildRecord[]>;
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
    fetchChildren: async (familyId, sessionVersion = 0) => {
        const queryKey = `${familyId}:${sessionVersion}`;

        set((state) => ({
            queries: {
                ...state.queries,
                [queryKey]: {
                    ...(state.queries[queryKey] ?? createQueryState(emptyChildren)),
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
                    [queryKey]: {
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
                    [queryKey]: {
                        ...(state.queries[queryKey] ?? createQueryState(emptyChildren)),
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
            // Remove from ALL query versions for this familyId
            const nextQueries: Record<string, ChildrenQueryState> = {};
            Object.entries(state.queries).forEach(([key, query]) => {
                if (key.startsWith(familyId)) {
                    nextQueries[key] = {
                        ...query,
                        data: query.data.filter((child) => child.id !== childId),
                    };
                } else {
                    nextQueries[key] = query;
                }
            });

            return { queries: nextQueries };
        });
    },
    updateChild: async (familyId, childId, input) => {
        const child = await homesteadApi.children.update(childId, input);

        if (!child) {
            return null;
        }

        set((state) => {
            // Update in ALL query versions for this familyId
            const nextQueries: Record<string, ChildrenQueryState> = {};
            Object.entries(state.queries).forEach(([key, query]) => {
                if (key.startsWith(familyId)) {
                    nextQueries[key] = {
                        ...query,
                        data: query.data.map((item) => (item.id === childId ? child : item)),
                    };
                } else {
                    nextQueries[key] = query;
                }
            });

            return { queries: nextQueries };
        });

        return child;
    },
}));

export function useChildren(familyId?: string, options: QueryOptions = {}) {
    const { sessionVersion = 0 } = options as QueryOptions & { sessionVersion?: number };
    const enabled = options.enabled ?? true;
    const queryKey = familyId ? `${familyId}:${sessionVersion}` : '';
    const query = useChildrenStore((state) => (queryKey ? state.queries[queryKey] : undefined));
    const fetchChildren = useChildrenStore((state) => state.fetchChildren);
    const createChild = useChildrenStore((state) => state.createChild);
    const updateChild = useChildrenStore((state) => state.updateChild);
    const removeChild = useChildrenStore((state) => state.removeChild);
    const resolvedQuery = query ?? createQueryState(emptyChildren);

    // Track previous session version to detect changes
    const prevSessionVersionRef = useRef(sessionVersion);

    useEffect(() => {
        if (!enabled || !familyId) {
            return;
        }

        // Re-fetch when session version changes (child/family switched)
        const sessionChanged = prevSessionVersionRef.current !== sessionVersion;
        prevSessionVersionRef.current = sessionVersion;

        // Only fetch if: never loaded OR session changed
        if (sessionChanged || !resolvedQuery.isLoaded) {
            if (!resolvedQuery.isLoading) {
                void fetchChildren(familyId, sessionVersion);
            }
        }
    }, [enabled, familyId, sessionVersion, fetchChildren, resolvedQuery.isLoaded, resolvedQuery.isLoading]);

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

            return fetchChildren(familyId, sessionVersion);
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
