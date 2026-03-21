'use client';

import { Card, CardBody, Chip, Skeleton } from '@heroui/react';
import type { ParentMoment } from '@/state/appState';
import { HearthActionButton } from '@/components/design-system/HearthPrimitives';

type MomentCardProps = {
    childName: string;
    moment: ParentMoment | null;
    state?: 'ready' | 'empty' | 'error';
    errorMessage?: string;
    isLoading?: boolean;
    primaryLabel?: string;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
};

export function MomentCard({
    childName,
    moment,
    state = 'ready',
    errorMessage,
    isLoading = false,
    primaryLabel = 'Start Moment',
    onPrimaryAction,
    onSecondaryAction,
}: MomentCardProps) {
    if (isLoading) {
        return (
            <Card shadow="none" className="hearth-panel rounded-[26px]">
                <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                    <Skeleton className="h-4 w-24 rounded-full" />
                    <Skeleton className="h-7 w-40 rounded-full" />
                    <Skeleton className="h-14 rounded-[20px] sm:h-16" />
                    <Skeleton className="h-10 rounded-full sm:h-12" />
                </CardBody>
            </Card>
        );
    }

    if (state === 'error') {
        return (
            <Card shadow="none" className="rounded-[26px] border border-[rgba(180,106,90,0.16)] bg-[rgba(251,248,241,0.92)]">
                <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                    <div className="grid gap-2">
                        <p className="hearth-kicker">Homestead Moment</p>
                        <h3 className="hearth-heading text-[1.3rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.45rem]">
                            Moment suggestion unavailable
                        </h3>
                        <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                            {errorMessage ?? 'The planner could not prepare a shared activity right now.'}
                        </p>
                    </div>
                    <HearthActionButton tone="secondary" onPress={onSecondaryAction}>
                        Try Again Gently
                    </HearthActionButton>
                </CardBody>
            </Card>
        );
    }

    if (state === 'empty' || !moment) {
        return (
            <Card shadow="none" className="hearth-panel rounded-[26px]">
                <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                    <div className="grid gap-2">
                        <p className="hearth-kicker">Homestead Moment</p>
                        <h3 className="hearth-heading text-[1.3rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.45rem]">
                            No shared moment planned yet
                        </h3>
                        <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                            Start with one calm 15 to 20 minute activity for {childName}.
                        </p>
                    </div>
                    <HearthActionButton onPress={onSecondaryAction}>Suggest Activity</HearthActionButton>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card shadow="none" className="hearth-panel rounded-[26px]">
            <CardBody className="grid gap-3 p-4 sm:gap-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
                    <div className="grid min-w-0 flex-1 gap-1">
                        <p className="hearth-kicker">Homestead Moment</p>
                        <h3 className="hearth-heading text-[1.3rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.45rem]">
                            {moment.title}
                        </h3>
                    </div>
                    <div className="shrink-0 whitespace-nowrap rounded-full border border-[rgba(230,199,102,0.28)] bg-[rgba(230,199,102,0.18)] px-2.5 py-1 sm:px-3">
                        <span className="hearth-number text-[13px] font-semibold text-[var(--hearth-text-primary)] sm:text-sm">
                            +{moment.rewardSeeds} Seeds
                        </span>
                    </div>
                </div>

                <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                    {moment.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.26)] text-[var(--hearth-text-secondary)]">
                        <span className="px-1 text-[10px] font-semibold sm:text-[11px]">{moment.duration}</span>
                    </Chip>
                    <Chip radius="full" variant="flat" className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.26)] text-[var(--hearth-text-secondary)]">
                        <span className="px-1 text-[10px] font-semibold sm:text-[11px]">For {childName}</span>
                    </Chip>
                    <Chip radius="full" variant="flat" className="border border-[rgba(230,199,102,0.2)] bg-[rgba(230,199,102,0.18)] text-[var(--hearth-text-primary)]">
                        <span className="px-1 text-[10px] font-semibold sm:text-[11px]">+{moment.rewardTokens} AI Tokens</span>
                    </Chip>
                </div>

                <div className="flex flex-wrap gap-3">
                    <HearthActionButton onPress={onPrimaryAction}>{primaryLabel}</HearthActionButton>
                    <HearthActionButton tone="secondary" onPress={onSecondaryAction}>
                        Try Another
                    </HearthActionButton>
                </div>
            </CardBody>
        </Card>
    );
}
