'use client';

import type { ReactNode } from 'react';
import { Chip } from '@heroui/react';
import type { ParentChild } from '@/state/appState';
import { ChildSelector } from './ChildSelector'; 
import { BottomNavigation, type BottomNavigationItem } from './BottomNavigation';

type AppShellProps = {
    title: string;
    description: string;
    familySeeds: number;
    children: ReactNode;
    childItems: ParentChild[];
    selectedChildId: string;
    onSelectChild: (childId: string) => void;
    childSelectorDisabled?: boolean;
    navItems: BottomNavigationItem[];
    notice?: ReactNode;
    isSwitching?: boolean;
};

export function AppShell({
    title,
    description,
    familySeeds,
    children,
    childItems,
    selectedChildId,
    onSelectChild,
    childSelectorDisabled = false,
    navItems,
    notice,
    isSwitching = false,
}: AppShellProps) {
    return (
        <main className="hearth-page">
            <div className="mx-auto grid min-h-screen max-w-[420px] gap-3 px-3 pb-24 pt-4 sm:max-w-[460px] sm:gap-4 sm:px-4 sm:pb-28 sm:pt-6">
                <header className="hearth-ledger-card rounded-[28px] p-4 sm:rounded-[30px] sm:p-5">
                    <div className="grid gap-2.5 sm:gap-3">
                        <p className="hearth-kicker">Lena&apos;s Homestead</p>
                        <div className="flex items-start justify-between gap-3 sm:gap-4">
                            <div className="grid min-w-0 gap-1.5 sm:gap-2">
                                <h1 className="hearth-heading text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--hearth-text-primary)] sm:text-[2.05rem]">
                                    {title}
                                </h1>
                                <p className="max-w-[190px] text-[13px] leading-5 text-[var(--hearth-text-secondary)] sm:max-w-[220px] sm:text-sm sm:leading-6">
                                    {description}
                                </p>
                            </div>
                            <Chip
                                radius="full"
                                variant="flat"
                                className="shrink-0 border border-[rgba(230,199,102,0.28)] bg-[rgba(230,199,102,0.18)] px-1 text-[var(--hearth-text-primary)]"
                            >
                                <span className="hearth-number text-[13px] font-semibold sm:text-sm">
                                    Family {familySeeds}
                                </span>
                            </Chip>
                        </div>
                    </div>
                </header>

                {childItems.length ? (
                    <ChildSelector
                        items={childItems}
                        selectedChildId={selectedChildId}
                        onSelect={onSelectChild}
                        disabled={childSelectorDisabled}
                    />
                ) : null}

                {notice}

                <div className={`grid gap-4 transition-opacity duration-200 ${isSwitching ? 'opacity-70' : 'opacity-100'}`}>
                    {children}
                </div>

                <div className="fixed bottom-3 left-1/2 z-30 w-full max-w-[420px] -translate-x-1/2 px-3 sm:bottom-4 sm:max-w-[460px] sm:px-4">
                    <BottomNavigation items={navItems} />
                </div>
            </div>
        </main>
    );
}
