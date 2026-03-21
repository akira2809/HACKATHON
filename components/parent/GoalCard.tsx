'use client';

import { Card, CardBody, Skeleton } from '@heroui/react';
import type { ParentGoal } from '@/state/appState';
import { HearthActionButton } from '@/components/design-system/HearthPrimitives';
import { ProgressBar } from './ProgressBar';

type GoalCardProps = {
    childName: string;
    seeds: number;
    goal: ParentGoal | null;
    isLoading?: boolean;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    primaryActionLabel?: string;
    secondaryActionLabel?: string;
    emptyActionLabel?: string;
};

export function GoalCard({
    childName,
    seeds,
    goal,
    isLoading = false,
    onPrimaryAction,
    onSecondaryAction,
    primaryActionLabel = 'View Dreams',
    secondaryActionLabel = 'Send Seeds',
    emptyActionLabel = 'Create First Goal',
}: GoalCardProps) {
    if (isLoading) {
        return (
            <Card shadow="none" className="hearth-ledger-card rounded-[28px]">
                <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                    <Skeleton className="h-4 w-28 rounded-full" />
                    <Skeleton className="h-10 w-40 rounded-[18px] sm:h-12 sm:w-44" />
                    <Skeleton className="h-14 rounded-[20px] sm:h-16" />
                    <Skeleton className="h-10 rounded-full sm:h-12" />
                </CardBody>
            </Card>
        );
    }

    if (!goal) {
        return (
            <Card shadow="none" className="hearth-ledger-card rounded-[28px]">
                <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                    <div className="grid gap-2">
                        <p className="hearth-kicker">Current Goal</p>
                        <h3 className="hearth-heading text-[1.45rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.65rem]">
                            No goal yet for {childName}
                        </h3>
                        <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                            A shared goal helps daily quests feel meaningful. Start with something small and warm.
                        </p>
                    </div>
                    <div className="hearth-subtle-panel rounded-[22px] p-3.5 sm:p-4">
                        <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                            Try a simple family goal like a gift, museum visit, or art supply reward.
                        </p>
                    </div>
                    {onPrimaryAction ? (
                        <div className="flex flex-wrap gap-3">
                            <HearthActionButton tone="secondary" onPress={onPrimaryAction}>
                                {emptyActionLabel}
                            </HearthActionButton>
                        </div>
                    ) : null}
                </CardBody>
            </Card>
        );
    }

    return (
        <Card shadow="none" className="hearth-ledger-card rounded-[28px]">
            <CardBody className="grid gap-4 p-4 sm:gap-5 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
                    <div className="grid min-w-0 flex-1 gap-1">
                        <p className="hearth-kicker">Current Goal</p>
                        <h3 className="hearth-heading text-[1.5rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.7rem]">
                            {goal.title}
                        </h3>
                        <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                            Small daily wins help this goal feel shared and meaningful.
                        </p>
                    </div>
                    <div className="shrink-0 whitespace-nowrap rounded-full border border-[rgba(230,199,102,0.28)] bg-[rgba(230,199,102,0.18)] px-2.5 py-1 sm:px-3">
                        <span className="hearth-number text-[13px] font-semibold text-[var(--hearth-text-primary)] sm:text-sm">
                            {seeds} / {goal.target}
                        </span>
                    </div>
                </div>

                <ProgressBar
                    label="Seeds collected"
                    milestone={goal.milestone}
                    maxValue={goal.target}
                    value={Math.min(seeds, goal.target)}
                    valueLabel={`${seeds} / ${goal.target} seeds`}
                />

                <div className="hearth-subtle-panel rounded-[22px] p-3.5 sm:p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--hearth-text-muted)]">
                        Milestone Note
                    </p>
                    <p className="mt-2 text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                        {goal.note}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <HearthActionButton onPress={onPrimaryAction}>{primaryActionLabel}</HearthActionButton>
                    <HearthActionButton tone="secondary" onPress={onSecondaryAction}>
                        {secondaryActionLabel}
                    </HearthActionButton>
                </div>
            </CardBody>
        </Card>
    );
}
