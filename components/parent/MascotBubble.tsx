'use client';

import type { ReactNode } from 'react';
import { Avatar, Card, CardBody } from '@heroui/react';
import { HearthActionButton, VoiceIcon } from '@/components/design-system/HearthPrimitives';

type MascotBubbleProps = {
    title?: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    actionIcon?: ReactNode;
};

export function MascotBubble({
    title = 'Lena Says',
    message,
    actionLabel = 'Play Voice',
    onAction,
    actionIcon,
}: MascotBubbleProps) {
    const resolvedActionIcon = actionIcon ?? (actionLabel === 'Play Voice' ? <VoiceIcon className="size-4" /> : null);

    return (
        <Card shadow="none" className="rounded-[26px] border border-[rgba(216,183,170,0.3)] bg-[rgba(251,248,241,0.92)] shadow-[0_8px_24px_rgba(216,183,170,0.16)]">
            <CardBody className="grid gap-3 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:p-5">
                <Avatar
                    name="Lena"
                    className="size-9 bg-[rgba(216,183,170,0.26)] text-[var(--hearth-accent-wood)] sm:size-10"
                />
                <div className="grid gap-1">
                    <p className="hearth-kicker">{title}</p>
                    <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                        {message}
                    </p>
                </div>
                <HearthActionButton tone="secondary" size="sm" className="justify-self-start sm:justify-self-end" onPress={onAction}>
                    <span className="flex items-center gap-2">
                        {resolvedActionIcon}
                        {actionLabel}
                    </span>
                </HearthActionButton>
            </CardBody>
        </Card>
    );
}
