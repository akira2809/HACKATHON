'use client';

import { Card, CardBody } from '@heroui/react';
import { HearthActionButton } from '@/components/design-system/HearthPrimitives';

type ParentStateCardProps = {
    title: string;
    description: string;
    kicker?: string;
    actionLabel?: string;
    onAction?: () => void;
};

export function ParentStateCard({
    title,
    description,
    kicker = 'Supportive State',
    actionLabel,
    onAction,
}: ParentStateCardProps) {
    return (
        <Card shadow="none" className="hearth-panel rounded-[24px]">
            <CardBody className="grid gap-4 p-5">
                <div className="grid gap-2">
                    <p className="hearth-kicker">{kicker}</p>
                    <h3 className="hearth-heading text-[1.45rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)]">
                        {title}
                    </h3>
                    <p className="text-sm leading-6 text-[var(--hearth-text-secondary)]">
                        {description}
                    </p>
                </div>
                {actionLabel ? (
                    <HearthActionButton tone="secondary" onPress={onAction}>
                        {actionLabel}
                    </HearthActionButton>
                ) : null}
            </CardBody>
        </Card>
    );
}
