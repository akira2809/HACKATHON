'use client';

import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { Card, CardBody, Chip } from '@heroui/react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/parent/AppShell';
import { MascotBubble } from '@/components/parent/MascotBubble';
import { ProgressBar } from '@/components/parent/ProgressBar';
import {
    CalendarIcon,
    CompassIcon,
    HearthActionButton,
    HomeIcon,
    TargetIcon,
} from '@/components/design-system/HearthPrimitives';
import { useChildren } from '@/hooks/useChildren';
import { useEventLogs } from '@/hooks/useEventLogs';
import { useMomentNotifications } from '@/hooks/useMomentNotifications';
import { useParentMomentsData } from '@/hooks/useParentMomentsData';
import { buildLocalizedHref } from '@/lib/locale-path';
import {
    FAMILY_MOMENT_DURATION_MINUTES,
    FAMILY_MOMENT_REWARD_SEEDS,
    formatTimeWindow,
    getActivityLocationLabel,
} from '@/lib/parent-moments';
import { useAppState } from '@/state/appState';
import { ParentStateCard } from './ParentStateCard';

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export function ParentTimerScreen() {
    const params = useParams<{ locale: string }>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activityId = searchParams.get('activityId');
    const eventId = searchParams.get('eventId');

    const activeMomentChildId = useAppState((state) => state.activeMomentChildId);
    const cancelMomentFlow = useAppState((state) => state.cancelMomentFlow);

    const {
        activeChild,
        activitiesQuery,
        childItems,
        currentActivity,
        familyId,
        familySummary,
        hasNoChildren,
        isChildSelectorLoading,
        momentsError,
        scheduledEvent,
        selectedChildId,
    } = useParentMomentsData({
        activityIdOverride: activityId,
        childIdOverride: activeMomentChildId,
        eventIdOverride: eventId,
    });

    useMomentNotifications({
        activities: activitiesQuery.activities,
        autoMarkSeen: true,
        familyId,
    });

    const childrenQuery = useChildren(familyId, {
        enabled: Boolean(familyId),
    });
    const eventLogsQuery = useEventLogs(familyId, {
        enabled: Boolean(familyId),
    });

    const totalSeconds = FAMILY_MOMENT_DURATION_MINUTES * 60;
    const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
    const [isRunning, setIsRunning] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [completionError, setCompletionError] = useState<string | null>(null);
    const [rewardedSeedTotal, setRewardedSeedTotal] = useState<number | null>(null);
    const completionGuardRef = useRef(false);

    const returnToPlanner = () => {
        cancelMomentFlow();
        router.push(buildLocalizedHref(params.locale, '/parent/moments'));
    };

    useEffect(() => {
        setSecondsLeft(totalSeconds);
        setIsRunning(true);
        setIsComplete(false);
        setIsCompleting(false);
        setCompletionError(null);
        setRewardedSeedTotal(null);
        completionGuardRef.current = false;
    }, [activityId, totalSeconds]);

    useEffect(() => {
        if (!isRunning || isComplete) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setSecondsLeft((currentSeconds) => Math.max(0, currentSeconds - 1));
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [isComplete, isRunning]);

    const completeActivityFromEffect = useEffectEvent(() => {
        void handleCompleteActivity();
    });

    useEffect(() => {
        if (secondsLeft !== 0 || isComplete || completionGuardRef.current) {
            return;
        }

        completionGuardRef.current = true;
        completeActivityFromEffect();
    }, [isComplete, secondsLeft]);

    const returnToPlannerFromEffect = useEffectEvent(() => {
        returnToPlanner();
    });

    useEffect(() => {
        if (!isComplete) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                returnToPlannerFromEffect();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isComplete]);

    const navItems = [
        {
            key: 'home',
            label: 'Home',
            icon: <HomeIcon className="size-4" />,
            active: false,
            disabled: true,
            onPress: () => undefined,
        },
        {
            key: 'adventures',
            label: 'Adventures',
            icon: <CompassIcon className="size-4" />,
            active: false,
            disabled: true,
            onPress: () => undefined,
        },
        {
            key: 'dreams',
            label: 'Dreams',
            icon: <TargetIcon className="size-4" />,
            active: false,
            disabled: true,
            onPress: () => undefined,
        },
        {
            key: 'moments',
            label: 'Moments',
            icon: <CalendarIcon className="size-4" />,
            active: true,
            disabled: true,
            onPress: () => undefined,
        },
    ];

    async function handleCompleteActivity() {
        if (
            !activeChild
            || !currentActivity
            || !familyId
            || isComplete
            || isCompleting
        ) {
            return;
        }

        setIsCompleting(true);
        setCompletionError(null);
        setIsRunning(false);

        try {
            await activitiesQuery.completeActivity(currentActivity.id, {
                completed: true,
            });

            const nextSeedTotal = activeChild.seeds + FAMILY_MOMENT_REWARD_SEEDS;

            await childrenQuery.updateChild(activeChild.id, {
                coins: nextSeedTotal,
            });

            await eventLogsQuery.createEventLog({
                childId: activeChild.id,
                eventType: 'activity_completed',
                familyId,
                metadata: {
                    activity: currentActivity.activity,
                    activityId: currentActivity.id,
                    rewardSeeds: FAMILY_MOMENT_REWARD_SEEDS,
                },
            });

            setRewardedSeedTotal(nextSeedTotal);
            setIsComplete(true);
        } catch (error) {
            completionGuardRef.current = false;
            setCompletionError(
                error instanceof Error
                    ? error.message
                    : 'The family activity could not be completed just yet.',
            );
            setIsRunning(true);
        } finally {
            setIsCompleting(false);
        }
    }

    if (hasNoChildren) {
        return (
            <AppShell
                childItems={[]}
                childSelectorDisabled
                description="A family profile is needed before the timer can run."
                familySeeds={familySummary}
                navItems={navItems}
                onSelectChild={() => undefined}
                selectedChildId=""
                title="Activity Timer"
            >
                <ParentStateCard
                    kicker="Setup"
                    title="No child is available"
                    description="Add a child profile first, then return to the moments planner."
                    actionLabel="Back To Planner"
                    onAction={returnToPlanner}
                />
            </AppShell>
        );
    }

    if (!activityId) {
        return (
            <AppShell
                childItems={childItems}
                childSelectorDisabled
                description="An activity needs to be selected before the timer can open."
                familySeeds={familySummary}
                isChildSelectorLoading={isChildSelectorLoading}
                navItems={navItems}
                onSelectChild={() => undefined}
                selectedChildId={selectedChildId}
                title="Activity Timer"
            >
                <ParentStateCard
                    kicker="Flow"
                    title="No activity was selected"
                    description="Return to the planner, review the child request, and start the timer from there."
                    actionLabel="Back To Planner"
                    onAction={returnToPlanner}
                />
            </AppShell>
        );
    }

    if (!activeChild || !currentActivity) {
        return (
            <AppShell
                childItems={childItems}
                childSelectorDisabled
                description="The activity record is being checked now."
                familySeeds={familySummary}
                isChildSelectorLoading={isChildSelectorLoading}
                navItems={navItems}
                notice={momentsError ? (
                    <Card shadow="none" className="rounded-[22px] border border-[rgba(180,106,90,0.12)] bg-[rgba(251,248,241,0.92)]">
                        <CardBody className="p-4 text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                            {momentsError}
                        </CardBody>
                    </Card>
                ) : null}
                onSelectChild={() => undefined}
                selectedChildId={selectedChildId}
                title="Activity Timer"
            >
                <ParentStateCard
                    kicker="Waiting"
                    title="This activity is not ready for the timer"
                    description="Return to the planner and make sure the child request is still available."
                    actionLabel="Back To Planner"
                    onAction={returnToPlanner}
                />
            </AppShell>
        );
    }

    if (currentActivity.completed) {
        return (
            <AppShell
                childItems={childItems}
                childSelectorDisabled
                description={`${activeChild.name}'s activity has already been completed.`}
                familySeeds={familySummary}
                isChildSelectorLoading={isChildSelectorLoading}
                navItems={navItems}
                onSelectChild={() => undefined}
                selectedChildId={activeChild.id}
                title="Activity Timer"
            >
                <ParentStateCard
                    kicker="Completed"
                    title="This activity is already finished"
                    description="Return to the planner to review the next family moment."
                    actionLabel="Back To Planner"
                    onAction={returnToPlanner}
                />
            </AppShell>
        );
    }

    if (!scheduledEvent) {
        return (
            <AppShell
                childItems={childItems}
                childSelectorDisabled
                description="Save the family schedule before the timer begins."
                familySeeds={familySummary}
                isChildSelectorLoading={isChildSelectorLoading}
                navItems={navItems}
                onSelectChild={() => undefined}
                selectedChildId={activeChild.id}
                title="Activity Timer"
            >
                <ParentStateCard
                    kicker="Schedule Required"
                    title="The time window is missing"
                    description="Return to the planner and save the family activity schedule first."
                    actionLabel="Back To Planner"
                    onAction={returnToPlanner}
                />
            </AppShell>
        );
    }

    const elapsedSeconds = Math.max(0, totalSeconds - secondsLeft);
    const timeWindowLabel = formatTimeWindow(scheduledEvent.startTime, scheduledEvent.endTime);
    const locationLabel = getActivityLocationLabel(currentActivity.locationName);

    return (
        <AppShell
            childItems={childItems}
            childSelectorDisabled
            description={`Keep the screen quiet while ${activeChild.name}'s shared activity is underway.`}
            familySeeds={familySummary}
            isChildSelectorLoading={isChildSelectorLoading}
            navItems={navItems}
            notice={momentsError ? (
                <Card shadow="none" className="rounded-[22px] border border-[rgba(180,106,90,0.12)] bg-[rgba(251,248,241,0.92)]">
                    <CardBody className="p-4 text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                        {momentsError}
                    </CardBody>
                </Card>
            ) : null}
            onSelectChild={() => undefined}
            selectedChildId={activeChild.id}
            title="Activity Timer"
        >
            <Card shadow="none" className="hearth-ledger-card rounded-[30px]">
                <CardBody className="grid gap-5 p-5 text-center sm:gap-6 sm:p-6">
                    <div className="grid gap-2 justify-items-center">
                        <p className="hearth-kicker">Timer In Progress</p>
                        <h2 className="hearth-heading text-[1.55rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.8rem]">
                            {currentActivity.activity}
                        </h2>
                        <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                            Stay present with {activeChild.name}. The timer can carry the rest of the structure now.
                        </p>
                    </div>

                    <div className="grid justify-items-center gap-3">
                        <div className="rounded-[24px] border border-[rgba(79,107,82,0.1)] bg-[rgba(251,248,241,0.9)] px-6 py-5 sm:rounded-[28px] sm:px-8 sm:py-6">
                            <span className="hearth-number text-[2.4rem] font-semibold tracking-[-0.04em] text-[var(--hearth-text-primary)] sm:text-5xl">
                                {formatTime(secondsLeft)}
                            </span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            <Chip radius="full" variant="flat" className="border border-[rgba(230,199,102,0.24)] bg-[rgba(230,199,102,0.18)] text-[var(--hearth-text-primary)]">
                                <span className="px-1 text-[10px] font-semibold sm:text-[11px]">
                                    {FAMILY_MOMENT_DURATION_MINUTES} minutes
                                </span>
                            </Chip>
                            <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]">
                                <span className="px-1 text-[10px] font-semibold sm:text-[11px]">
                                    {locationLabel}
                                </span>
                            </Chip>
                            {timeWindowLabel ? (
                                <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]">
                                    <span className="px-1 text-[10px] font-semibold sm:text-[11px]">
                                        {timeWindowLabel}
                                    </span>
                                </Chip>
                            ) : null}
                        </div>
                    </div>

                    <ProgressBar
                        label="Shared time"
                        maxValue={totalSeconds}
                        value={elapsedSeconds}
                        valueLabel={`${formatTime(elapsedSeconds)} elapsed`}
                    />

                    <div className="flex flex-wrap justify-center gap-3">
                        <HearthActionButton tone="secondary" onPress={() => setIsRunning((value) => !value)}>
                            {isRunning ? 'Pause Timer' : 'Resume Timer'}
                        </HearthActionButton>
                        <HearthActionButton isLoading={isCompleting} onPress={() => void handleCompleteActivity()}>
                            Complete Activity
                        </HearthActionButton>
                        <HearthActionButton tone="ghost" onPress={returnToPlanner}>
                            End Gently
                        </HearthActionButton>
                    </div>
                </CardBody>
            </Card>

            {completionError ? (
                <ParentStateCard
                    kicker="Save Issue"
                    title="The activity could not be completed just yet"
                    description={completionError}
                    actionLabel="Try Again"
                    onAction={() => void handleCompleteActivity()}
                />
            ) : null}

            {isComplete ? (
                <div
                    aria-hidden="true"
                    className="fixed inset-0 z-40 bg-[rgba(47,52,44,0.18)] px-3 py-6 backdrop-blur-[2px] sm:px-4 sm:py-8"
                    onClick={returnToPlanner}
                >
                    <div className="mx-auto grid min-h-full max-w-[420px] content-center sm:max-w-[460px]">
                        <Card
                            aria-modal="true"
                            role="dialog"
                            shadow="none"
                            className="hearth-ledger-card rounded-[30px]"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <CardBody className="grid gap-4 p-5 sm:gap-5 sm:p-6">
                                <div className="grid gap-2">
                                    <p className="hearth-kicker">Completion</p>
                                    <h2 className="hearth-heading text-[1.55rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.8rem]">
                                        {currentActivity.activity} is complete
                                    </h2>
                                    <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                                        The family moment is logged and the reward has been added for {activeChild.name}.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="hearth-subtle-panel rounded-[22px] p-3 sm:p-4">
                                        <p className="hearth-kicker">Reward</p>
                                        <p className="hearth-number mt-2 text-base font-semibold text-[var(--hearth-text-primary)] sm:text-lg">
                                            +{FAMILY_MOMENT_REWARD_SEEDS} Seeds
                                        </p>
                                    </div>
                                    <div className="hearth-subtle-panel rounded-[22px] p-3 sm:p-4">
                                        <p className="hearth-kicker">Logged</p>
                                        <p className="hearth-number mt-2 text-base font-semibold text-[var(--hearth-text-primary)] sm:text-lg">
                                            1 Family Moment
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-[22px] border border-[rgba(79,107,82,0.08)] bg-[rgba(251,248,241,0.84)] p-3.5 sm:p-4">
                                    <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                                        {activeChild.name} now has {rewardedSeedTotal ?? activeChild.seeds} seeds saved on the family board.
                                    </p>
                                </div>

                                <MascotBubble
                                    actionIcon={<CalendarIcon className="size-4" />}
                                    actionLabel="Return To Planner"
                                    message="What a wonderful evening at your homestead. Let the next shared step stay this simple too."
                                    onAction={returnToPlanner}
                                    title="Lena Says"
                                />
                            </CardBody>
                        </Card>
                    </div>
                </div>
            ) : null}
        </AppShell>
    );
}
