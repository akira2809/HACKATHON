'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardBody, Chip, Skeleton, TimeInput, type TimeInputValue } from '@heroui/react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/parent/AppShell';
import { MascotBubble } from '@/components/parent/MascotBubble';
import {
    CalendarIcon,
    CompassIcon,
    HearthActionButton,
    HomeIcon,
    TargetIcon,
} from '@/components/design-system/HearthPrimitives';
import { useParentMomentsData } from '@/hooks/useParentMomentsData';
import { useMomentNotifications } from '@/hooks/useMomentNotifications';
import { buildLocalizedHref } from '@/lib/locale-path';
import {
    DEFAULT_MOMENT_END_TIME,
    DEFAULT_MOMENT_START_TIME,
    FAMILY_MOMENT_DURATION_MINUTES,
    FAMILY_MOMENT_REWARD_SEEDS,
    formatTimeWindow,
    getActivityLocationLabel,
    getActivitySupportCopy,
    toIsoFromTime,
    toTimeInputValue,
} from '@/lib/parent-moments';
import { useAppState } from '@/state/appState';
import { ParentStateCard } from './ParentStateCard';

function buildMomentFlowHref(locale: string, pathname: string, activityId: string, eventId?: string | null) {
    const searchParams = new URLSearchParams({ activityId });

    if (eventId) {
        searchParams.set('eventId', eventId);
    }

    return buildLocalizedHref(locale, `${pathname}?${searchParams.toString()}`);
}

function PlannerLoadingState() {
    return (
        <>
            <Card shadow="none" className="hearth-panel rounded-[24px]">
                <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                    <Skeleton className="h-4 w-28 rounded-full" />
                    <Skeleton className="h-12 w-64 rounded-[18px]" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-7 w-24 rounded-full" />
                        <Skeleton className="h-7 w-24 rounded-full" />
                        <Skeleton className="h-7 w-24 rounded-full" />
                    </div>
                </CardBody>
            </Card>

            <Card shadow="none" className="hearth-panel rounded-[26px]">
                <CardBody className="grid gap-4 p-4 sm:gap-5 sm:p-5">
                    <Skeleton className="h-4 w-24 rounded-full" />
                    <Skeleton className="h-9 w-52 rounded-[16px]" />
                    <Skeleton className="h-16 rounded-[20px]" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-7 w-24 rounded-full" />
                        <Skeleton className="h-7 w-24 rounded-full" />
                    </div>
                </CardBody>
            </Card>
        </>
    );
}

function toTimeString(value: { hour: number; minute: number }) {
    return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;
}

function toHeroTimeValue(value: string): TimeInputValue {
    const [hour, minute] = value.split(':').map(Number);

    return {
        hour: hour || 0,
        minute: minute || 0,
        second: 0,
    } as unknown as TimeInputValue;
}

export function ParentMomentsScreen() {
    const params = useParams<{ locale: string }>();
    const router = useRouter();
    const lockedChildId = useAppState((state) => state.lockedChildId);
    const startMomentFlow = useAppState((state) => state.startMomentFlow);

    const {
        activeChild,
        activitiesQuery,
        calendarEventsQuery,
        childItems,
        currentActivity,
        familyId,
        familySummary,
        hasNoChildren,
        isChildSelectorLoading,
        isPlannerLoading,
        momentsError,
        parent,
        scheduledEvent,
        selectedChildId,
        selectChild,
    } = useParentMomentsData();

    const [isSwitching, setIsSwitching] = useState(false);
    const [isSavingSchedule, setIsSavingSchedule] = useState(false);
    const [scheduleMessage, setScheduleMessage] = useState<string | null>(null);
    const [scheduleError, setScheduleError] = useState<string | null>(null);
    const [startTime, setStartTime] = useState(DEFAULT_MOMENT_START_TIME);
    const [endTime, setEndTime] = useState(DEFAULT_MOMENT_END_TIME);
    const switchTimeoutRef = useRef<number | null>(null);

    useMomentNotifications({
        activities: activitiesQuery.activities,
        autoMarkSeen: true,
        familyId,
    });

    useEffect(() => {
        return () => {
            if (switchTimeoutRef.current) {
                window.clearTimeout(switchTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        setStartTime(toTimeInputValue(scheduledEvent?.startTime) || DEFAULT_MOMENT_START_TIME);
        setEndTime(toTimeInputValue(scheduledEvent?.endTime) || DEFAULT_MOMENT_END_TIME);
        setScheduleError(null);
        setScheduleMessage(null);
    }, [currentActivity?.id, scheduledEvent?.endTime, scheduledEvent?.startTime]);

    const navItems = [
        {
            key: 'home',
            label: 'Home',
            icon: <HomeIcon className="size-4" />,
            active: false,
            onPress: () => router.push(buildLocalizedHref(params.locale, '/parent')),
        },
        {
            key: 'adventures',
            label: 'Adventures',
            icon: <CompassIcon className="size-4" />,
            active: false,
            onPress: () => router.push(buildLocalizedHref(params.locale, '/parent?tab=adventures')),
        },
        {
            key: 'dreams',
            label: 'Dreams',
            icon: <TargetIcon className="size-4" />,
            active: false,
            onPress: () => router.push(buildLocalizedHref(params.locale, '/parent?tab=dreams')),
        },
        {
            key: 'moments',
            label: 'Moments',
            icon: <CalendarIcon className="size-4" />,
            active: true,
            onPress: () => router.push(buildLocalizedHref(params.locale, '/parent/moments')),
        },
    ];

    const handleChildSelect = (childId: string) => {
        if (childId === selectedChildId) {
            return;
        }

        setIsSwitching(true);
        setScheduleMessage(null);
        setScheduleError(null);
        selectChild(childId);

        if (switchTimeoutRef.current) {
            window.clearTimeout(switchTimeoutRef.current);
        }

        switchTimeoutRef.current = window.setTimeout(() => {
            setIsSwitching(false);
        }, 180);
    };

    const handleSaveSchedule = async () => {
        if (!activeChild || !currentActivity || !familyId || !parent) {
            setScheduleError('The family activity could not be prepared just yet.');
            return;
        }

        setIsSavingSchedule(true);
        setScheduleError(null);
        setScheduleMessage(null);

        try {
            const startIso = toIsoFromTime(startTime);
            const endIso = toIsoFromTime(endTime);

            if (new Date(endIso).getTime() <= new Date(startIso).getTime()) {
                throw new Error('Please choose an end time that comes after the start time.');
            }

            await activitiesQuery.updateActivity(currentActivity.id, {
                locationName: 'Home',
                mapsLink: null,
            });

            const savedEvent = scheduledEvent
                ? await calendarEventsQuery.updateCalendarEvent(scheduledEvent.id, {
                    endTime: endIso,
                    startTime: startIso,
                    title: currentActivity.activity,
                })
                : await calendarEventsQuery.createCalendarEvent({
                    endTime: endIso,
                    familyId,
                    parentId: parent.id,
                    startTime: startIso,
                    title: currentActivity.activity,
                });

            if (!savedEvent) {
                throw new Error('The family activity schedule could not be saved.');
            }

            setScheduleMessage(
                `${activeChild.name}'s activity is set for ${formatTimeWindow(savedEvent.startTime, savedEvent.endTime)} at Home.`,
            );
        } catch (error) {
            setScheduleError(
                error instanceof Error
                    ? error.message
                    : 'The family activity schedule could not be saved just yet.',
            );
        } finally {
            setIsSavingSchedule(false);
        }
    };

    const openStartStep = () => {
        if (!activeChild || !currentActivity) {
            return;
        }

        startMomentFlow(activeChild.id);
        router.push(
            buildMomentFlowHref(
                params.locale,
                '/parent/moments/proximity',
                currentActivity.id,
                scheduledEvent?.id,
            ),
        );
    };

    if (hasNoChildren) {
        return (
            <AppShell
                childItems={[]}
                description="The planner becomes useful once a child profile is available."
                familySeeds={familySummary}
                navItems={navItems}
                onSelectChild={handleChildSelect}
                selectedChildId=""
                title="Moments Planner"
            >
                <ParentStateCard
                    kicker="Setup"
                    title="No children available yet"
                    description="Add a child profile first so family activities can be requested and scheduled."
                    actionLabel="Back To Home"
                    onAction={() => router.push(buildLocalizedHref(params.locale, '/parent'))}
                />
            </AppShell>
        );
    }

    if (!activeChild && isChildSelectorLoading) {
        return (
            <AppShell
                childItems={[]}
                description="The family planner is loading now."
                familySeeds={familySummary}
                isChildSelectorLoading
                navItems={navItems}
                onSelectChild={handleChildSelect}
                selectedChildId=""
                title="Moments Planner"
            >
                <PlannerLoadingState />
            </AppShell>
        );
    }

    if (!activeChild) {
        return (
            <AppShell
                childItems={childItems}
                description="The planner is waiting for a child profile selection."
                familySeeds={familySummary}
                isChildSelectorLoading={isChildSelectorLoading}
                navItems={navItems}
                onSelectChild={handleChildSelect}
                selectedChildId={selectedChildId}
                title="Moments Planner"
            >
                <ParentStateCard
                    kicker="Planner"
                    title="No child is selected"
                    description="Choose a child to review family activity requests and set the evening plan."
                />
            </AppShell>
        );
    }

    const locationLabel = getActivityLocationLabel(currentActivity?.locationName);
    const timeWindowLabel = formatTimeWindow(scheduledEvent?.startTime, scheduledEvent?.endTime);
    const draftTimeWindowLabel = formatTimeWindow(toIsoFromTime(startTime), toIsoFromTime(endTime));

    return (
        <AppShell
            childItems={childItems}
            childSelectorDisabled={Boolean(lockedChildId)}
            description={`Review ${activeChild.name}'s family activity request, set the time, then start the shared moment.`}
            familySeeds={familySummary}
            isChildSelectorLoading={isChildSelectorLoading}
            isSwitching={isSwitching}
            navItems={navItems}
            notice={momentsError ? (
                <Card shadow="none" className="rounded-[22px] border border-[rgba(180,106,90,0.12)] bg-[rgba(251,248,241,0.92)]">
                    <CardBody className="p-4 text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                        {momentsError}
                    </CardBody>
                </Card>
            ) : null}
            onSelectChild={handleChildSelect}
            selectedChildId={selectedChildId}
            title="Moments Planner"
        >
            <Card shadow="none" className="hearth-panel rounded-[24px]">
                <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                    <div className="grid gap-2">
                        <p className="hearth-kicker">Moments Flow</p>
                        <h2 className="hearth-heading text-[1.45rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.6rem]">
                            Child request, schedule, start, then complete together
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Chip radius="full" variant="flat" className="border border-[rgba(230,199,102,0.24)] bg-[rgba(230,199,102,0.18)] text-[var(--hearth-text-primary)]">
                            <span className="px-1 text-[10px] font-semibold sm:text-[11px]">1. Child Request</span>
                        </Chip>
                        <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]">
                            <span className="px-1 text-[10px] font-semibold sm:text-[11px]">2. Schedule</span>
                        </Chip>
                        <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]">
                            <span className="px-1 text-[10px] font-semibold sm:text-[11px]">3. Start</span>
                        </Chip>
                        <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]">
                            <span className="px-1 text-[10px] font-semibold sm:text-[11px]">4. Complete</span>
                        </Chip>
                    </div>
                </CardBody>
            </Card>

            {isPlannerLoading && !currentActivity ? <PlannerLoadingState /> : null}

            {!isPlannerLoading && !currentActivity ? (
                <ParentStateCard
                    kicker="Waiting"
                    title="No child request has come through yet"
                    description={`${activeChild.name}'s family activity request will appear here after a child chooses one shared activity.`}
                />
            ) : null}

            {currentActivity ? (
                <>
                    <Card shadow="none" className="hearth-panel rounded-[26px]">
                        <CardBody className="grid gap-4 p-4 sm:gap-5 sm:p-5">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="grid min-w-0 flex-1 gap-2">
                                    <p className="hearth-kicker">Child Request</p>
                                    <h3 className="hearth-heading text-[1.35rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.5rem]">
                                        {currentActivity.activity}
                                    </h3>
                                    <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                                        {getActivitySupportCopy(activeChild.name, currentActivity.activity)}
                                    </p>
                                </div>
                                <div className="shrink-0 whitespace-nowrap rounded-full border border-[rgba(230,199,102,0.28)] bg-[rgba(230,199,102,0.18)] px-2.5 py-1 sm:px-3">
                                    <span className="hearth-number text-[13px] font-semibold text-[var(--hearth-text-primary)] sm:text-sm">
                                        +{FAMILY_MOMENT_REWARD_SEEDS} Seeds
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.26)] text-[var(--hearth-text-secondary)]">
                                    <span className="px-1 text-[10px] font-semibold sm:text-[11px]">
                                        {FAMILY_MOMENT_DURATION_MINUTES} minutes
                                    </span>
                                </Chip>
                                <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.26)] text-[var(--hearth-text-secondary)]">
                                    <span className="px-1 text-[10px] font-semibold sm:text-[11px]">
                                        Location: {locationLabel}
                                    </span>
                                </Chip>
                                {timeWindowLabel ? (
                                    <Chip radius="full" variant="flat" className="border border-[rgba(230,199,102,0.24)] bg-[rgba(230,199,102,0.18)] text-[var(--hearth-text-primary)]">
                                        <span className="px-1 text-[10px] font-semibold sm:text-[11px]">
                                            {timeWindowLabel}
                                        </span>
                                    </Chip>
                                ) : null}
                            </div>

                            {scheduledEvent ? (
                                <div className="flex flex-wrap gap-3">
                                    <HearthActionButton onPress={openStartStep}>
                                        Start Activity
                                    </HearthActionButton>
                                    <HearthActionButton tone="secondary" onPress={handleSaveSchedule}>
                                        Update Schedule
                                    </HearthActionButton>
                                </div>
                            ) : null}
                        </CardBody>
                    </Card>

                    <Card shadow="none" className="hearth-panel rounded-[26px]">
                        <CardBody className="grid gap-4 p-4 sm:gap-5 sm:p-5">
                            <div className="grid gap-2">
                                <p className="hearth-kicker">Schedule</p>
                                <h3 className="hearth-heading text-[1.25rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.35rem]">
                                    Set the family time window
                                </h3>
                                <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                                    This activity happens at home, so the plan only needs a clear time window and a calm start.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <TimeInput
                                    granularity="minute"
                                    hourCycle={12}
                                    label="Start"
                                    labelPlacement="outside"
                                    value={toHeroTimeValue(startTime)}
                                    onChange={(value) => value && setStartTime(toTimeString(value))}
                                    radius="lg"
                                    classNames={{
                                        base: 'w-full',
                                        inputWrapper: 'border border-[color:var(--hearth-border-soft)] bg-[var(--hearth-bg-surface)] shadow-none',
                                        label: 'text-sm font-medium text-[var(--hearth-text-secondary)]',
                                        segment: 'text-[var(--hearth-text-primary)] data-[placeholder=true]:text-[var(--hearth-text-muted)]',
                                    }}
                                />
                                <TimeInput
                                    granularity="minute"
                                    hourCycle={12}
                                    label="End"
                                    labelPlacement="outside"
                                    value={toHeroTimeValue(endTime)}
                                    onChange={(value) => value && setEndTime(toTimeString(value))}
                                    radius="lg"
                                    classNames={{
                                        base: 'w-full',
                                        inputWrapper: 'border border-[color:var(--hearth-border-soft)] bg-[var(--hearth-bg-surface)] shadow-none',
                                        label: 'text-sm font-medium text-[var(--hearth-text-secondary)]',
                                        segment: 'text-[var(--hearth-text-primary)] data-[placeholder=true]:text-[var(--hearth-text-muted)]',
                                    }}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]">
                                    <span className="px-1 text-[10px] font-semibold sm:text-[11px]">Location: Home</span>
                                </Chip>
                                <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]">
                                    <span className="px-1 text-[10px] font-semibold sm:text-[11px]">
                                        Window: {draftTimeWindowLabel ?? `${startTime} - ${endTime}`}
                                    </span>
                                </Chip>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <HearthActionButton isLoading={isSavingSchedule} onPress={handleSaveSchedule}>
                                    {scheduledEvent ? 'Save Updated Window' : 'Save Time Window'}
                                </HearthActionButton>
                                {scheduledEvent ? (
                                    <HearthActionButton tone="secondary" onPress={openStartStep}>
                                        Continue To Start
                                    </HearthActionButton>
                                ) : null}
                            </div>
                        </CardBody>
                    </Card>
                </>
            ) : null}

            {scheduleError ? (
                <ParentStateCard
                    kicker="Schedule Issue"
                    title="The activity could not be scheduled just yet"
                    description={scheduleError}
                />
            ) : null}

            {scheduleMessage ? (
                <ParentStateCard
                    kicker="Schedule Saved"
                    title="The family activity is ready"
                    description={scheduleMessage}
                    actionLabel="Start Activity"
                    onAction={scheduledEvent ? openStartStep : undefined}
                />
            ) : null}

            <MascotBubble
                actionLabel="Back To Home"
                message={
                    currentActivity
                        ? 'A child request is ready. Set the time window first, then let the activity begin without extra steps.'
                        : 'The next shared activity will appear here after a child chooses one family moment.'
                }
                onAction={() => router.push(buildLocalizedHref(params.locale, '/parent'))}
                title="Lena Says"
            />
        </AppShell>
    );
}
