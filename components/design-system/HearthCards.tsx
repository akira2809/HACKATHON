'use client';

import { Avatar, Card, CardBody, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Progress } from '@heroui/react';
import { HearthActionButton, HearthRewardChip, HearthStatusChip, ChevronDownIcon, CompassIcon, HomeIcon, SeedIcon, TargetIcon, VoiceIcon, CalendarIcon } from './HearthPrimitives';

export type HearthChild = {
    id: string;
    name: string;
    age: number;
    seeds: number;
    goal: string;
};

export type HearthQuest = {
    id: string;
    title: string;
    reward: number;
    category: string;
    description: string;
    status: 'pending' | 'approved' | 'completed' | 'rejected';
};

export type HearthMoment = {
    title: string;
    duration: string;
    rewardSeeds: number;
    rewardTokens: number;
    description: string;
};

export function HearthChildSelector({
    items,
    selectedChildId,
    onSelect,
}: {
    items: HearthChild[];
    selectedChildId: string;
    onSelect: (id: string) => void;
}) {
    const activeChild = items.find((child) => child.id === selectedChildId) ?? items[0];

    return (
        <Dropdown
            placement="bottom-start"
            offset={10}
            shouldBlockScroll={false}
            classNames={{
                base: 'z-[220]',
                content: 'min-w-[320px] rounded-[24px] border border-[rgba(79,107,82,0.12)] bg-[var(--hearth-bg-surface)] p-2 shadow-[0_18px_40px_rgba(47,52,44,0.18)]',
            }}
        >
            <DropdownTrigger>
                <HearthActionButton
                    tone="secondary"
                    className="hearth-pill h-auto w-full justify-between rounded-[999px] px-3 py-3"
                >
                    <span className="flex min-w-0 items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-[rgba(230,199,102,0.22)] text-[var(--hearth-accent-wood)]">
                            <SeedIcon className="size-4" />
                        </span>
                        <span className="min-w-0 text-left">
                            <span className="block truncate text-sm font-semibold text-[var(--hearth-text-primary)]">
                                {activeChild.name}
                            </span>
                            <span className="block truncate text-xs text-[var(--hearth-text-secondary)]">
                                {activeChild.age} yrs / {activeChild.goal}
                            </span>
                        </span>
                    </span>
                    <span className="flex items-center gap-3 text-[var(--hearth-text-secondary)]">
                        <span className="hearth-number text-sm font-semibold">
                            {activeChild.seeds} Seeds
                        </span>
                        <ChevronDownIcon />
                    </span>
                </HearthActionButton>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Choose a child to track"
                onAction={(key) => onSelect(String(key))}
                className="max-h-72 min-w-[320px] overflow-auto bg-transparent p-1"
            >
                {items.map((child) => (
                    <DropdownItem
                        key={child.id}
                        textValue={child.name}
                        className="rounded-[18px] px-2 py-2 opacity-100 data-[hover=true]:bg-[rgba(216,227,209,0.35)] data-[selectable=true]:focus:bg-[rgba(216,227,209,0.35)]"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <Avatar
                                    name={child.name}
                                    className="bg-[rgba(216,227,209,0.8)] text-[var(--hearth-text-secondary)]"
                                />
                                <div className="grid gap-0.5">
                                    <p className="text-sm font-semibold text-[var(--hearth-text-primary)]">
                                        {child.name}
                                    </p>
                                    <p className="text-xs text-[var(--hearth-text-secondary)]">
                                        {child.age} yrs / {child.goal}
                                    </p>
                                </div>
                            </div>
                            <HearthRewardChip>{child.seeds} Seeds</HearthRewardChip>
                        </div>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
}

export function HearthGoalCard({
    child,
    progress,
}: {
    child: HearthChild;
    progress: number;
}) {
    return (
        <Card shadow="none" className="hearth-ledger-card rounded-[28px]">
            <CardBody className="grid gap-5 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="grid gap-1">
                        <p className="hearth-kicker">Current Goal</p>
                        <h3 className="hearth-heading text-[1.7rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)]">
                            {child.goal}
                        </h3>
                        <p className="text-sm leading-6 text-[var(--hearth-text-secondary)]">
                            Small daily wins help this goal feel shared and meaningful.
                        </p>
                    </div>
                    <HearthRewardChip>{child.seeds} / 100</HearthRewardChip>
                </div>

                <Progress
                    aria-label="Goal progress"
                    value={progress}
                    classNames={{
                        base: 'max-w-full',
                        track: 'h-3 rounded-full border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.28)]',
                        indicator: 'bg-[linear-gradient(90deg,var(--hearth-accent-gold),#d5b16a)]',
                        label: 'text-sm text-[var(--hearth-text-secondary)]',
                        value: 'hearth-number text-sm font-semibold text-[var(--hearth-text-primary)]',
                    }}
                    label="Seeds collected"
                    maxValue={100}
                    showValueLabel
                />

                <div className="hearth-subtle-panel rounded-[22px] p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--hearth-text-muted)]">
                        Milestone Note
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--hearth-text-secondary)]">
                        At 50 seeds, Lena unlocks a special family message and a brighter ledger ribbon.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <HearthActionButton>View Dreams</HearthActionButton>
                    <HearthActionButton tone="secondary">Send Seeds</HearthActionButton>
                </div>
            </CardBody>
        </Card>
    );
}

export function HearthQuestCard({
    quest,
}: {
    quest: HearthQuest;
}) {
    const statusTone = {
        pending: 'neutral',
        approved: 'warning',
        completed: 'success',
        rejected: 'danger',
    } as const;

    const stateBackground = {
        pending: 'bg-[rgba(251,248,241,0.88)]',
        approved: 'bg-[rgba(216,227,209,0.22)]',
        completed: 'bg-[rgba(110,139,99,0.12)]',
        rejected: 'bg-[rgba(180,106,90,0.1)]',
    } as const;

    return (
        <Card shadow="none" className={`rounded-[24px] border border-[rgba(79,107,82,0.12)] ${stateBackground[quest.status]}`}>
            <CardBody className="grid gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="grid gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <Chip
                                radius="full"
                                variant="flat"
                                className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.26)] px-1 text-[var(--hearth-text-secondary)]"
                            >
                                <span className="text-[11px] font-semibold">{quest.category}</span>
                            </Chip>
                            <HearthStatusChip label={quest.status} tone={statusTone[quest.status]} />
                        </div>
                        <h3 className="text-base font-semibold text-[var(--hearth-text-primary)]">
                            {quest.title}
                        </h3>
                    </div>
                    <HearthRewardChip>{quest.reward} Seeds</HearthRewardChip>
                </div>

                <p className="text-sm leading-6 text-[var(--hearth-text-secondary)]">
                    {quest.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    {quest.status === 'pending' ? (
                        <>
                            <HearthActionButton size="sm">Approve</HearthActionButton>
                            <HearthActionButton tone="secondary" size="sm">Reject</HearthActionButton>
                        </>
                    ) : null}
                    {quest.status === 'approved' ? (
                        <HearthActionButton tone="secondary" size="sm">
                            Awaiting Completion
                        </HearthActionButton>
                    ) : null}
                    {quest.status === 'completed' ? (
                        <HearthActionButton tone="ghost" size="sm">
                            Completed
                        </HearthActionButton>
                    ) : null}
                    {quest.status === 'rejected' ? (
                        <HearthActionButton tone="ghost" size="sm">
                            Regenerate Similar
                        </HearthActionButton>
                    ) : null}
                </div>
            </CardBody>
        </Card>
    );
}

export function HearthMomentCard({
    moment,
    childName,
}: {
    moment: HearthMoment;
    childName: string;
}) {
    return (
        <Card shadow="none" className="hearth-panel rounded-[26px]">
            <CardBody className="grid gap-4 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="grid gap-1">
                        <p className="hearth-kicker">Homestead Moment</p>
                        <h3 className="hearth-heading text-[1.45rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)]">
                            {moment.title}
                        </h3>
                    </div>
                    <HearthRewardChip>+{moment.rewardSeeds} Seeds</HearthRewardChip>
                </div>

                <p className="text-sm leading-6 text-[var(--hearth-text-secondary)]">
                    {moment.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.26)] text-[var(--hearth-text-secondary)]">
                        <span className="flex items-center gap-2 px-1 text-[11px] font-semibold">
                            <CalendarIcon className="size-3.5" />
                            {moment.duration}
                        </span>
                    </Chip>
                    <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.26)] text-[var(--hearth-text-secondary)]">
                        <span className="px-1 text-[11px] font-semibold">For {childName}</span>
                    </Chip>
                    <Chip radius="full" variant="flat" className="border border-[rgba(230,199,102,0.2)] bg-[rgba(230,199,102,0.18)] text-[var(--hearth-text-primary)]">
                        <span className="px-1 text-[11px] font-semibold">+{moment.rewardTokens} AI Tokens</span>
                    </Chip>
                </div>

                <div className="flex flex-wrap gap-3">
                    <HearthActionButton>Start Moment</HearthActionButton>
                    <HearthActionButton tone="secondary">Try Another</HearthActionButton>
                </div>
            </CardBody>
        </Card>
    );
}

export function HearthMascotBubble() {
    return (
        <Card shadow="none" className="rounded-[26px] border border-[rgba(216,183,170,0.3)] bg-[rgba(251,248,241,0.92)] shadow-[0_8px_24px_rgba(216,183,170,0.16)]">
            <CardBody className="grid gap-4 p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
                <Avatar
                    name="Lena"
                    className="bg-[rgba(216,183,170,0.26)] text-[var(--hearth-accent-wood)]"
                />
                <div className="grid gap-1">
                    <p className="hearth-kicker">Lena Says</p>
                    <p className="text-sm leading-6 text-[var(--hearth-text-secondary)]">
                        The homestead grows when families spend time together and celebrate small acts of care.
                    </p>
                </div>
                <HearthActionButton tone="secondary" size="sm" className="justify-self-start sm:justify-self-end">
                    <span className="flex items-center gap-2">
                        <VoiceIcon className="size-4" />
                        Play Voice
                    </span>
                </HearthActionButton>
            </CardBody>
        </Card>
    );
}

export function HearthBottomNav({
    active = 'home',
}: {
    active?: 'home' | 'adventures' | 'dreams' | 'moments';
}) {
    const items = [
        { key: 'home', label: 'Home', icon: HomeIcon },
        { key: 'adventures', label: 'Adventures', icon: CompassIcon },
        { key: 'dreams', label: 'Dreams', icon: TargetIcon },
        { key: 'moments', label: 'Moments', icon: CalendarIcon },
    ] as const;

    return (
        <div className="hearth-dock grid grid-cols-4 rounded-[28px] p-2">
            {items.map((item) => {
                const Icon = item.icon;
                const isActive = item.key === active;

                return (
                    <div
                        key={item.key}
                        className={`grid justify-items-center gap-1 rounded-[20px] px-2 py-3 text-center transition-colors ${
                            isActive
                                ? 'bg-[rgba(216,227,209,0.35)] text-[var(--hearth-text-primary)]'
                                : 'text-[var(--hearth-text-muted)]'
                        }`}
                    >
                        <Icon className="size-4" />
                        <span className="text-[11px] font-semibold">{item.label}</span>
                        <span className={`h-1.5 w-6 rounded-full ${isActive ? 'bg-[var(--hearth-accent-gold)]' : 'bg-transparent'}`} />
                    </div>
                );
            })}
        </div>
    );
}
