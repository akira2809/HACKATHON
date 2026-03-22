'use client';

import { useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ActivityRecord, ChildRecord } from '@/lib/homestead-api';

type SeenActivitiesByFamily = Record<string, string[]>;

type MomentNotificationStore = {
    markActivitiesSeen: (familyId: string, activityIds: string[]) => void;
    pruneSeenActivities: (familyId: string, activeActivityIds: string[]) => void;
    seenActivitiesByFamily: SeenActivitiesByFamily;
};

type UseMomentNotificationsOptions = {
    activities: ActivityRecord[];
    autoMarkSeen?: boolean;
    children?: ChildRecord[];
    familyId?: string | null;
};

const EMPTY_ACTIVITY_IDS: string[] = [];

const useMomentNotificationStore = create<MomentNotificationStore>()(
    persist(
        (set) => ({
            markActivitiesSeen: (familyId, activityIds) => {
                const uniqueIds = [...new Set(activityIds)];

                if (!uniqueIds.length) {
                    return;
                }

                set((state) => {
                    const currentIds = state.seenActivitiesByFamily[familyId] ?? [];

                    return {
                        seenActivitiesByFamily: {
                            ...state.seenActivitiesByFamily,
                            [familyId]: [...new Set([...currentIds, ...uniqueIds])],
                        },
                    };
                });
            },
            pruneSeenActivities: (familyId, activeActivityIds) => {
                set((state) => {
                    const currentIds = state.seenActivitiesByFamily[familyId] ?? [];

                    if (!currentIds.length) {
                        return state;
                    }

                    const nextIds = currentIds.filter((id) => activeActivityIds.includes(id));

                    if (nextIds.length === currentIds.length) {
                        return state;
                    }

                    return {
                        seenActivitiesByFamily: {
                            ...state.seenActivitiesByFamily,
                            [familyId]: nextIds,
                        },
                    };
                });
            },
            seenActivitiesByFamily: {},
        }),
        {
            name: 'moment-request-notifications',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);

export function useMomentNotifications({
    activities,
    autoMarkSeen = false,
    children = [],
    familyId,
}: UseMomentNotificationsOptions) {
    const seenActivityIds = useMomentNotificationStore((state) =>
        familyId ? state.seenActivitiesByFamily[familyId] ?? EMPTY_ACTIVITY_IDS : EMPTY_ACTIVITY_IDS,
    );
    const markActivitiesSeen = useMomentNotificationStore((state) => state.markActivitiesSeen);
    const pruneSeenActivities = useMomentNotificationStore((state) => state.pruneSeenActivities);

    const activeRequests = useMemo(
        () => activities.filter((activity) => !activity.completed),
        [activities],
    );
    const unreadRequests = useMemo(
        () => activeRequests.filter((activity) => !seenActivityIds.includes(activity.id)),
        [activeRequests, seenActivityIds],
    );
    const latestUnreadRequest = unreadRequests[unreadRequests.length - 1] ?? null;
    const activeActivityIds = useMemo(() => activities.map((activity) => activity.id), [activities]);
    const activeRequestIds = useMemo(
        () => activeRequests.map((activity) => activity.id),
        [activeRequests],
    );
    const activeActivityIdsKey = activeActivityIds.join('|');
    const activeRequestIdsKey = activeRequestIds.join('|');

    useEffect(() => {
        if (!familyId) {
            return;
        }

        pruneSeenActivities(familyId, activeActivityIds);
    }, [activeActivityIds, activeActivityIdsKey, familyId, pruneSeenActivities]);

    useEffect(() => {
        if (!autoMarkSeen || !familyId || !activeRequestIds.length) {
            return;
        }

        markActivitiesSeen(familyId, activeRequestIds);
    }, [activeRequestIds, activeRequestIdsKey, autoMarkSeen, familyId, markActivitiesSeen]);

    const latestUnreadChild = latestUnreadRequest
        ? children.find((child) => child.id === latestUnreadRequest.childId) ?? null
        : null;

    return {
        hasUnreadMomentRequests: unreadRequests.length > 0,
        latestUnreadMomentRequest: latestUnreadRequest
            ? {
                ...latestUnreadRequest,
                childName: latestUnreadChild?.name ?? 'Your child',
            }
            : null,
        markMomentRequestsSeen: () => {
            if (!familyId || !activeRequestIds.length) {
                return;
            }

            markActivitiesSeen(familyId, activeRequestIds);
        },
        unreadMomentRequestCount: unreadRequests.length,
    };
}
