'use client';

import { Progress } from '@heroui/react';

type ProgressBarProps = {
    label: string;
    value: number;
    maxValue: number;
    valueLabel?: string;
    milestone?: number;
    isLoading?: boolean;
};

export function ProgressBar({
    label,
    value,
    maxValue,
    valueLabel,
    milestone,
    isLoading = false,
}: ProgressBarProps) {
    const reachedMilestone = typeof milestone === 'number' && value >= milestone;

    return (
        <div className="grid gap-2.5 sm:gap-3">
            <div className="flex items-center justify-between gap-2.5 sm:gap-3">
                <p className="text-[13px] text-[var(--hearth-text-secondary)] sm:text-sm">{label}</p>
                <p className="hearth-number text-[13px] font-semibold text-[var(--hearth-text-primary)] sm:text-sm">
                    {valueLabel ?? `${value} / ${maxValue}`}
                </p>
            </div>
            <Progress
                aria-label={label}
                classNames={{
                    base: 'max-w-full',
                    track: 'h-2.5 rounded-full border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.28)] sm:h-3',
                    indicator: `transition-[width,background-color] duration-[800ms] ease-out ${
                        reachedMilestone
                            ? 'bg-[linear-gradient(90deg,var(--hearth-accent-gold),#d7bb77)]'
                            : 'bg-[linear-gradient(90deg,#d1b76a,var(--hearth-accent-gold))]'
                    }`,
                }}
                isIndeterminate={isLoading}
                maxValue={maxValue}
                value={value}
            />
            {typeof milestone === 'number' ? (
                <p className={`text-[11px] leading-5 sm:text-xs sm:leading-6 ${reachedMilestone ? 'text-[var(--hearth-accent-wood)]' : 'text-[var(--hearth-text-muted)]'}`}>
                    {reachedMilestone
                        ? `Milestone reached at ${milestone} seeds.`
                        : `Next milestone at ${milestone} seeds.`}
                </p>
            ) : null}
        </div>
    );
}
