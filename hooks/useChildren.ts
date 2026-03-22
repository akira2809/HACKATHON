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
const CHILDREN_SYNC_CHANNEL_NAME = 'homestead-children';
const CHILDREN_SYNC_STORAGE_KEY = 'homestead-children-sync';
const CHILDREN_SYNC_SOURCE = `children-${Math.random().toString(36).slice(2)}`;

type ChildrenSyncMessage = {
    familyId: string;
    source: string;
    type: 'children-updated';
};

let childrenSyncChannel: BroadcastChannel | null = null;

function getChildrenSyncChannel() {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
        return null;
    }

    if (!childrenSyncChannel) {
        childrenSyncChannel = new BroadcastChannel(CHILDREN_SYNC_CHANNEL_NAME);
    }

    return childrenSyncChannel;
}

function broadcastChildrenSync(familyId: string) {
    const payload = {
        familyId,
        source: CHILDREN_SYNC_SOURCE,
        type: 'children-updated',
    } satisfies ChildrenSyncMessage;
    const channel = getChildrenSyncChannel();

    if (channel) {
        channel.postMessage(payload);
    }

    if (typeof window !== 'undefined') {
        window.localStorage.setItem(CHILDREN_SYNC_STORAGE_KEY, JSON.stringify(payload));
    }
}

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
        broadcastChildrenSync(input.familyId);

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
        broadcastChildrenSync(familyId);
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
        broadcastChildrenSync(familyId);

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

    useEffect(() => {
        if (!enabled || !familyId) {
            return;
        }

        const handleSyncMessage = (payload: ChildrenSyncMessage) => {
            if (
                payload.type !== 'children-updated'
                || payload.source === CHILDREN_SYNC_SOURCE
                || payload.familyId !== familyId
            ) {
                return;
            }

            void fetchChildren(familyId);
        };

        const channel = getChildrenSyncChannel();

        const handleChannelMessage = (event: MessageEvent<ChildrenSyncMessage>) => {
            handleSyncMessage(event.data);
        };

        const handleStorage = (event: StorageEvent) => {
            if (!event.newValue || event.key !== CHILDREN_SYNC_STORAGE_KEY) {
                return;
            }

            try {
                handleSyncMessage(JSON.parse(event.newValue) as ChildrenSyncMessage);
            } catch {
                return;
            }
        };

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                void fetchChildren(familyId);
            }
        };

        const handleFocus = () => {
            void fetchChildren(familyId);
        };

        if (channel) {
            channel.addEventListener('message', handleChannelMessage);
        }

        window.addEventListener('storage', handleStorage);
        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('focus', handleFocus);

        return () => {
            if (channel) {
                channel.removeEventListener('message', handleChannelMessage);
            }

            window.removeEventListener('storage', handleStorage);
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('focus', handleFocus);
        };
    }, [enabled, familyId, fetchChildren]);

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
