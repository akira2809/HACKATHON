'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardBody, Chip } from '@heroui/react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { MascotBubble } from '@/components/MascotBubble';
import { ProgressBar } from '@/components/ProgressBar';
import { HearthActionButton } from '@/components/design-system/HearthPrimitives';
import { CalendarIcon, CompassIcon, HomeIcon, TargetIcon } from '@/components/design-system/HearthPrimitives';
import { buildLocalizedHref } from '@/lib/locale-path';
import { useAppState } from '@/state/appState';
import { ParentStateCard } from './ParentStateCard';

const PROXIMITY_THRESHOLD = 35;

type ProximityPanelProps = {
    childName: string;
    initialDistance: number;
    momentTitle: string;
    onCancel: () => void;
    onOpenTimer: () => void;
};

function ProximityPanel({
    childName,
    initialDistance,
    momentTitle,
    onCancel,
    onOpenTimer,
}: ProximityPanelProps) {
    const [distance, setDistance] = useState(initialDistance);
    const [isChecking, setIsChecking] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const checkTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (checkTimeoutRef.current) {
                window.clearTimeout(checkTimeoutRef.current);
            }
        };
    }, []);

    const handleCheckAgain = () => {
        setIsChecking(true);
        setStatusMessage(null);

        if (checkTimeoutRef.current) {
            window.clearTimeout(checkTimeoutRef.current);
        }

        checkTimeoutRef.current = window.setTimeout(() => {
            setDistance((currentDistance) => {
                const nextDistance = Math.max(
                    12,
                    currentDistance - (currentDistance > 70 ? 24 : currentDistance > 45 ? 14 : 8),
                );

                if (nextDistance <= PROXIMITY_THRESHOLD) {
                    setStatusMessage('You are close enough now. The timer can begin when the room feels settled.');
                } else if (nextDistance > 70) {
                    setStatusMessage('Lena could not confirm closeness yet. Move in gently and try another quiet check.');
                } else {
                    setStatusMessage('A little closer and the moment will be ready to begin.');
                }

                return nextDistance;
            });

            setIsChecking(false);
        }, 720);
    };

    const closenessScore = Math.max(0, 100 - distance);
    const isReady = distance <= PROXIMITY_THRESHOLD;

    return (
        <>
            <Card shadow="none" className="hearth-ledger-card rounded-[28px]">
                <CardBody className="grid gap-5 p-6 text-center">
                    <div className="grid gap-2 justify-items-center">
                        <p className="hearth-kicker">Shared Readiness</p>
                        <h2 className="hearth-heading text-[1.7rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)]">
                            Move close enough to begin together
                        </h2>
                        <p className="max-w-[280px] text-sm leading-6 text-[var(--hearth-text-secondary)]">
                            {momentTitle} will unlock once the homestead can confirm a gentle shared space.
                        </p>
                    </div>

                    <div className="grid justify-items-center gap-2">
                        <div className="rounded-full border border-[rgba(230,199,102,0.28)] bg-[rgba(230,199,102,0.18)] px-6 py-4">
                            <span className="hearth-number text-4xl font-semibold text-[var(--hearth-text-primary)]">
                                {closenessScore}%
                            </span>
                        </div>
                        <p className="text-sm text-[var(--hearth-text-secondary)]">
                            closeness score for {childName}
                        </p>
                    </div>

                    <ProgressBar
                        label="Quiet readiness"
                        maxValue={100}
                        milestone={65}
                        value={closenessScore}
                        valueLabel={`${closenessScore}% aligned`}
                    />

                    <div className="flex flex-wrap justify-center gap-2">
                        <Chip radius="full" variant="flat" className="border border-[rgba(230,199,102,0.24)] bg-[rgba(230,199,102,0.18)] text-[var(--hearth-text-primary)]">
                            <span className="px-1 text-[11px] font-semibold">2. Proximity</span>
                        </Chip>
                        <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]">
                            <span className="px-1 text-[11px] font-semibold">3. Timer Next</span>
                        </Chip>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {isReady ? (
                            <HearthActionButton onPress={onOpenTimer}>
                                Continue To Timer
                            </HearthActionButton>
                        ) : (
                            <HearthActionButton isLoading={isChecking} onPress={handleCheckAgain}>
                                Check Again
                            </HearthActionButton>
                        )}
                        <HearthActionButton tone="secondary" onPress={onCancel}>
                            Back To Planner
                        </HearthActionButton>
                    </div>
                </CardBody>
            </Card>

            {statusMessage ? (
                <ParentStateCard
                    title={isReady ? 'Proximity confirmed' : 'Still gathering proximity'}
                    description={statusMessage}
                    actionLabel={isReady ? 'Open Timer' : 'Try Another Check'}
                    onAction={isReady ? onOpenTimer : handleCheckAgain}
                />
            ) : null}

            <MascotBubble
                actionLabel="End Moment"
                message={
                    isReady
                        ? 'The room is settled enough now. Start the timer and keep the rest of the screen quiet.'
                        : 'Keep moving in slowly. The moment should begin only when everyone feels close and ready.'
                }
                onAction={onCancel}
                title="Lena Guides"
            />
        </>
    );
}

export function ParentProximityScreen() {
    const params = useParams<{ locale: string }>();
    const router = useRouter();

    const familySeeds = useAppState((state) => state.familySeeds);
    const children = useAppState((state) => state.children);
    const selectedChildId = useAppState((state) => state.selectedChildId);
    const activeMomentChildId = useAppState((state) => state.activeMomentChildId);
    const lockedChildId = useAppState((state) => state.lockedChildId);
    const startMomentFlow = useAppState((state) => state.startMomentFlow);
    const cancelMomentFlow = useAppState((state) => state.cancelMomentFlow);

    const activeChildId = activeMomentChildId ?? selectedChildId;
    const activeChild = children.find((child) => child.id === activeChildId) ?? children[0];

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
                description="A calm proximity check starts once a family profile exists."
                familySeeds={familySeeds}
                navItems={navItems}
                onSelectChild={() => undefined}
                selectedChildId=""
                title="Proximity Check"
            >
                <ParentStateCard
                    title="No child is available"
                    description="Add a child profile first, then begin the moments flow from the planner."
                    actionLabel="Back To Planner"
                    onAction={() => goTo('/parent/moments')}
                />
            </AppShell>
        );
    }

    if (!activeChild || !activeChild.moment) {
        return (
            <AppShell
                childItems={children}
                childSelectorDisabled
                description="A moment needs to be planned before the proximity step can begin."
                familySeeds={familySeeds}
                navItems={navItems}
                onSelectChild={() => undefined}
                selectedChildId={selectedChildId}
                title="Proximity Check"
            >
                <ParentStateCard
                    title="No active moment to check"
                    description="Return to the planner, choose a shared activity, then begin the guided flow again."
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
            description={`Stay with ${activeChild.name} for a quiet proximity check before the timer begins.`}
            familySeeds={familySeeds}
            navItems={navItems}
            onSelectChild={() => undefined}
            selectedChildId={activeChild.id}
            title="Proximity Check"
        >
            <ProximityPanel
                key={`${activeChild.id}-${activeChild.proximityDistance}`}
                childName={activeChild.name}
                initialDistance={activeChild.proximityDistance}
                momentTitle={activeChild.moment.title}
                onCancel={handleCancel}
                onOpenTimer={() => goTo('/parent/moments/timer')}
            />
        </AppShell>
    );
}
