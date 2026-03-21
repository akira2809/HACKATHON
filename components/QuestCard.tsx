'use client';

import { Card, CardBody, Chip, Skeleton } from '@heroui/react';
import type { ParentQuest } from '@/state/appState';
import { HearthActionButton, HearthStatusChip } from '@/components/design-system/HearthPrimitives';

type QuestCardProps = {
    quest?: ParentQuest;
    isLoading?: boolean;
    onApprove?: () => void;
    onReject?: () => void;
    onComplete?: () => void;
};

export function QuestCard({
    quest,
    isLoading = false,
    onApprove,
    onReject,
    onComplete,
}: QuestCardProps) {
    if (isLoading) {
        return (
            <Card shadow="none" className="rounded-[24px] border border-[rgba(79,107,82,0.12)] bg-[rgba(251,248,241,0.88)]">
                <CardBody className="grid gap-4 p-5">
                    <Skeleton className="h-6 w-28 rounded-full" />
                    <Skeleton className="h-6 w-44 rounded-full" />
                    <Skeleton className="h-16 rounded-[18px]" />
                    <Skeleton className="h-10 rounded-full" />
                </CardBody>
            </Card>
        );
    }

    if (!quest) {
        return null;
    }

    const stateBackground = {
        suggested: 'bg-[rgba(251,248,241,0.88)]',
        approved: 'bg-[rgba(216,227,209,0.22)] -translate-y-0.5',
        rejected: 'bg-[rgba(180,106,90,0.1)] opacity-80',
        completed: 'bg-[rgba(110,139,99,0.12)]',
    } as const;

    const statusTone = {
        suggested: 'neutral',
        approved: 'warning',
        rejected: 'danger',
        completed: 'success',
    } as const;

    return (
        <Card
            shadow="none"
            className={`rounded-[24px] border border-[rgba(79,107,82,0.12)] transition-all duration-200 ${stateBackground[quest.status]}`}
        >
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
                            {quest.status === 'completed' ? `Completed: ${quest.title}` : quest.title}
                        </h3>
                    </div>
                    <div className={`rounded-full border px-3 py-1 ${quest.status === 'approved' ? 'border-[rgba(230,199,102,0.28)] bg-[rgba(230,199,102,0.24)]' : 'border-[rgba(166,124,82,0.18)] bg-[rgba(230,199,102,0.16)]'}`}>
                        <span className="hearth-number text-sm font-semibold text-[var(--hearth-text-primary)]">
                            {quest.reward} Seeds
                        </span>
                    </div>
                </div>

                <p className="text-sm leading-6 text-[var(--hearth-text-secondary)]">
                    {quest.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    {quest.status === 'suggested' ? (
                        <>
                            <HearthActionButton size="sm" onPress={onApprove}>
                                Approve
                            </HearthActionButton>
                            <HearthActionButton size="sm" tone="secondary" onPress={onReject}>
                                Reject
                            </HearthActionButton>
                        </>
                    ) : null}
                    {quest.status === 'approved' ? (
                        <HearthActionButton size="sm" tone="secondary" onPress={onComplete}>
                            I Did It!
                        </HearthActionButton>
                    ) : null}
                    {quest.status === 'completed' ? (
                        <HearthActionButton size="sm" tone="ghost">
                            Progress Updated
                        </HearthActionButton>
                    ) : null}
                    {quest.status === 'rejected' ? (
                        <HearthActionButton size="sm" tone="ghost">
                            Softened For Later
                        </HearthActionButton>
                    ) : null}
                </div>
            </CardBody>
        </Card>
    );
}
