'use client';

import type { ReactNode } from 'react';

export type BottomNavigationItem = {
    key: string;
    label: string;
    icon: ReactNode;
    active: boolean;
    onPress: () => void;
    disabled?: boolean;
    showNotificationDot?: boolean;
};

export function BottomNavigation({
    items,
}: {
    items: BottomNavigationItem[];
}) {
    return (
        <nav className="hearth-dock grid grid-cols-4 rounded-[24px] p-1.5 sm:rounded-[28px] sm:p-2">
            {items.map((item) => (
                <button
                    key={item.key}
                    className={`grid justify-items-center gap-0.5 rounded-[18px] px-1.5 py-2.5 text-center transition-colors sm:gap-1 sm:rounded-[20px] sm:px-2 sm:py-3 ${
                        item.active
                            ? 'bg-[rgba(216,227,209,0.35)] text-[var(--hearth-text-primary)]'
                            : 'text-[var(--hearth-text-muted)]'
                    } ${item.disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                    disabled={item.disabled}
                    onClick={item.onPress}
                    type="button"
                >
                    <span className="relative inline-flex">
                        {item.icon}
                        {item.showNotificationDot ? (
                            <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-[#C65A47] ring-2 ring-[var(--hearth-bg-surface)]" />
                        ) : null}
                    </span>
                    <span className="text-[10px] font-semibold sm:text-[11px]">{item.label}</span>
                    <span className={`h-1 w-5 rounded-full sm:h-1.5 sm:w-6 ${item.active ? 'bg-[var(--hearth-accent-gold)]' : 'bg-transparent'}`} />
                </button>
            ))}
        </nav>
    );
}
