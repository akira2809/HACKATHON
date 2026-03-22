'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardBody, Chip, Skeleton } from '@heroui/react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/parent/AppShell';
import { GoalCard } from '@/components/parent/GoalCard';
import { QuestCard } from '@/components/parent/QuestCard';
import { QuestSelectionDrawer } from '@/components/parent/QuestSelectionDrawer';
import { MascotBubble } from '@/components/parent/MascotBubble';
import { useGenerateQuests } from '@/hooks/useGenerateQuests';
import { useParentDashboardData } from '@/hooks/useParentDashboardData';
import { buildLocalizedHref } from '@/lib/locale-path';
import { type ParentQuest } from '@/state/appState';
import { useGlobalLoadingState } from '@/state/global-loading-state';
import { CalendarIcon, CompassIcon, HomeIcon, TargetIcon } from '@/components/design-system/HearthPrimitives';
import { HearthActionButton } from '@/components/design-system/HearthPrimitives';
import { ParentStateCard } from './ParentStateCard';

type ParentDashboardScreenProps = {
    initialTab?: string;
    demoState?: string;
};

type ParentTab = 'home' | 'adventures' | 'dreams';
const QUEST_DRAWER_FOCUS_AREAS = ['learning', 'exercise', 'responsibility', 'habit', 'learning'] as const;

function getInitialTab(value?: string): ParentTab {
    if (value === 'adventures' || value === 'dreams') {
        return value;
    }

    return 'home';
}

function getTodayDateString() {
    return new Date().toISOString().slice(0, 10);
}

function getQuestLoadingStates(childName: string) {
    return [
        { text: `Lena is gathering calm quest ideas for ${childName}` },
        { text: `Shaping a balanced set for ${childName}'s day` },
        { text: 'Preparing the final three-to-choose shortlist' },
    ];
}

function OverviewStat({
    label,
    value,
    isLoading = false,
}: {
    label: string;
    value: number;
    isLoading?: boolean;
}) {
    return (
        <div className="hearth-subtle-panel rounded-[20px] p-3 sm:p-4">
            <p className="hearth-kicker">{label}</p>
            {isLoading ? (
                <Skeleton className="mt-2 h-6 w-10 rounded-full" />
            ) : (
                <p className="hearth-number mt-1.5 text-base font-semibold text-[var(--hearth-text-primary)] sm:mt-2 sm:text-lg">
                    {value}
                </p>
            )}
        </div>
    );
}

export function ParentDashboardScreen({
    initialTab,
    demoState,
}: ParentDashboardScreenProps) {
    const params = useParams<{ locale: string }>();
    const router = useRouter();
    const dashboardData = useParentDashboardData({ demoState });
    const {
        activeChild = null,
        childItems = [],
        dashboardError = null,
        familyId = '',
        familySummary = 'Family Board',
        goalsQuery,
        hasUnreadMomentRequests = false,
        hasNoChildren = false,
        heroDescription = 'The family board will fill in once a child profile is ready.',
        isChildSelectorLoading = false,
        isOverviewLoading = false,
        latestUnreadMomentRequest = null,
        momentsCount = 0,
        ongoingQuests = [],
        pendingQuests = [],
        questActions,
        selectedChildId = '',
        selectChild,
        todayQuestsError = null,
    } = dashboardData;
    const safeGoalsQuery = goalsQuery ?? { isLoading: false };
    const safeQuestActions = questActions ?? {
        completeQuest: async () => null,
        createQuests: async () => [],
        refetch: async () => [],
        removeQuest: async () => undefined,
        startQuest: async () => null,
    };
    const safeSelectChild = selectChild ?? (() => undefined);
    const startGlobalLoading = useGlobalLoadingState((state) => state.startLoading);
    const stopGlobalLoading = useGlobalLoadingState((state) => state.stopLoading);

    const generateQuests = useGenerateQuests(
        activeChild && familyId
            ? {
                childAge: activeChild.age,
                childId: activeChild.id,
                familyId,
                focusAreas: [...QUEST_DRAWER_FOCUS_AREAS],
            }
            : undefined,
    );

    const [tab, setTab] = useState<ParentTab>(getInitialTab(initialTab));
    const [isSwitching, setIsSwitching] = useState(false);
    const [isQuestDrawerOpen, setIsQuestDrawerOpen] = useState(false);
    const [isQuestDrawerLoading, setIsQuestDrawerLoading] = useState(false);
    const [isQuestDrawerRefreshing, setIsQuestDrawerRefreshing] = useState(false);
    const [isQuestDrawerConfirming, setIsQuestDrawerConfirming] = useState(false);
    const [questDrawerError, setQuestDrawerError] = useState<string | null>(null);
    const [questDrawerFeedback, setQuestDrawerFeedback] = useState<string | null>(null);
    const [questDrawerPhase, setQuestDrawerPhase] = useState<'select' | 'confirm'>('select');
    const [questDrawerOptions, setQuestDrawerOptions] = useState<ParentQuest[]>([]);
    const [selectedQuestIds, setSelectedQuestIds] = useState<string[]>([]);
    const switchTimeoutRef = useRef<number | null>(null);
    const generateRequestRef = useRef(0);
    const selectedSuggestedQuestIds = selectedQuestIds.filter((questId) =>
        questDrawerOptions.some((quest) => quest.id === questId && quest.status === 'suggested'),
    );

    useEffect(() => {
        setTab(getInitialTab(initialTab));
    }, [initialTab]);

    useEffect(() => {
        return () => {
            if (switchTimeoutRef.current) {
                window.clearTimeout(switchTimeoutRef.current);
            }
        };
    }, []);

    const localizedParentHref = (nextTab: ParentTab) => {
        if (nextTab === 'home') {
            return buildLocalizedHref(params.locale, '/parent');
        }

        return buildLocalizedHref(params.locale, `/parent?tab=${nextTab}`);
    };

    const navigateToMoments = () => {
        router.push(buildLocalizedHref(params.locale, '/parent/moments'));
    };

    const handleTabChange = (nextTab: ParentTab) => {
        setTab(nextTab);
        router.replace(localizedParentHref(nextTab), { scroll: false });
    };

    const handleChildSelect = (childId: string) => {
        if (childId === selectedChildId) {
            return;
        }

        setIsSwitching(true);
        handleQuestDrawerOpenChange(false);
        safeSelectChild(childId);

        if (switchTimeoutRef.current) {
            window.clearTimeout(switchTimeoutRef.current);
        }

        switchTimeoutRef.current = window.setTimeout(() => {
            setIsSwitching(false);
        }, 180);
    };

    const handleQuestDrawerOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            generateRequestRef.current += 1;
            setIsQuestDrawerOpen(false);
            setIsQuestDrawerLoading(false);
            setIsQuestDrawerRefreshing(false);
            setIsQuestDrawerConfirming(false);
            setQuestDrawerError(null);
            setQuestDrawerFeedback(null);
            setQuestDrawerPhase('select');
            setQuestDrawerOptions([]);
            setSelectedQuestIds([]);
            generateQuests.reset();
            return;
        }

        setIsQuestDrawerOpen(true);
    };

    const handleGenerateQuests = async (preserveSelected = false) => {
        if (!activeChild || !familyId) {
            return;
        }

        const lockedQuests = preserveSelected
            ? questDrawerOptions.filter((quest) => selectedQuestIds.includes(quest.id))
            : [];
        const excludedTitles = [
            ...activeChild.quests.map((quest) => quest.title),
            ...(preserveSelected
                ? questDrawerOptions
                    .filter((quest) => !selectedQuestIds.includes(quest.id))
                    .map((quest) => quest.title)
                : []),
        ];

        const globalLoadingRequestId = !preserveSelected
            ? startGlobalLoading({
                duration: 1700,
                helperText: `Lena is preparing a fresh quest set for ${activeChild.name}.`,
                loadingStates: getQuestLoadingStates(activeChild.name),
                loop: true,
            })
            : null;

        if (!preserveSelected) {
            setIsQuestDrawerOpen(false);
            setIsQuestDrawerLoading(false);
            setQuestDrawerOptions([]);
            setSelectedQuestIds([]);
        } else {
            setIsQuestDrawerRefreshing(true);
        }

        setQuestDrawerError(null);
        setQuestDrawerFeedback(null);
        setQuestDrawerPhase('select');

        const requestId = generateRequestRef.current + 1;
        generateRequestRef.current = requestId;

        try {
            const nextOptions = await generateQuests.generate({
                childAge: activeChild.age,
                childId: activeChild.id,
                excludeTitles: excludedTitles,
                familyId,
                focusAreas: [...QUEST_DRAWER_FOCUS_AREAS],
                lockedOptions: lockedQuests,
            });

            if (generateRequestRef.current !== requestId) {
                return;
            }

            setQuestDrawerOptions(nextOptions);
            if (!preserveSelected) {
                setIsQuestDrawerOpen(true);
            }

            if (preserveSelected) {
                setSelectedQuestIds(lockedQuests.map((quest) => quest.id));
                setQuestDrawerFeedback(
                    lockedQuests.length === 1
                        ? 'Kept your selected quest and refreshed the remaining options.'
                        : 'Kept your selected quests and refreshed the remaining options.',
                );
            }
        } catch {
            if (generateRequestRef.current !== requestId) {
                return;
            }

            setQuestDrawerError('Something did not come through just yet. Please try again.');
            if (!preserveSelected) {
                setIsQuestDrawerOpen(true);
            }
        } finally {
            if (generateRequestRef.current === requestId) {
                if (globalLoadingRequestId) {
                    stopGlobalLoading(globalLoadingRequestId);
                }
                setIsQuestDrawerLoading(false);
                setIsQuestDrawerRefreshing(false);
            }
        }
    };

    const handleQuestToggle = (questId: string) => {
        setQuestDrawerFeedback(null);
        setQuestDrawerPhase('select');

        setSelectedQuestIds((currentIds) => {
            if (currentIds.includes(questId)) {
                return currentIds.filter((currentId) => currentId !== questId);
            }

            if (currentIds.length >= 3) {
                setQuestDrawerFeedback('Choose 3 quests. Deselect one before choosing another.');
                return currentIds;
            }

            return [...currentIds, questId];
        });
    };

    const handleQuestDone = () => {
        if (selectedSuggestedQuestIds.length !== 3) {
            return;
        }

        setQuestDrawerFeedback(null);
        setQuestDrawerPhase('confirm');
    };

    const handleQuestConfirm = async () => {
        if (!activeChild || questDrawerPhase !== 'confirm' || selectedSuggestedQuestIds.length !== 3) {
            return;
        }

        setIsQuestDrawerConfirming(true);
        setQuestDrawerFeedback(null);

        try {
            await safeQuestActions.createQuests(
                questDrawerOptions
                    .filter((quest) => quest.status === 'suggested' && selectedSuggestedQuestIds.includes(quest.id))
                    .map((quest) => ({
                        assignedDate: getTodayDateString(),
                        childId: activeChild.id,
                        description: quest.description,
                        reward: quest.reward,
                        status: 'pending' as const,
                        title: quest.title,
                    })),
            );
            await safeQuestActions.refetch();
            handleQuestDrawerOpenChange(false);
        } catch {
            setQuestDrawerFeedback('We could not save those quests right now. Please try again.');
        } finally {
            setIsQuestDrawerConfirming(false);
        }
    };

    const navItems = [
        {
            key: 'home',
            label: 'Home',
            icon: <HomeIcon className="size-4" />,
            active: tab === 'home',
            onPress: () => handleTabChange('home'),
        },
        {
            key: 'adventures',
            label: 'Adventures',
            icon: <CompassIcon className="size-4" />,
            active: tab === 'adventures',
            onPress: () => handleTabChange('adventures'),
        },
        {
            key: 'dreams',
            label: 'Dreams',
            icon: <TargetIcon className="size-4" />,
            active: tab === 'dreams',
            onPress: () => handleTabChange('dreams'),
        },
        {
            key: 'moments',
            label: 'Moments',
            icon: <CalendarIcon className="size-4" />,
            active: false,
            onPress: navigateToMoments,
            showNotificationDot: hasUnreadMomentRequests,
        },
    ];

    const noticeMessage = dashboardError ?? todayQuestsError;
    const notice = latestUnreadMomentRequest || noticeMessage ? (
        <div className="grid gap-3">
            {latestUnreadMomentRequest ? (
                <Card shadow="none" className="rounded-[22px] border border-[rgba(198,90,71,0.14)] bg-[rgba(251,248,241,0.94)]">
                    <CardBody className="grid gap-3 p-4">
                        <div className="grid gap-1.5">
                            <p className="hearth-kicker">Moment Request</p>
                            <p className="text-sm font-semibold text-[var(--hearth-text-primary)] sm:text-[15px]">
                                {latestUnreadMomentRequest.childName} wants to {latestUnreadMomentRequest.activity.toLowerCase()}.
                            </p>
                            <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                                Open Moments to set the family time window and let the shared activity begin.
                            </p>
                        </div>
                        <div>
                            <HearthActionButton tone="secondary" onPress={navigateToMoments}>
                                View Moments
                            </HearthActionButton>
                        </div>
                    </CardBody>
                </Card>
            ) : null}

            {noticeMessage ? (
                <Card shadow="none" className="rounded-[22px] border border-[rgba(180,106,90,0.12)] bg-[rgba(251,248,241,0.92)]">
                    <CardBody className="p-4 text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                        {noticeMessage}
                    </CardBody>
                </Card>
            ) : null}
        </div>
    ) : null;

    if (hasNoChildren) {
        return (
            <AppShell
                childItems={[]}
                description="No child profiles are available yet, so the family planner is waiting gently."
                familySeeds={familySummary}
                navItems={navItems}
                onSelectChild={handleChildSelect}
                selectedChildId=""
                title="Parent Dashboard"
            >
                <ParentStateCard
                    title="No children added yet"
                    description="Add your first child profile to begin tracking goals, gentle quests, and shared moments."
                />
            </AppShell>
        );
    }

    if (!activeChild && isChildSelectorLoading) {
        return (
            <AppShell
                childItems={[]}
                description="The family board is coming through now."
                familySeeds={familySummary}
                isChildSelectorLoading
                navItems={navItems}
                onSelectChild={handleChildSelect}
                selectedChildId=""
                title="Parent Dashboard"
            >
                <Card shadow="none" className="hearth-panel rounded-[24px]">
                    <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="grid min-w-0 flex-1 gap-2">
                                <p className="hearth-kicker">Overview</p>
                                <Skeleton className="h-10 w-44 rounded-[18px]" />
                            </div>
                            <Skeleton className="h-10 w-32 rounded-full" />
                        </div>
                            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                                <OverviewStat label="Ready" value={0} isLoading />
                                <OverviewStat label="In Progress" value={0} isLoading />
                                <OverviewStat label="Moments" value={0} isLoading />
                            </div>
                    </CardBody>
                </Card>
                <GoalCard childName="Your child" goal={null} isLoading seeds={0} />
                <QuestCard isLoading />
                <QuestCard isLoading />
            </AppShell>
        );
    }

    if (!activeChild) {
        return null;
    }

    return (
        <AppShell
            childItems={childItems}
            description={heroDescription}
            familySeeds={familySummary}
            isChildSelectorLoading={isChildSelectorLoading}
            isSwitching={isSwitching}
            navItems={navItems}
            onSelectChild={handleChildSelect}
            selectedChildId={selectedChildId}
            title={tab === 'home' ? 'Parent Dashboard' : tab === 'adventures' ? 'Adventures' : 'Dreams'}
            notice={notice}
        >
            {tab === 'home' ? (
                <>
                    <Card shadow="none" className="hearth-panel rounded-[24px]">
                        <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                            <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
                                <div className="grid min-w-0 flex-1 gap-2">
                                    <p className="hearth-kicker">Overview</p>
                                    <h2 className="hearth-heading text-[1.4rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.6rem]">
                                        A calm view of {activeChild.name}&apos;s day
                                    </h2>
                                </div>
                                <HearthActionButton onPress={() => {
                                    void handleGenerateQuests();
                                }}>
                                    Generate Quests
                                </HearthActionButton>
                            </div>
                            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                                <OverviewStat label="Ready" value={pendingQuests.length} isLoading={isOverviewLoading} />
                                <OverviewStat label="In Progress" value={ongoingQuests.length} isLoading={isOverviewLoading} />
                                <OverviewStat label="Moments" value={momentsCount} isLoading={isOverviewLoading} />
                            </div>
                        </CardBody>
                    </Card>

                    <GoalCard
                        childName={activeChild.name}
                        goal={activeChild.goal}
                        isLoading={safeGoalsQuery.isLoading}
                        onPrimaryAction={activeChild.goal ? () => handleTabChange('dreams') : undefined}
                        seeds={activeChild.seeds}
                    />

                    <div className="grid gap-3">
                        {isOverviewLoading ? (
                            <>
                                <QuestCard isLoading />
                                <QuestCard isLoading />
                            </>
                        ) : ongoingQuests.length || pendingQuests.length ? (
                            <>
                                {ongoingQuests.length > 1 ? (
                                    <div className="flex items-center justify-between gap-3 rounded-[20px] border border-[rgba(79,107,82,0.1)] bg-[rgba(251,248,241,0.92)] px-4 py-3">
                                        <p className="hearth-kicker">In Progress</p>
                                        <Chip
                                            radius="full"
                                            variant="flat"
                                            className="border border-[rgba(230,199,102,0.24)] bg-[rgba(230,199,102,0.18)] text-[var(--hearth-text-primary)]"
                                        >
                                            <span className="px-1 text-[10px] font-semibold sm:text-[11px]">
                                                Quests: {ongoingQuests.length}
                                            </span>
                                        </Chip>
                                    </div>
                                ) : null}
                                {ongoingQuests.slice(0, 1).map((quest) => (
                                    <QuestCard
                                        key={quest.id}
                                        childName={activeChild.name}
                                        onComplete={() => {
                                            void safeQuestActions.completeQuest(quest.id);
                                        }}
                                        quest={quest}
                                    />
                                ))}
                                {pendingQuests
                                    .slice(0, ongoingQuests.length ? 1 : 2)
                                    .map((quest) => (
                                        <QuestCard
                                            key={quest.id}
                                            childName={activeChild.name}
                                            quest={quest}
                                        />
                                    ))}
                            </>
                        ) : (
                            <ParentStateCard
                                title="No quests ready for today yet"
                                description="Choose three calm quest options and they will be ready for the child to begin."
                                actionLabel="Generate Quests"
                                onAction={() => {
                                    void handleGenerateQuests();
                                }}
                            />
                        )}
                    </div>

                    <MascotBubble
                        message={`Welcome back. ${activeChild.name}'s next gentle wins can stay simple today.`}
                    />
                </>
            ) : null}

            {tab === 'adventures' ? (
                <>
                    <Card shadow="none" className="hearth-panel rounded-[24px]">
                        <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                            <div className="flex flex-wrap items-center gap-2">
                                <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.26)] text-[var(--hearth-text-secondary)]">
                                    <span className="px-1 text-[10px] font-semibold sm:text-[11px]">Learning</span>
                                </Chip>
                                <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.26)] text-[var(--hearth-text-secondary)]">
                                    <span className="px-1 text-[10px] font-semibold sm:text-[11px]">Responsibility</span>
                                </Chip>
                                <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.26)] text-[var(--hearth-text-secondary)]">
                                    <span className="px-1 text-[10px] font-semibold sm:text-[11px]">Movement</span>
                                </Chip>
                            </div>
                            <HearthActionButton onPress={() => {
                                void handleGenerateQuests();
                            }}>
                                Generate Quests
                            </HearthActionButton>
                        </CardBody>
                    </Card>

                    <div className="grid gap-3">
                        {isOverviewLoading ? (
                            <>
                                <QuestCard isLoading />
                                <QuestCard isLoading />
                            </>
                        ) : pendingQuests.length ? (
                            pendingQuests.map((quest) => (
                                <QuestCard
                                    key={quest.id}
                                    childName={activeChild.name}
                                    quest={quest}
                                />
                            ))
                        ) : (
                            <ParentStateCard
                                title="No quests ready to begin"
                                description="There are no ready quests for this child yet. Generate a new calm set when needed."
                                actionLabel="Generate Quests"
                                onAction={() => {
                                    void handleGenerateQuests();
                                }}
                            />
                        )}
                    </div>

                    {ongoingQuests.length ? (
                        <Card shadow="none" className="hearth-panel rounded-[24px]">
                            <CardBody className="grid gap-3 p-4 sm:p-5">
                                <p className="hearth-kicker">In Progress</p>
                                {ongoingQuests.map((quest) => (
                                    <QuestCard
                                        key={quest.id}
                                        childName={activeChild.name}
                                        onComplete={() => {
                                            void safeQuestActions.completeQuest(quest.id);
                                        }}
                                        quest={quest}
                                    />
                                ))}
                            </CardBody>
                        </Card>
                    ) : pendingQuests.length ? (
                        <ParentStateCard
                            kicker="In Progress"
                            title="Nothing is in progress yet"
                            description={`${activeChild.name} will move a quest here after pressing Go from the child side.`}
                        />
                    ) : null}
                </>
            ) : null}

            {tab === 'dreams' ? (
                <>
                    <GoalCard
                        childName={activeChild.name}
                        goal={activeChild.goal}
                        isLoading={safeGoalsQuery.isLoading}
                        seeds={activeChild.seeds}
                    />

                    {activeChild.goal ? (
                        <Card shadow="none" className="hearth-panel rounded-[24px]">
                            <CardBody className="grid gap-3 p-4 sm:p-5">
                                <p className="hearth-kicker">Progress Moments</p>
                                <div className="grid gap-2 text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                                    <p>Rewards now come from completed quests and shared moments.</p>
                                    <p>{activeChild.goal.milestone} seeds / brighter ledger ribbon</p>
                                    <p>{activeChild.goal.target} seeds / goal achieved</p>
                                </div>
                            </CardBody>
                        </Card>
                    ) : (
                        <ParentStateCard
                            title="No goal has been set for this child"
                            description="A shared goal gives daily progress context, but the dashboard stays usable without it."
                        />
                    )}

                    {activeChild.goal && activeChild.seeds >= activeChild.goal.milestone ? (
                        <MascotBubble
                            message="A milestone has been reached. Let the next step stay steady and shared."
                        />
                    ) : null}
                </>
            ) : null}

            <QuestSelectionDrawer
                childName={activeChild.name}
                errorMessage={questDrawerError}
                feedbackMessage={questDrawerFeedback}
                isConfirming={isQuestDrawerConfirming}
                isLoading={isQuestDrawerLoading}
                isRefreshingOptions={isQuestDrawerRefreshing}
                isOpen={isQuestDrawerOpen}
                onBackToSelection={() => setQuestDrawerPhase('select')}
                onConfirm={() => {
                    void handleQuestConfirm();
                }}
                onDone={handleQuestDone}
                onOpenChange={handleQuestDrawerOpenChange}
                onRegenerateOptions={() => {
                    void handleGenerateQuests(true);
                }}
                onRetry={() => {
                    void handleGenerateQuests();
                }}
                onToggleQuest={handleQuestToggle}
                options={questDrawerOptions}
                phase={questDrawerPhase}
                selectedQuestIds={selectedQuestIds}
            />
        </AppShell>
    );
}
