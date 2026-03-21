'use client';

import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { Card, CardBody, Chip } from '@heroui/react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { MascotBubble } from '@/components/MascotBubble';
import { ProgressBar } from '@/components/ProgressBar';
import { HearthActionButton } from '@/components/design-system/HearthPrimitives';
import { CalendarIcon, CompassIcon, HomeIcon, TargetIcon } from '@/components/design-system/HearthPrimitives';
import { buildLocalizedHref } from '@/lib/locale-path';
import { useAppState, type ParentMoment } from '@/state/appState';
import { ParentStateCard } from './ParentStateCard';

function parseMinutes(duration: string) {
    const match = duration.match(/\d+/);
    const minutes = match ? Number(match[0]) : 15;

    return Math.max(1, minutes);
}

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

type TimerSessionProps = {
    childName: string;
    childSeeds: number;
    childAiTokens: number;
    moment: ParentMoment;
    onCancel: () => void;
    onReturn: () => void;
    onCompleteMoment: () => void;
};

function TimerSession({
    childName,
    childSeeds,
    childAiTokens,
    moment,
    onCancel,
    onReturn,
    onCompleteMoment,
}: TimerSessionProps) {
    const totalSeconds = useMemo(() => parseMinutes(moment.duration) * 60, [moment.duration]);
    const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
    const [isRunning, setIsRunning] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const completionRef = useRef(false);

    const finishSession = () => {
        if (completionRef.current) {
            return;
        }

        completionRef.current = true;
        setIsRunning(false);
        setIsComplete(true);
        onCompleteMoment();
    };

    const completeSessionFromEffect = useEffectEvent(() => {
        finishSession();
    });

    useEffect(() => {
        if (!isRunning || isComplete) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setSecondsLeft((currentSeconds) => {
                if (currentSeconds <= 1) {
                    window.clearInterval(intervalId);
                    window.setTimeout(() => {
                        completeSessionFromEffect();
                    }, 0);

                    return 0;
                }

                return currentSeconds - 1;
            });
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [isRunning, isComplete]);

    const elapsedSeconds = Math.max(0, totalSeconds - secondsLeft);

    return (
        <>
            <Card shadow="none" className="hearth-ledger-card rounded-[30px]">
                <CardBody className="grid gap-6 p-6 text-center">
                    <div className="grid gap-2 justify-items-center">
                        <p className="hearth-kicker">Timer In Progress</p>
                        <h2 className="hearth-heading text-[1.8rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)]">
                            {moment.title}
                        </h2>
                        <p className="max-w-[280px] text-sm leading-6 text-[var(--hearth-text-secondary)]">
                            {moment.description}
                        </p>
                    </div>

                    <div className="grid justify-items-center gap-3">
                        <div className="rounded-[28px] border border-[rgba(79,107,82,0.1)] bg-[rgba(251,248,241,0.9)] px-8 py-6">
                            <span className="hearth-number text-5xl font-semibold tracking-[-0.04em] text-[var(--hearth-text-primary)]">
                                {formatTime(secondsLeft)}
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            <Chip radius="full" variant="flat" className="border border-[rgba(230,199,102,0.24)] bg-[rgba(230,199,102,0.18)] text-[var(--hearth-text-primary)]">
                                <span className="px-1 text-[11px] font-semibold">{moment.duration}</span>
                            </Chip>
                            <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]">
                                <span className="px-1 text-[11px] font-semibold">+{moment.rewardSeeds} Seeds</span>
                            </Chip>
                        </div>
                    </div>

                    <ProgressBar
                        label="Moment progress"
                        maxValue={totalSeconds}
                        milestone={Math.floor(totalSeconds * 0.5)}
                        value={elapsedSeconds}
                        valueLabel={`${formatTime(elapsedSeconds)} elapsed`}
                    />

                    <div className="flex flex-wrap justify-center gap-3">
                        <HearthActionButton onPress={() => setIsRunning((currentValue) => !currentValue)}>
                            {isRunning ? 'Pause Timer' : 'Resume Timer'}
                        </HearthActionButton>
                        <HearthActionButton tone="secondary" onPress={finishSession}>
                            Complete Moment
                        </HearthActionButton>
                        <HearthActionButton tone="ghost" onPress={onCancel}>
                            End Gently
                        </HearthActionButton>
                    </div>
                </CardBody>
            </Card>

            <Card shadow="none" className="hearth-panel rounded-[24px]">
                <CardBody className="grid gap-4 p-5">
                    <div className="grid gap-2">
                        <p className="hearth-kicker">Keep It Minimal</p>
                        <h3 className="hearth-heading text-[1.35rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)]">
                            Let the activity carry the attention now
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {moment.supplies.map((supply) => (
                            <Chip
                                key={supply}
                                radius="full"
                                variant="flat"
                                className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]"
                            >
                                <span className="px-1 text-[11px] font-semibold">{supply}</span>
                            </Chip>
                        ))}
                    </div>
                    <p className="text-sm leading-6 text-[var(--hearth-text-secondary)]">
                        Keep one clear action on the screen and let the timer quietly mark the shared time.
                    </p>
                </CardBody>
            </Card>

            {isComplete ? (
                <div className="fixed inset-0 z-40 bg-[rgba(47,52,44,0.18)] px-4 py-8 backdrop-blur-[2px]">
                    <div className="mx-auto grid min-h-full max-w-[460px] content-center">
                        <Card shadow="none" className="hearth-ledger-card rounded-[30px]">
                            <CardBody className="grid gap-5 p-6">
                                <div className="grid gap-2">
                                    <p className="hearth-kicker">Completion</p>
                                    <h2 className="hearth-heading text-[1.8rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)]">
                                        {moment.title} is complete
                                    </h2>
                                    <p className="text-sm leading-6 text-[var(--hearth-text-secondary)]">
                                        The reward summary is ready, and the child context is unlocked again for the next gentle step.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="hearth-subtle-panel rounded-[22px] p-4">
                                        <p className="hearth-kicker">Reward</p>
                                        <p className="hearth-number mt-2 text-lg font-semibold text-[var(--hearth-text-primary)]">
                                            +{moment.rewardSeeds} Seeds
                                        </p>
                                    </div>
                                    <div className="hearth-subtle-panel rounded-[22px] p-4">
                                        <p className="hearth-kicker">AI Tokens</p>
                                        <p className="hearth-number mt-2 text-lg font-semibold text-[var(--hearth-text-primary)]">
                                            +{moment.rewardTokens} Tokens
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-[22px] border border-[rgba(79,107,82,0.08)] bg-[rgba(251,248,241,0.84)] p-4">
                                    <p className="text-sm leading-6 text-[var(--hearth-text-secondary)]">
                                        {childName} now has {childSeeds} seeds and {childAiTokens} AI tokens saved on the family board.
                                    </p>
                                </div>

                                <MascotBubble
                                    actionLabel="Return To Planner"
                                    message="Quiet shared moments often leave the longest warmth. Let the next step stay this gentle too."
                                    onAction={onReturn}
                                    title="Lena Notes"
                                />
                            </CardBody>
                        </Card>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export function ParentTimerScreen() {
    const params = useParams<{ locale: string }>();
    const router = useRouter();

    const familySeeds = useAppState((state) => state.familySeeds);
    const children = useAppState((state) => state.children);
    const selectedChildId = useAppState((state) => state.selectedChildId);
    const activeMomentChildId = useAppState((state) => state.activeMomentChildId);
    const lockedChildId = useAppState((state) => state.lockedChildId);
    const startMomentFlow = useAppState((state) => state.startMomentFlow);
    const cancelMomentFlow = useAppState((state) => state.cancelMomentFlow);
    const completeMomentFlow = useAppState((state) => state.completeMomentFlow);

    const activeChildId = activeMomentChildId ?? selectedChildId;
    const activeChild = children.find((child) => child.id === activeChildId) ?? children[0];
    const moment = activeChild?.moment ?? null;

    useEffect(() => {
        if (activeChild?.moment && !lockedChildId) {
            startMomentFlow(activeChild.id);
        }
    }, [activeChild, lockedChildId, startMomentFlow]);

    const goTo = (pathname: string) => {
        router.push(buildLocalizedHref(params.locale, pathname));
    };

    const handleCancel = () => {
        cancelMomentFlow();
        goTo('/parent/moments');
    };

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

    if (!children.length) {
        return (
            <AppShell
                childItems={[]}
                childSelectorDisabled
                description="The timer becomes available after a child profile and a shared moment are ready."
                familySeeds={familySeeds}
                navItems={navItems}
                onSelectChild={() => undefined}
                selectedChildId=""
                title="Moment Timer"
            >
                <ParentStateCard
                    title="No child is available"
                    description="Add a child profile first, then return to the planner to begin a shared moment."
                    actionLabel="Back To Planner"
                    onAction={() => goTo('/parent/moments')}
                />
            </AppShell>
        );
    }

    if (!activeChild || !moment) {
        return (
            <AppShell
                childItems={children}
                childSelectorDisabled
                description="A planned activity is needed before the timer can run."
                familySeeds={familySeeds}
                navItems={navItems}
                onSelectChild={() => undefined}
                selectedChildId={selectedChildId}
                title="Moment Timer"
            >
                <ParentStateCard
                    title="No active timer is ready"
                    description="Return to the moments planner, choose a shared activity, and start the flow again."
                    actionLabel="Back To Planner"
                    onAction={() => goTo('/parent/moments')}
                />
            </AppShell>
        );
    }

    return (
        <AppShell
            childItems={children}
            childSelectorDisabled
            description={`Stay present with ${activeChild.name}. The rest of the interface should fade into the background now.`}
            familySeeds={familySeeds}
            navItems={navItems}
            onSelectChild={() => undefined}
            selectedChildId={activeChild.id}
            title="Moment Timer"
        >
            <TimerSession
                key={`${activeChild.id}-${moment.duration}`}
                childAiTokens={activeChild.aiTokens}
                childName={activeChild.name}
                childSeeds={activeChild.seeds}
                moment={moment}
                onCancel={handleCancel}
                onCompleteMoment={completeMomentFlow}
                onReturn={() => goTo('/parent/moments')}
            />
        </AppShell>
    );
}
