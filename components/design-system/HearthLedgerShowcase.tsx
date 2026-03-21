'use client';

import { useState } from 'react';
import { Card, CardBody, Chip } from '@heroui/react';
import { HearthBottomNav, HearthChild, HearthChildSelector, HearthGoalCard, HearthMascotBubble, HearthMoment, HearthMomentCard, HearthQuest, HearthQuestCard } from './HearthCards';
import { HearthActionButton, HearthDivider, HearthPanel, HearthPaletteSwatch, HearthRewardChip, HearthSection, HearthStatusChip, HearthTextInput, HearthTypeSample, HearthUsageBlock } from './HearthPrimitives';

const children: HearthChild[] = [
    { id: 'mina', name: 'Mina', age: 8, seeds: 30, goal: 'Birthday Gift' },
    { id: 'leo', name: 'Leo', age: 6, seeds: 18, goal: 'New Backpack' },
    { id: 'ava', name: 'Ava', age: 9, seeds: 62, goal: 'Art Kit' },
    { id: 'noah', name: 'Noah', age: 7, seeds: 25, goal: 'Museum Trip' },
];

const quests: HearthQuest[] = [
    {
        id: 'quest-1',
        title: 'Read 10 pages before dinner',
        reward: 10,
        category: 'Learning',
        description: 'A quiet, confidence-building task that keeps the day grounded and purposeful.',
        status: 'pending',
    },
    {
        id: 'quest-2',
        title: 'Tidy the toy shelf',
        reward: 8,
        category: 'Responsibility',
        description: 'A light reset that supports order without feeling like a chore-heavy dashboard.',
        status: 'approved',
    },
    {
        id: 'quest-3',
        title: 'Water the window plants',
        reward: 12,
        category: 'Care',
        description: 'A small nurturing ritual that fits the homestead theme and rewards attentiveness.',
        status: 'completed',
    },
];

const moment: HearthMoment = {
    title: 'Blanket Reading Nest',
    duration: '20 minutes',
    rewardSeeds: 5,
    rewardTokens: 3,
    description: 'Build a quiet corner with pillows and read a favorite story together before the timer blooms.',
};

export function HearthLedgerShowcase() {
    const [selectedChildId, setSelectedChildId] = useState(children[0].id);
    const activeChild = children.find((child) => child.id === selectedChildId) ?? children[0];

    return (
        <main className="hearth-page">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:px-8">
                <header className="hearth-ledger-card hearth-grain rounded-[32px] p-6 sm:p-8">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
                        <div className="grid gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.26)] text-[var(--hearth-text-secondary)]">
                                    <span className="px-1 text-[11px] font-semibold">HeroUI Based</span>
                                </Chip>
                                <Chip radius="full" variant="flat" className="border border-[rgba(230,199,102,0.2)] bg-[rgba(230,199,102,0.18)] text-[var(--hearth-text-primary)]">
                                    <span className="px-1 text-[11px] font-semibold">Hearth Ledger</span>
                                </Chip>
                                <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(251,248,241,0.72)] text-[var(--hearth-text-secondary)]">
                                    <span className="px-1 text-[11px] font-semibold">Multi-child Parent UI</span>
                                </Chip>
                            </div>
                            <div className="grid gap-3">
                                <p className="hearth-kicker">UI Design System</p>
                                <h1 className="hearth-heading max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[var(--hearth-text-primary)] sm:text-5xl">
                                    Hearth Ledger component gallery for Lena&apos;s Homestead
                                </h1>
                                <p className="max-w-2xl text-sm leading-7 text-[var(--hearth-text-secondary)] sm:text-base">
                                    This page turns the approved design direction into a reusable HeroUI-based system: tokens, actions, cards, child switching, and a mobile composition that future parent screens can share.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <HearthActionButton>Use For Parent Dashboard</HearthActionButton>
                                <HearthActionButton tone="secondary">Apply To New Screens</HearthActionButton>
                                <HearthActionButton tone="ghost">Inspect Component States</HearthActionButton>
                            </div>
                        </div>

                        <HearthPanel className="rounded-[28px]">
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="hearth-kicker">Active Child</p>
                                        <p className="text-lg font-semibold text-[var(--hearth-text-primary)]">{activeChild.name}</p>
                                    </div>
                                    <HearthRewardChip>{activeChild.seeds} Seeds</HearthRewardChip>
                                </div>
                                <HearthChildSelector
                                    items={children}
                                    selectedChildId={selectedChildId}
                                    onSelect={setSelectedChildId}
                                />
                            </div>
                        </HearthPanel>
                    </div>
                </header>

                <HearthSection
                    kicker="Foundations"
                    title="Tokens, typography, and interaction language"
                    description="These are the baseline choices every parent-facing component should inherit so the product feels consistent instead of assembled screen by screen."
                    aside={
                        <>
                            <HearthPanel>
                                <div className="grid gap-3">
                                    <p className="hearth-kicker">Interaction Notes</p>
                                    <div className="grid gap-2">
                                        <HearthStatusChip label="Calm first" tone="neutral" />
                                        <HearthStatusChip label="Rewards stay gold" tone="warning" />
                                        <HearthStatusChip label="Success stays soft" tone="success" />
                                    </div>
                                    <p className="text-sm leading-6 text-[var(--hearth-text-secondary)]">
                                        Use motion only to orient or reward. Cards lift slightly, dropdowns unfold, and numbers roll upward gently.
                                    </p>
                                </div>
                            </HearthPanel>
                            <HearthUsageBlock
                                title="Recommended import"
                                code={`import {\n  HearthGoalCard,\n  HearthQuestCard,\n  HearthChildSelector,\n} from "@/components/design-system";`}
                            />
                        </>
                    }
                >
                    <div className="grid gap-5 xl:grid-cols-2">
                        <HearthPanel>
                            <div className="grid gap-4">
                                <p className="hearth-kicker">Color Palette</p>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <HearthPaletteSwatch name="Parchment" token="parchment" value="#F6F0E5" />
                                    <HearthPaletteSwatch name="Sage Mist" token="sage-mist" value="#D8E3D1" />
                                    <HearthPaletteSwatch name="Warm Wood" token="warm-wood" value="#A67C52" />
                                    <HearthPaletteSwatch name="Soft Gold" token="soft-gold" value="#E6C766" />
                                </div>
                            </div>
                        </HearthPanel>

                        <HearthPanel>
                            <div className="grid gap-4">
                                <p className="hearth-kicker">Typography</p>
                                <div className="grid gap-3">
                                    <HearthTypeSample
                                        label="Fraunces / Heading"
                                        preview="A warm editorial headline with room to breathe"
                                        className="hearth-heading text-[1.9rem] font-semibold tracking-[-0.03em]"
                                    />
                                    <HearthTypeSample
                                        label="Manrope / Body"
                                        preview="Readable UI copy that stays clean when the page becomes more dense."
                                        className="text-sm leading-7 text-[var(--hearth-text-secondary)]"
                                    />
                                    <HearthTypeSample
                                        label="IBM Plex Sans / Number"
                                        preview="35 / 100 Seeds"
                                        className="hearth-number text-2xl font-semibold"
                                    />
                                </div>
                            </div>
                        </HearthPanel>
                    </div>
                </HearthSection>

                <HearthSection
                    kicker="Primitives"
                    title="Buttons, fields, chips, and quick reusable building blocks"
                    description="These are the small pieces that keep actions and status patterns consistent across dashboard, dreams, adventures, and moments."
                >
                    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                        <HearthPanel>
                            <div className="grid gap-4">
                                <p className="hearth-kicker">Buttons And Chips</p>
                                <div className="flex flex-wrap gap-3">
                                    <HearthActionButton>Primary Action</HearthActionButton>
                                    <HearthActionButton tone="secondary">Secondary Action</HearthActionButton>
                                    <HearthActionButton tone="ghost">Tertiary Action</HearthActionButton>
                                    <HearthRewardChip>+10 Seeds</HearthRewardChip>
                                    <HearthStatusChip label="pending" tone="neutral" />
                                    <HearthStatusChip label="completed" tone="success" />
                                </div>
                            </div>
                        </HearthPanel>

                        <HearthPanel>
                            <div className="grid gap-4">
                                <p className="hearth-kicker">Input Language</p>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <HearthTextInput
                                        label="Seed amount"
                                        placeholder="Enter amount"
                                        description="Used when a parent sends bonus seeds."
                                    />
                                    <HearthTextInput
                                        label="Moment theme"
                                        placeholder="Cozy homestead"
                                        description="Use warm, activity-focused prompts."
                                    />
                                </div>
                            </div>
                        </HearthPanel>
                    </div>
                </HearthSection>

                <HearthSection
                    kicker="Reusable Cards"
                    title="Core parent components built for consistency"
                    description="These are the high-value pieces to reuse across the codebase so each screen inherits the same structure, density, and emotional tone."
                >
                    <div className="grid gap-5">
                        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                            <HearthGoalCard child={activeChild} progress={activeChild.seeds} />
                            <div className="grid gap-5">
                                <HearthMomentCard moment={moment} childName={activeChild.name} />
                                <HearthMascotBubble />
                            </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-3">
                            {quests.map((quest) => (
                                <HearthQuestCard key={quest.id} quest={quest} />
                            ))}
                        </div>
                    </div>
                </HearthSection>

                <HearthSection
                    kicker="Mobile Composition"
                    title="A live parent-screen preview using the same reusable parts"
                    description="This phone-sized composition shows how the system fits together in practice before a real product page is built."
                    aside={
                        <Card shadow="none" className="hearth-panel rounded-[28px]">
                            <CardBody className="grid gap-4 p-5">
                                <p className="hearth-kicker">Composition Rules</p>
                                <ul className="grid gap-2 text-sm leading-6 text-[var(--hearth-text-secondary)]">
                                    <li>Keep the child selector visible before any goal or quest content.</li>
                                    <li>Put the goal card above the quest list for emotional context.</li>
                                    <li>Use one mascot message only, near the bottom of the primary scroll.</li>
                                </ul>
                                <HearthDivider />
                                <p className="text-sm leading-6 text-[var(--hearth-text-secondary)]">
                                    The same component set should extend into `Dreams`, `Adventures`, and `Moments` without inventing new card languages.
                                </p>
                            </CardBody>
                        </Card>
                    }
                >
                    <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
                        <div className="mx-auto w-full max-w-[320px] rounded-[36px] border border-[rgba(79,107,82,0.1)] bg-[rgba(251,248,241,0.7)] p-3 shadow-[0_14px_38px_rgba(47,52,44,0.12)]">
                            <div className="hearth-page rounded-[28px] p-3">
                                <div className="grid gap-4">
                                    <div className="rounded-[24px] bg-[rgba(251,248,241,0.86)] p-4 shadow-[0_4px_12px_rgba(79,107,82,0.08)]">
                                        <p className="hearth-kicker">Lena&apos;s Homestead</p>
                                        <div className="mt-1 flex items-center justify-between gap-3">
                                            <h3 className="hearth-heading text-[1.45rem] font-semibold tracking-[-0.03em]">
                                                Parent Dashboard
                                            </h3>
                                            <HearthRewardChip>Family 30</HearthRewardChip>
                                        </div>
                                    </div>

                                    <HearthChildSelector
                                        items={children}
                                        selectedChildId={selectedChildId}
                                        onSelect={setSelectedChildId}
                                    />

                                    <HearthGoalCard child={activeChild} progress={activeChild.seeds} />

                                    <div className="grid gap-3">
                                        <HearthQuestCard quest={quests[0]} />
                                        <HearthQuestCard quest={quests[1]} />
                                    </div>

                                    <HearthMascotBubble />
                                    <HearthBottomNav active="home" />
                                </div>
                            </div>
                        </div>

                        <HearthPanel>
                            <div className="grid gap-4">
                                <p className="hearth-kicker">Why this system is reusable</p>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="hearth-subtle-panel rounded-[22px] p-4">
                                        <p className="text-sm font-semibold text-[var(--hearth-text-primary)]">
                                            One visual language
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-[var(--hearth-text-secondary)]">
                                            Cards, buttons, chips, and navigation all share the same borders, shadows, font hierarchy, and gold-accent reward language.
                                        </p>
                                    </div>
                                    <div className="hearth-subtle-panel rounded-[22px] p-4">
                                        <p className="text-sm font-semibold text-[var(--hearth-text-primary)]">
                                            One active-child pattern
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-[var(--hearth-text-secondary)]">
                                            The `HearthChildSelector` becomes the consistent gatekeeper for all multi-child screens, so state stays legible and predictable.
                                        </p>
                                    </div>
                                    <div className="hearth-subtle-panel rounded-[22px] p-4">
                                        <p className="text-sm font-semibold text-[var(--hearth-text-primary)]">
                                            Easy to extend
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-[var(--hearth-text-secondary)]">
                                            Future views like `Dreams`, `Adventures`, and `Moments` can reuse these same pieces with new data rather than inventing new UIs.
                                        </p>
                                    </div>
                                    <div className="hearth-subtle-panel rounded-[22px] p-4">
                                        <p className="text-sm font-semibold text-[var(--hearth-text-primary)]">
                                            HeroUI as the base layer
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-[var(--hearth-text-secondary)]">
                                            HeroUI handles the accessible primitives while the `Hearth Ledger` classes provide the project-specific look and behavior.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </HearthPanel>
                    </div>
                </HearthSection>

                <div className="grid gap-5 lg:grid-cols-2">
                    <HearthUsageBlock
                        title="Compose a card on any screen"
                        code={`<HearthGoalCard\n  child={activeChild}\n  progress={activeChild.seeds}\n/>`}
                    />
                    <HearthUsageBlock
                        title="Keep multi-child state consistent"
                        code={`<HearthChildSelector\n  items={children}\n  selectedChildId={selectedChildId}\n  onSelect={setSelectedChildId}\n/>`}
                    />
                </div>
            </div>
        </main>
    );
}
