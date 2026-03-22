'use client';

import { Card, CardBody, Chip, Skeleton } from '@heroui/react';
import type { ParentQuest } from '@/state/appState';
import { HearthActionButton, HearthStatusChip } from '@/components/design-system/HearthPrimitives';

type QuestCardProps = {
    childName?: string;
    quest?: ParentQuest;
    isLoading?: boolean;
    onApprove?: () => void;
    onReject?: () => void;
    onComplete?: () => void;
};

function normalizeQuestStatus(status: ParentQuest['status']) {
    if (status === 'approved') {
        return 'ongoing' as const;
    }

    if (status === 'suggested') {
        return 'pending' as const;
    }

    return status;
}

function getStatusLabel(status: ReturnType<typeof normalizeQuestStatus>) {
    const labelMap = {
        completed: 'Completed',
        ongoing: 'In Progress',
        pending: 'Ready',
        rejected: 'Softened',
    } as const;

    return labelMap[status];
}

function formatQuestDate(value?: string | null) {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    return isToday
        ? 'Today'
        : new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
        }).format(date);
}

export function QuestCard({
    childName,
    quest,
    isLoading = false,
    onApprove,
    onReject,
    onComplete,
}: QuestCardProps) {
    if (isLoading) {
        return (
            <Card shadow="none" className="rounded-[24px] border border-[rgba(79,107,82,0.12)] bg-[rgba(251,248,241,0.88)]">
                <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                    <Skeleton className="h-5 w-24 rounded-full sm:h-6 sm:w-28" />
                    <Skeleton className="h-5 w-36 rounded-full sm:h-6 sm:w-44" />
                    <Skeleton className="h-14 rounded-[18px] sm:h-16" />
                    <Skeleton className="h-9 rounded-full sm:h-10" />
                </CardBody>
            </Card>
        );
    }

    if (!quest) {
        return null;
    }

    const normalizedStatus = normalizeQuestStatus(quest.status);
    const assignedLabel = formatQuestDate(quest.assignedDate);
    const completedLabel = formatQuestDate(quest.completedAt);
    const stateBackground = {
        pending: 'bg-[rgba(251,248,241,0.9)]',
        ongoing: 'bg-[rgba(216,227,209,0.22)] -translate-y-0.5',
        rejected: 'bg-[rgba(180,106,90,0.1)] opacity-80',
        completed: 'bg-[rgba(110,139,99,0.12)]',
    } as const;

    const statusTone = {
        pending: 'neutral',
        ongoing: 'warning',
        rejected: 'danger',
        completed: 'success',
    } as const;

    return (
        <Card
            shadow="none"
            className={`rounded-[24px] border border-[rgba(79,107,82,0.12)] transition-all duration-200 ${stateBackground[normalizedStatus]}`}
        >
            <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="grid min-w-0 flex-1 gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <Chip
                                radius="full"
                                variant="flat"
                                className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.26)] px-1 text-[var(--hearth-text-secondary)]"
                            >
                                <span className="text-[10px] font-semibold sm:text-[11px]">{quest.category}</span>
                            </Chip>
                            <HearthStatusChip label={getStatusLabel(normalizedStatus)} tone={statusTone[normalizedStatus]} />
                        </div>
                        <h3 className="text-[0.95rem] font-semibold leading-6 text-[var(--hearth-text-primary)] sm:text-base">
                            {quest.title}
                        </h3>
                    </div>
                    <div className={`shrink-0 self-start whitespace-nowrap rounded-full border px-2.5 py-1 sm:px-3 ${normalizedStatus === 'ongoing' ? 'border-[rgba(230,199,102,0.28)] bg-[rgba(230,199,102,0.24)]' : 'border-[rgba(166,124,82,0.18)] bg-[rgba(230,199,102,0.16)]'}`}>
                        <span className="hearth-number text-[13px] font-semibold text-[var(--hearth-text-primary)] sm:text-sm">
                            {quest.reward} Seeds
                        </span>
                    </div>
                </div>

                <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                    {quest.description}
                </p>

                {childName || assignedLabel || completedLabel ? (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--hearth-text-muted)]">
                        {childName ? <span>{childName}</span> : null}
                        {assignedLabel ? <span>Assigned {assignedLabel}</span> : null}
                        {normalizedStatus === 'completed' && completedLabel ? <span>Done {completedLabel}</span> : null}
                    </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                    {normalizedStatus === 'pending' && onApprove ? (
                        <>
                            <HearthActionButton size="sm" onPress={onApprove}>
                                Go
                            </HearthActionButton>
                            <HearthActionButton size="sm" tone="secondary" onPress={onReject}>
                                Reject
                            </HearthActionButton>
                        </>
                    ) : null}
                    {normalizedStatus === 'pending' && !onApprove ? (
                        <p className="text-[12px] leading-6 text-[var(--hearth-text-secondary)] sm:text-[13px]">
                            Waiting for {childName ?? 'the child'} to press Go from the child side.
                        </p>
                    ) : null}
                    {normalizedStatus === 'ongoing' ? (
                        <HearthActionButton size="sm" tone="secondary" onPress={onComplete}>
                            Done
                        </HearthActionButton>
                    ) : null}
                    {normalizedStatus === 'completed' ? (
                        <HearthActionButton size="sm" tone="ghost">
                            Progress Updated
                        </HearthActionButton>
                    ) : null}
                    {normalizedStatus === 'rejected' ? (
                        <HearthActionButton size="sm" tone="ghost">
                            Softened For Later
                        </HearthActionButton>
                    ) : null}
                </div>
            </CardBody>
        </Card>
    );
}
