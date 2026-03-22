'use client';

import { Card, CardBody, Chip } from '@heroui/react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
import { buildLocalizedHref } from '@/lib/locale-path';
import {
    FAMILY_MOMENT_DURATION_MINUTES,
    formatTimeWindow,
    getActivityLocationLabel,
} from '@/lib/parent-moments';
import { useAppState } from '@/state/appState';
import { ParentStateCard } from './ParentStateCard';

function buildTimerHref(locale: string, activityId: string, eventId?: string | null) {
    const searchParams = new URLSearchParams({ activityId });

    if (eventId) {
        searchParams.set('eventId', eventId);
    }

    return buildLocalizedHref(locale, `/parent/moments/timer?${searchParams.toString()}`);
}

export function ParentProximityScreen() {
    const params = useParams<{ locale: string }>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activityId = searchParams.get('activityId');
    const eventId = searchParams.get('eventId');

    const activeMomentChildId = useAppState((state) => state.activeMomentChildId);
    const cancelMomentFlow = useAppState((state) => state.cancelMomentFlow);

    const {
        activeChild,
        childItems,
        currentActivity,
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

    const backToPlanner = () => {
        cancelMomentFlow();
        router.push(buildLocalizedHref(params.locale, '/parent/moments'));
    };

    const startTimer = () => {
        if (!currentActivity) {
            return;
        }

        router.push(buildTimerHref(params.locale, currentActivity.id, scheduledEvent?.id));
    };

    if (hasNoChildren) {
        return (
            <AppShell
                childItems={[]}
                childSelectorDisabled
                description="A family profile is needed before the shared activity flow can begin."
                familySeeds={familySummary}
                navItems={navItems}
                onSelectChild={() => undefined}
                selectedChildId=""
                title="Start Activity"
            >
                <ParentStateCard
                    kicker="Setup"
                    title="No child is available"
                    description="Add a child profile first, then return to the moments planner."
                    actionLabel="Back To Planner"
                    onAction={backToPlanner}
                />
            </AppShell>
        );
    }

    if (!activityId) {
        return (
            <AppShell
                childItems={childItems}
                childSelectorDisabled
                description="An activity needs to be chosen before the start step can open."
                familySeeds={familySummary}
                isChildSelectorLoading={isChildSelectorLoading}
                navItems={navItems}
                onSelectChild={() => undefined}
                selectedChildId={selectedChildId}
                title="Start Activity"
            >
                <ParentStateCard
                    kicker="Flow"
                    title="No activity was selected"
                    description="Return to the planner, review the child request, and start the activity from there."
                    actionLabel="Back To Planner"
                    onAction={backToPlanner}
                />
            </AppShell>
        );
    }

    if (!activeChild || !currentActivity) {
        return (
            <AppShell
                childItems={childItems}
                childSelectorDisabled
                description="The activity request is being checked now."
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
                title="Start Activity"
            >
                <ParentStateCard
                    kicker="Waiting"
                    title="This activity is not ready to start"
                    description="Return to the planner and make sure the child request is still available."
                    actionLabel="Back To Planner"
                    onAction={backToPlanner}
                />
            </AppShell>
        );
    }

    if (!scheduledEvent) {
        return (
            <AppShell
                childItems={childItems}
                childSelectorDisabled
                description={`Set ${activeChild.name}'s time window before the shared activity begins.`}
                familySeeds={familySummary}
                isChildSelectorLoading={isChildSelectorLoading}
                navItems={navItems}
                onSelectChild={() => undefined}
                selectedChildId={activeChild.id}
                title="Start Activity"
            >
                <ParentStateCard
                    kicker="Schedule Required"
                    title="The activity still needs a time window"
                    description="Save the family schedule from the planner first, then start the activity."
                    actionLabel="Back To Planner"
                    onAction={backToPlanner}
                />
            </AppShell>
        );
    }

    const timeWindowLabel = formatTimeWindow(scheduledEvent.startTime, scheduledEvent.endTime);
    const locationLabel = getActivityLocationLabel(currentActivity.locationName);

    return (
        <AppShell
            childItems={childItems}
            childSelectorDisabled
            description={`Everything for ${activeChild.name}'s shared activity is set. Start when the room feels settled.`}
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
            title="Start Activity"
        >
            <Card shadow="none" className="hearth-ledger-card rounded-[28px]">
                <CardBody className="grid gap-5 p-5 sm:gap-6 sm:p-6">
                    <div className="grid gap-2 text-center">
                        <p className="hearth-kicker">Ready Check</p>
                        <h2 className="hearth-heading text-[1.5rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.7rem]">
                            {currentActivity.activity}
                        </h2>
                        <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                            The family plan is set at home. When everyone is together and ready, start the 20-minute timer.
                        </p>
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

                    <div className="flex flex-wrap justify-center gap-3">
                        <HearthActionButton onPress={startTimer}>
                            Start 20-Minute Timer
                        </HearthActionButton>
                        <HearthActionButton tone="secondary" onPress={backToPlanner}>
                            Back To Planner
                        </HearthActionButton>
                    </div>
                </CardBody>
            </Card>

            <MascotBubble
                actionLabel="Return To Planner"
                message="The home setting is already enough here. Start when everyone is gathered and let the timer do the rest."
                onAction={backToPlanner}
                title="Lena Says"
            />
        </AppShell>
    );
}
