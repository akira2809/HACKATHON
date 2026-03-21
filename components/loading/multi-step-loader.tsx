'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { LoadingStep } from '@/state/global-loading-state';

type MultiStepLoaderProps = {
    duration?: number;
    helperText?: string;
    loading: boolean;
    loadingStates: LoadingStep[];
    loop?: boolean;
};

export function MultiStepLoader({
    duration = 1800,
    helperText = 'Please wait while the homestead board updates.',
    loading,
    loadingStates,
    loop = true,
}: MultiStepLoaderProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const safeLoadingStates = loadingStates.length
        ? loadingStates
        : [{ text: 'Preparing the next homestead step' }];

    useEffect(() => {
        if (!loading) {
            return;
        }

        const interval = window.setInterval(() => {
            setCurrentStep((previousStep) => {
                if (loop) {
                    return (previousStep + 1) % safeLoadingStates.length;
                }

                return Math.min(previousStep + 1, safeLoadingStates.length - 1);
            });
        }, duration);

        return () => window.clearInterval(interval);
    }, [duration, loading, loop, safeLoadingStates.length]);

    const completionPercent = Math.round(((currentStep + 1) / safeLoadingStates.length) * 100);

    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div
                    animate={{ opacity: 1 }}
                    aria-live="polite"
                    className="fixed inset-0 z-[140] flex items-center justify-center bg-[rgba(246,240,229,0.82)] px-5 backdrop-blur-sm"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                >
                    <div className="hearth-ledger-card w-full max-w-[22rem] rounded-[30px] px-6 py-7 sm:max-w-[24rem] sm:px-7 sm:py-8">
                        <div className="grid gap-6 text-center">
                            <motion.div
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center justify-center"
                                exit={{ opacity: 0, scale: 0.92 }}
                                initial={{ opacity: 0, scale: 0.92 }}
                                key={`loader-icon-${currentStep}`}
                                transition={{ duration: 0.24, ease: 'easeOut' }}
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    className="relative"
                                    transition={{ duration: 2.1, ease: 'linear', repeat: Infinity }}
                                >
                                    <div className="absolute inset-0 rounded-full bg-[rgba(230,199,102,0.18)] blur-lg" />
                                    <div className="relative flex size-16 items-center justify-center rounded-full border border-[rgba(166,124,82,0.18)] bg-[rgba(251,248,241,0.9)] text-[var(--hearth-accent-wood)] shadow-[0_12px_28px_rgba(79,107,82,0.12)]">
                                        <Icon icon="lucide:loader-circle" className="size-8" />
                                    </div>
                                </motion.div>
                            </motion.div>

                            <div className="grid gap-4">
                                <motion.div
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid gap-2"
                                    exit={{ opacity: 0, y: -8 }}
                                    initial={{ opacity: 0, y: 8 }}
                                    key={`loader-step-${currentStep}`}
                                    transition={{ duration: 0.24, ease: 'easeOut' }}
                                >
                                    <p className="hearth-kicker">Loading</p>
                                    <h3 className="hearth-heading text-[1.3rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)]">
                                        {safeLoadingStates[currentStep]?.text}
                                    </h3>
                                </motion.div>

                                <div className="grid gap-2">
                                    <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(216,227,209,0.42)]">
                                        <motion.div
                                            animate={{ width: `${completionPercent}%` }}
                                            className="h-full rounded-full bg-[linear-gradient(90deg,var(--hearth-accent-gold)_0%,rgba(166,124,82,0.9)_100%)]"
                                            initial={{ width: 0 }}
                                            transition={{ duration: duration / 1000, ease: 'easeOut' }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-[var(--hearth-text-muted)] sm:text-xs">
                                        <p>
                                            Step {currentStep + 1} of {safeLoadingStates.length}
                                        </p>
                                        <p>{completionPercent}%</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2">
                                    {safeLoadingStates.map((step, index) => {
                                        const isCompleted = index < currentStep;
                                        const isActive = index === currentStep;

                                        return (
                                            <motion.div
                                                animate={{
                                                    opacity: isCompleted || isActive ? 1 : 0.36,
                                                    scale: isActive ? 1 : 0.92,
                                                    width: isActive ? 26 : 10,
                                                }}
                                                className={`flex h-2.5 items-center justify-center overflow-hidden rounded-full ${
                                                    isCompleted
                                                        ? 'bg-[var(--hearth-success)]'
                                                        : 'bg-[var(--hearth-accent-gold)]'
                                                }`}
                                                key={`${step.text}-${index}`}
                                                transition={{ duration: 0.18, ease: 'easeOut' }}
                                            >
                                                {isCompleted ? (
                                                    <Icon
                                                        icon="lucide:check"
                                                        className="size-2 text-[var(--hearth-bg-surface)]"
                                                    />
                                                ) : null}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            <p className="text-xs leading-5 text-[var(--hearth-text-muted)]">
                                {helperText}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
