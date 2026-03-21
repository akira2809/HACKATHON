'use client';

import { Avatar, Card, CardBody } from '@heroui/react';
import { HearthActionButton, VoiceIcon } from '@/components/design-system/HearthPrimitives';

type MascotBubbleProps = {
    title?: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
};

export function MascotBubble({
    title = 'Lena Says',
    message,
    actionLabel = 'Play Voice',
    onAction,
}: MascotBubbleProps) {
    return (
        <Card shadow="none" className="rounded-[26px] border border-[rgba(216,183,170,0.3)] bg-[rgba(251,248,241,0.92)] shadow-[0_8px_24px_rgba(216,183,170,0.16)]">
            <CardBody className="grid gap-4 p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
                <Avatar
                    name="Lena"
                    className="bg-[rgba(216,183,170,0.26)] text-[var(--hearth-accent-wood)]"
                />
                <div className="grid gap-1">
                    <p className="hearth-kicker">{title}</p>
                    <p className="text-sm leading-6 text-[var(--hearth-text-secondary)]">
                        {message}
                    </p>
                </div>
                <HearthActionButton tone="secondary" size="sm" className="justify-self-start sm:justify-self-end" onPress={onAction}>
                    <span className="flex items-center gap-2">
                        <VoiceIcon className="size-4" />
                        {actionLabel}
                    </span>
                </HearthActionButton>
            </CardBody>
        </Card>
    );
}
