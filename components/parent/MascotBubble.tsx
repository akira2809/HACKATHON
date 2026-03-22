'use client';

import { useState, type ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { Avatar, Card, CardBody } from '@heroui/react';
import { HearthActionButton, VoiceIcon } from '@/components/design-system/HearthPrimitives';
import { playLenaVoice } from '@/lib/voice-playback';

type MascotBubbleProps = {
    title?: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    actionIcon?: ReactNode;
    voiceText?: string;
};

export function MascotBubble({
    title = 'Lena Says',
    message,
    actionLabel = 'Play Voice',
    onAction,
    actionIcon,
    voiceText,
}: MascotBubbleProps) {
    const [isPlayingVoice, setIsPlayingVoice] = useState(false);
    const [voiceError, setVoiceError] = useState<string | null>(null);
    const resolvedActionIcon = actionIcon ?? (actionLabel === 'Play Voice' ? <VoiceIcon className="size-4" /> : null);
    const shouldUseVoiceAction = !onAction && actionLabel === 'Play Voice';
    const isActionEnabled = Boolean(onAction || shouldUseVoiceAction);
    const actionContent = isPlayingVoice
        ? {
            icon: <Icon icon="mingcute:loading-fill" className="size-4 animate-spin" />,
            label: 'Speaking...',
        }
        : {
            icon: resolvedActionIcon,
            label: actionLabel,
        };

    const handleAction = async () => {
        if (onAction) {
            onAction();
            return;
        }

        if (!shouldUseVoiceAction || isPlayingVoice) {
            return;
        }

        try {
            setVoiceError(null);
            setIsPlayingVoice(true);
            await playLenaVoice({
                text: voiceText ?? message,
            });
        } catch (error) {
            console.error('Voice playback failed:', error);
            setVoiceError('Lena could not speak just now. Please try again in a moment.');
        } finally {
            setIsPlayingVoice(false);
        }
    };

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
                    {isPlayingVoice && !voiceError ? (
                        <p className="text-xs leading-5 text-[var(--hearth-text-muted)]">
                            Lena is speaking now.
                        </p>
                    ) : null}
                    {voiceError ? (
                        <p className="text-xs leading-5 text-[var(--hearth-danger)]">
                            {voiceError}
                        </p>
                    ) : null}
                </div>
                <HearthActionButton
                    tone="secondary"
                    size="sm"
                    className="min-w-[152px] justify-self-start sm:justify-self-end"
                    isDisabled={!isActionEnabled || isPlayingVoice}
                    onPress={handleAction}
                >
                    <span className="flex items-center gap-2">
                        {actionContent.icon}
                        {actionContent.label}
                    </span>
                </HearthActionButton>
            </CardBody>
        </Card>
    );
}
