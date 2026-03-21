'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardBody, Chip } from '@heroui/react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/parent/AppShell';
import { MomentCard } from '@/components/parent/MomentCard';
import { MascotBubble } from '@/components/parent/MascotBubble';
import { CalendarIcon, CompassIcon, HomeIcon, TargetIcon } from '@/components/design-system/HearthPrimitives';
import { buildLocalizedHref } from '@/lib/locale-path';
import { useAppState } from '@/state/appState';
import { ParentStateCard } from './ParentStateCard';
import { useParentSupabaseFamily } from '@/hooks/use-parent-supabase-family';

export function ParentMomentsScreen() {
    const params = useParams<{ locale: string }>();
    const router = useRouter();

    const familySeeds = useAppState((state) => state.familySeeds);
    const children = useAppState((state) => state.children);
    const selectedChildId = useAppState((state) => state.selectedChildId);
    const lockedChildId = useAppState((state) => state.lockedChildId);
    const selectChild = useAppState((state) => state.selectChild);
    const startMomentFlow = useAppState((state) => state.startMomentFlow);
    const attachMomentId = useAppState((state) => state.attachMomentId);
    const setMomentForChild = useAppState((state) => state.setMomentForChild);
    const {
        ensureMomentActivity,
        error: supabaseError,
        generateMomentSuggestion,
        hasSupabase,
        isMutating: isSupabaseMutating,
        refetch,
    } = useParentSupabaseFamily();

    const [isSwitching, setIsSwitching] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [supportMessage, setSupportMessage] = useState<string | null>(null);
    const switchTimeoutRef = useRef<number | null>(null);
    const refreshTimeoutRef = useRef<number | null>(null);

    const activeChild = children.find((child) => child.id === selectedChildId) ?? children[0];

    useEffect(() => {
        return () => {
            if (switchTimeoutRef.current) {
                window.clearTimeout(switchTimeoutRef.current);
            }

            if (refreshTimeoutRef.current) {
                window.clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, []);

    const goTo = (pathname: string) => {
        router.push(buildLocalizedHref(params.locale, pathname));
    };

    const handleChildSelect = (childId: string) => {
        if (childId === selectedChildId) {
            return;
        }

        setIsSwitching(true);
        setSupportMessage(null);
        selectChild(childId);

        if (switchTimeoutRef.current) {
            window.clearTimeout(switchTimeoutRef.current);
        }

        switchTimeoutRef.current = window.setTimeout(() => {
            setIsSwitching(false);
        }, 180);
    };

    const handleRefreshMoment = () => {
        if (!activeChild) {
            return;
        }

        if (hasSupabase) {
            void (async () => {
                setIsRefreshing(true);
                setSupportMessage(null);
                const suggestion = await generateMomentSuggestion({
                    childId: activeChild.id,
                    childName: activeChild.name,
                    age: activeChild.age,
                });

                if (suggestion?.encouragement) {
                    setSupportMessage(suggestion.encouragement);
                } else {
                    const synced = await refetch();
                    if (!synced) {
                        setSupportMessage('Supabase could not refresh the current moments data right now.');
                    }
                }

                setIsRefreshing(false);
            })();
            return;
        }

        setIsRefreshing(true);
        setSupportMessage(null);

        if (refreshTimeoutRef.current) {
            window.clearTimeout(refreshTimeoutRef.current);
        }

        const activeChildId = activeChild.id;

        refreshTimeoutRef.current = window.setTimeout(() => {
            const currentChild = useAppState.getState().children.find((child) => child.id === activeChildId);

            if (!currentChild) {
                setSupportMessage('The planner is still gathering the family board.');
            } else if (currentChild.momentError) {
                setSupportMessage(currentChild.momentError);
            } else if (!currentChild.moment) {
                setSupportMessage(`A fresh shared activity for ${currentChild.name} is still being prepared.`);
            } else {
                setSupportMessage(`This still feels like the calmest shared activity for ${currentChild.name} today.`);
            }

            setIsRefreshing(false);
        }, 680);
    };

    const handleStartMoment = () => {
        if (!activeChild || !activeChild.moment) {
            return;
        }

        const moment = activeChild.moment;

        void (async () => {
            if (hasSupabase) {
                const syncResult = await ensureMomentActivity(activeChild.id, moment);

                if (!syncResult?.activityId) {
                    setSupportMessage('The shared activity could not be saved to Supabase yet.');
                    return;
                }

                attachMomentId(activeChild.id, syncResult.activityId);
                setMomentForChild(activeChild.id, {
                    ...moment,
                    id: syncResult.activityId,
                    calendarEventId: syncResult.calendarEventId ?? moment.calendarEventId,
                });
            }

            startMomentFlow(activeChild.id);
            goTo('/parent/moments/proximity');
        })();
    };

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
            onPress: () => goTo('/parent/moments'),
        },
    ];

    if (!children.length) {
        return (
            <AppShell
                childItems={[]}
                description="The moments planner will feel warm and focused once a child profile is added."
                familySeeds={familySeeds}
                navItems={navItems}
                onSelectChild={handleChildSelect}
                selectedChildId=""
                title="Moments Planner"
            >
                <ParentStateCard
                    title="No children available yet"
                    description="Add a child profile first so Lena can prepare shared family activities."
                    actionLabel="Back To Home"
                    onAction={() => router.push(buildLocalizedHref(params.locale, '/parent'))}
                />
            </AppShell>
        );
    }

    if (!activeChild) {
        return null;
    }

    return (
        <AppShell
            childItems={children}
            childSelectorDisabled={Boolean(lockedChildId)}
            description={`A single shared activity for ${activeChild.name}, with enough room to keep the day gentle.`}
            familySeeds={familySeeds}
            isSwitching={isSwitching}
            navItems={navItems}
            onSelectChild={handleChildSelect}
            selectedChildId={selectedChildId}
            title="Moments Planner"
            notice={activeChild.networkIssue || supabaseError ? (
                <Card shadow="none" className="rounded-[22px] border border-[rgba(180,106,90,0.12)] bg-[rgba(251,248,241,0.92)]">
                    <CardBody className="p-4 text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                        {activeChild.networkIssue ?? supabaseError}
                    </CardBody>
                </Card>
            ) : null}
        >
            <Card shadow="none" className="hearth-panel rounded-[24px]">
                <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                    <div className="grid gap-2">
                        <p className="hearth-kicker">Moments Flow</p>
                        <h2 className="hearth-heading text-[1.45rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.55rem]">
                            Planner, proximity, timer, then a quiet completion summary
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Chip radius="full" variant="flat" className="border border-[rgba(230,199,102,0.24)] bg-[rgba(230,199,102,0.18)] text-[var(--hearth-text-primary)]">
                            <span className="px-1 text-[10px] font-semibold sm:text-[11px]">1. Planner</span>
                        </Chip>
                        <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]">
                            <span className="px-1 text-[10px] font-semibold sm:text-[11px]">2. Proximity</span>
                        </Chip>
                        <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]">
                            <span className="px-1 text-[10px] font-semibold sm:text-[11px]">3. Timer</span>
                        </Chip>
                        <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]">
                            <span className="px-1 text-[10px] font-semibold sm:text-[11px]">4. Completion</span>
                        </Chip>
                    </div>
                </CardBody>
            </Card>

            <MomentCard
                childName={activeChild.name}
                errorMessage={activeChild.momentError}
                isLoading={isRefreshing || isSupabaseMutating}
                moment={activeChild.moment}
                onPrimaryAction={handleStartMoment}
                onSecondaryAction={handleRefreshMoment}
                primaryLabel="Start Moment"
                state={activeChild.momentError ? 'error' : activeChild.moment ? 'ready' : 'empty'}
            />

            {supportMessage ? (
                <ParentStateCard
                    title="Planner update"
                    description={supportMessage}
                    actionLabel="Return To Dashboard"
                    onAction={() => router.push(buildLocalizedHref(params.locale, '/parent'))}
                />
            ) : null}

            {activeChild.moment ? (
                <Card shadow="none" className="hearth-panel rounded-[24px]">
                    <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                        <div className="grid gap-2">
                            <p className="hearth-kicker">Before You Begin</p>
                            <h3 className="hearth-heading text-[1.25rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.35rem]">
                                Keep the setup light and ready
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {activeChild.moment.supplies.map((supply) => (
                                <Chip
                                    key={supply}
                                    radius="full"
                                    variant="flat"
                                    className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]"
                                >
                                    <span className="px-1 text-[10px] font-semibold sm:text-[11px]">{supply}</span>
                                </Chip>
                            ))}
                        </div>
                        <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                            Once you start, the child stays locked for the rest of the moment flow so the activity feels intentional and focused.
                        </p>
                    </CardBody>
                </Card>
            ) : null}

            <MascotBubble
                actionLabel="Back To Home"
                message={
                    activeChild.moment
                        ? 'Choose one calm activity, then let the rest of the flow stay simple.'
                        : 'A shared moment can be small. It only needs enough warmth to feel remembered.'
                }
                onAction={() => router.push(buildLocalizedHref(params.locale, '/parent'))}
                title="Lena Suggests"
            />
        </AppShell>
    );
}
