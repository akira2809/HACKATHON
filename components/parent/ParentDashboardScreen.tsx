'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardBody, Chip } from '@heroui/react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/parent/AppShell';
import { GoalCard } from '@/components/parent/GoalCard';
import { QuestCard } from '@/components/parent/QuestCard';
import { QuestSelectionDrawer } from '@/components/parent/QuestSelectionDrawer';
import { MascotBubble } from '@/components/parent/MascotBubble';
import { generateQuestsWithAgent } from '@/lib/agent';
import { buildLocalizedHref } from '@/lib/locale-path';
import { useAppState, type ParentChild, type ParentQuest } from '@/state/appState';
import { CalendarIcon, CompassIcon, HomeIcon, TargetIcon } from '@/components/design-system/HearthPrimitives';
import { HearthActionButton } from '@/components/design-system/HearthPrimitives';
import { ParentStateCard } from './ParentStateCard';

type ParentDashboardScreenProps = {
    initialTab?: string;
    demoState?: string;
};

type ParentTab = 'home' | 'adventures' | 'dreams';

const QUEST_DRAWER_FOCUS_AREAS = ['learning', 'exercise', 'responsibility', 'habit', 'learning'] as const;

const fallbackQuestOptions: ParentQuest[] = [
    {
        id: 'fallback-learning-notes',
        title: 'Collect three new story words',
        reward: 8,
        category: 'Learning',
        description: 'A quiet language quest that still feels curious, warm, and easy to start.',
        status: 'suggested',
    },
    {
        id: 'fallback-movement-break',
        title: 'Take a five-minute stretch path',
        reward: 8,
        category: 'Movement',
        description: 'A gentle movement reset designed to support focus without pushing the day too hard.',
        status: 'suggested',
    },
    {
        id: 'fallback-small-reset',
        title: 'Reset one small family space',
        reward: 9,
        category: 'Responsibility',
        description: 'A calm responsibility quest that helps the room feel lighter again.',
        status: 'suggested',
    },
    {
        id: 'fallback-care-tidy',
        title: 'Water or tend something living',
        reward: 10,
        category: 'Care',
        description: 'A nurturing quest that keeps the homestead tone soft and meaningful.',
        status: 'suggested',
    },
    {
        id: 'fallback-learning-sketch',
        title: 'Sketch one thing you noticed today',
        reward: 9,
        category: 'Learning',
        description: 'A reflective creative quest that supports calm attention and small wins.',
        status: 'suggested',
    },
];

function getInitialTab(value?: string): ParentTab {
    if (value === 'adventures' || value === 'dreams') {
        return value;
    }

    return 'home';
}

function buildQuestDrawerOptions(child: ParentChild, apiQuests: ParentQuest[]) {
    const uniqueQuests: ParentQuest[] = [];
    const seenTitles = new Set<string>();
    const candidateQuests = [
        ...apiQuests,
        ...child.quests
            .filter((quest) => quest.status === 'suggested')
            .map((quest, index) => ({
                ...quest,
                id: `${quest.id}-existing-${index}`,
            })),
        ...fallbackQuestOptions.map((quest, index) => ({
            ...quest,
            id: `${quest.id}-${child.id}-${index}`,
        })),
    ];

    for (const quest of candidateQuests) {
        const titleKey = quest.title.trim().toLowerCase();

        if (!titleKey || seenTitles.has(titleKey)) {
            continue;
        }

        seenTitles.add(titleKey);
        uniqueQuests.push({
            ...quest,
            status: 'suggested',
        });

        if (uniqueQuests.length === 5) {
            break;
        }
    }

    return uniqueQuests;
}

export function ParentDashboardScreen({
    initialTab,
    demoState,
}: ParentDashboardScreenProps) {
    const params = useParams<{ locale: string }>();
    const router = useRouter();

    const parentName = useAppState((state) => state.parentName);
    const familyId = useAppState((state) => state.familyId);
    const familySeeds = useAppState((state) => state.familySeeds);
    const allChildren = useAppState((state) => state.children);
    const selectedChildId = useAppState((state) => state.selectedChildId);
    const selectChild = useAppState((state) => state.selectChild);
    const approveQuest = useAppState((state) => state.approveQuest);
    const rejectQuest = useAppState((state) => state.rejectQuest);
    const completeQuest = useAppState((state) => state.completeQuest);
    const applyGeneratedQuests = useAppState((state) => state.applyGeneratedQuests);
    const sendSeeds = useAppState((state) => state.sendSeeds);

    const [tab, setTab] = useState<ParentTab>(getInitialTab(initialTab));
    const [isSwitching, setIsSwitching] = useState(false);
    const [isQuestDrawerOpen, setIsQuestDrawerOpen] = useState(false);
    const [isQuestDrawerLoading, setIsQuestDrawerLoading] = useState(false);
    const [questDrawerError, setQuestDrawerError] = useState<string | null>(null);
    const [questDrawerFeedback, setQuestDrawerFeedback] = useState<string | null>(null);
    const [questDrawerPhase, setQuestDrawerPhase] = useState<'select' | 'confirm'>('select');
    const [questDrawerOptions, setQuestDrawerOptions] = useState<ParentQuest[]>([]);
    const [selectedQuestIds, setSelectedQuestIds] = useState<string[]>([]);
    const switchTimeoutRef = useRef<number | null>(null);
    const generateRequestRef = useRef(0);

    const childItems = demoState === 'no-children' ? [] : allChildren;
    const activeChild = childItems.find((child) => child.id === selectedChildId) ?? childItems[0];

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
        selectChild(childId);

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
            setQuestDrawerError(null);
            setQuestDrawerFeedback(null);
            setQuestDrawerPhase('select');
            setQuestDrawerOptions([]);
            setSelectedQuestIds([]);
            return;
        }

        setIsQuestDrawerOpen(true);
    };

    const handleGenerateQuests = async () => {
        if (!activeChild) {
            return;
        }

        handleQuestDrawerOpenChange(true);
        setIsQuestDrawerLoading(true);
        setQuestDrawerError(null);
        setQuestDrawerFeedback(null);
        setQuestDrawerPhase('select');
        setQuestDrawerOptions([]);
        setSelectedQuestIds([]);

        const requestId = generateRequestRef.current + 1;
        generateRequestRef.current = requestId;

        try {
            const response = await generateQuestsWithAgent({
                familyId,
                childId: activeChild.agentChildId,
                childAge: activeChild.age,
                focusAreas: [...QUEST_DRAWER_FOCUS_AREAS],
            });

            if (generateRequestRef.current !== requestId) {
                return;
            }

            const normalizedApiQuests = Array.isArray(response.quests)
                ? response.quests.map((quest, index) => ({
                    id: quest.id || `generated-${activeChild.id}-${index + 1}`,
                    title: quest.title,
                    reward: quest.reward,
                    category: quest.category as ParentQuest['category'],
                    description: quest.description,
                    status: 'suggested' as const,
                }))
                : [];

            const drawerOptions = buildQuestDrawerOptions(activeChild, normalizedApiQuests);

            if (!drawerOptions.length) {
                setQuestDrawerError('The homestead could not gather quest options right now. Please try again in a moment.');
                return;
            }

            setQuestDrawerOptions(drawerOptions);
        } catch (error) {
            if (generateRequestRef.current !== requestId) {
                return;
            }

            setQuestDrawerError(
                error instanceof Error
                    ? error.message
                    : 'The homestead could not gather quest options right now.',
            );
        } finally {
            if (generateRequestRef.current === requestId) {
                setIsQuestDrawerLoading(false);
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
        if (selectedQuestIds.length !== 3) {
            return;
        }

        setQuestDrawerFeedback(null);
        setQuestDrawerPhase('confirm');
    };

    const handleQuestConfirm = () => {
        if (!activeChild || questDrawerPhase !== 'confirm' || selectedQuestIds.length !== 3) {
            return;
        }

        applyGeneratedQuests(
            activeChild.id,
            questDrawerOptions.filter((quest) => selectedQuestIds.includes(quest.id)),
        );
        handleQuestDrawerOpenChange(false);
    };

    if (!childItems.length) {
        return (
            <AppShell
                childItems={[]}
                description="No child profiles are available yet, so the family planner is waiting gently."
                familySeeds={familySeeds}
                navItems={[
                    {
                        key: 'home',
                        label: 'Home',
                        icon: <HomeIcon className="size-4" />,
                        active: true,
                        onPress: () => handleTabChange('home'),
                    },
                    {
                        key: 'adventures',
                        label: 'Adventures',
                        icon: <CompassIcon className="size-4" />,
                        active: false,
                        onPress: () => handleTabChange('adventures'),
                    },
                    {
                        key: 'dreams',
                        label: 'Dreams',
                        icon: <TargetIcon className="size-4" />,
                        active: false,
                        onPress: () => handleTabChange('dreams'),
                    },
                    {
                        key: 'moments',
                        label: 'Moments',
                        icon: <CalendarIcon className="size-4" />,
                        active: false,
                        onPress: navigateToMoments,
                    },
                ]}
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

    if (!activeChild) {
        return null;
    }

    const suggestedQuests = activeChild.quests.filter((quest) => quest.status === 'suggested');
    const approvedQuests = activeChild.quests.filter((quest) => quest.status === 'approved');
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
        },
    ];

    return (
        <AppShell
            childItems={childItems}
            description={`Hi ${parentName}. ${activeChild.introMessage}`}
            familySeeds={familySeeds}
            isSwitching={isSwitching}
            navItems={navItems}
            onSelectChild={handleChildSelect}
            selectedChildId={selectedChildId}
            title={tab === 'home' ? 'Parent Dashboard' : tab === 'adventures' ? 'Adventures' : 'Dreams'}
            notice={activeChild.networkIssue ? (
                <Card shadow="none" className="rounded-[22px] border border-[rgba(180,106,90,0.12)] bg-[rgba(251,248,241,0.92)]">
                    <CardBody className="p-4 text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                        {activeChild.networkIssue}
                    </CardBody>
                </Card>
            ) : null}
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
                                <HearthActionButton onPress={handleGenerateQuests}>
                                    Generate Quests
                                </HearthActionButton>
                            </div>
                            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                                <div className="hearth-subtle-panel rounded-[20px] p-3 sm:p-4">
                                    <p className="hearth-kicker">Suggested</p>
                                    <p className="hearth-number mt-1.5 text-base font-semibold text-[var(--hearth-text-primary)] sm:mt-2 sm:text-lg">
                                        {suggestedQuests.length}
                                    </p>
                                </div>
                                <div className="hearth-subtle-panel rounded-[20px] p-3 sm:p-4">
                                    <p className="hearth-kicker">Approved</p>
                                    <p className="hearth-number mt-1.5 text-base font-semibold text-[var(--hearth-text-primary)] sm:mt-2 sm:text-lg">
                                        {approvedQuests.length}
                                    </p>
                                </div>
                                <div className="hearth-subtle-panel rounded-[20px] p-3 sm:p-4">
                                    <p className="hearth-kicker">Moments</p>
                                    <p className="hearth-number mt-1.5 text-base font-semibold text-[var(--hearth-text-primary)] sm:mt-2 sm:text-lg">
                                        {activeChild.moment ? 1 : 0}
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <GoalCard
                        childName={activeChild.name}
                        goal={activeChild.goal}
                        onPrimaryAction={() => handleTabChange('dreams')}
                        onSecondaryAction={() => sendSeeds(activeChild.id, 5)}
                        seeds={activeChild.seeds}
                    />

                    <div className="grid gap-3">
                        {suggestedQuests.length ? (
                            suggestedQuests.slice(0, 2).map((quest) => (
                                <QuestCard
                                    key={quest.id}
                                    onApprove={() => approveQuest(activeChild.id, quest.id)}
                                    onReject={() => rejectQuest(activeChild.id, quest.id)}
                                    quest={quest}
                                />
                            ))
                        ) : (
                            <ParentStateCard
                                title="No suggested quests right now"
                                description="Use Lena to gather a fresh set when the family is ready."
                                actionLabel="Generate Quests"
                                onAction={() => {
                                    void handleGenerateQuests();
                                }}
                            />
                        )}
                    </div>

                    <MascotBubble
                        message="Welcome back to the homestead. A few gentle wins are enough to move the day forward."
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
                        {suggestedQuests.length ? (
                            suggestedQuests.map((quest) => (
                                <QuestCard
                                    key={quest.id}
                                    onApprove={() => approveQuest(activeChild.id, quest.id)}
                                    onReject={() => rejectQuest(activeChild.id, quest.id)}
                                    quest={quest}
                                />
                            ))
                        ) : (
                            <ParentStateCard
                                title="No quests waiting for review"
                                description="There are no fresh suggestions for this child yet. Generate another calm set when you are ready."
                                actionLabel="Generate Quests"
                                onAction={() => {
                                    void handleGenerateQuests();
                                }}
                            />
                        )}
                    </div>

                    {approvedQuests.length ? (
                        <Card shadow="none" className="hearth-panel rounded-[24px]">
                            <CardBody className="grid gap-3 p-4 sm:p-5">
                                <p className="hearth-kicker">Approved Today</p>
                                {approvedQuests.map((quest) => (
                                    <QuestCard
                                        key={quest.id}
                                        onComplete={() => completeQuest(activeChild.id, quest.id)}
                                        quest={quest}
                                    />
                                ))}
                            </CardBody>
                        </Card>
                    ) : null}
                </>
            ) : null}

            {tab === 'dreams' ? (
                <>
                    <GoalCard
                        childName={activeChild.name}
                        goal={activeChild.goal}
                        onPrimaryAction={activeChild.goal ? () => sendSeeds(activeChild.id, 5) : undefined}
                        onSecondaryAction={() => sendSeeds(activeChild.id, 10)}
                        primaryActionLabel="Send 5 Seeds"
                        secondaryActionLabel="Send 10 Seeds"
                        seeds={activeChild.seeds}
                    />

                    {activeChild.goal ? (
                        <>
                            <Card shadow="none" className="hearth-panel rounded-[24px]">
                                <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                                    <p className="hearth-kicker">Seed Actions</p>
                                    <div className="flex flex-wrap gap-3">
                                        <HearthActionButton tone="secondary" onPress={() => sendSeeds(activeChild.id, 5)}>
                                            +5 Seeds
                                        </HearthActionButton>
                                        <HearthActionButton tone="secondary" onPress={() => sendSeeds(activeChild.id, 10)}>
                                            +10 Seeds
                                        </HearthActionButton>
                                        <HearthActionButton tone="ghost">
                                            Custom Amount
                                        </HearthActionButton>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card shadow="none" className="hearth-panel rounded-[24px]">
                                <CardBody className="grid gap-3 p-4 sm:p-5">
                                    <p className="hearth-kicker">Progress Moments</p>
                                    <div className="grid gap-2 text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                                        <p>10 seeds / first sprout</p>
                                        <p>{activeChild.goal.milestone} seeds / brighter ledger ribbon</p>
                                        <p>{activeChild.goal.target} seeds / goal achieved</p>
                                    </div>
                                </CardBody>
                            </Card>
                        </>
                    ) : (
                        <ParentStateCard
                            title="Seeds begin once a goal is chosen"
                            description="A shared goal gives daily rewards context, so the dreams board is waiting for that first family target."
                        />
                    )}

                    {activeChild.goal && activeChild.seeds >= activeChild.goal.milestone ? (
                        <MascotBubble
                            message="A milestone has been reached. Keep the next step calm and meaningful so the goal still feels shared."
                        />
                    ) : null}
                </>
            ) : null}

            <QuestSelectionDrawer
                childName={activeChild.name}
                errorMessage={questDrawerError}
                feedbackMessage={questDrawerFeedback}
                isConfirming={false}
                isLoading={isQuestDrawerLoading}
                isOpen={isQuestDrawerOpen}
                onBackToSelection={() => setQuestDrawerPhase('select')}
                onConfirm={handleQuestConfirm}
                onDone={handleQuestDone}
                onOpenChange={handleQuestDrawerOpenChange}
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
