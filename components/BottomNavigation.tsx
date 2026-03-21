'use client';

import type { ReactNode } from 'react';

export type BottomNavigationItem = {
    key: string;
    label: string;
    icon: ReactNode;
    active: boolean;
    onPress: () => void;
    disabled?: boolean;
};

export function BottomNavigation({
    items,
}: {
    items: BottomNavigationItem[];
}) {
    return (
        <nav className="hearth-dock grid grid-cols-4 rounded-[28px] p-2">
            {items.map((item) => (
                <button
                    key={item.key}
                    className={`grid justify-items-center gap-1 rounded-[20px] px-2 py-3 text-center transition-colors ${
                        item.active
                            ? 'bg-[rgba(216,227,209,0.35)] text-[var(--hearth-text-primary)]'
                            : 'text-[var(--hearth-text-muted)]'
                    } ${item.disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                    disabled={item.disabled}
                    onClick={item.onPress}
                    type="button"
                >
                    {item.icon}
                    <span className="text-[11px] font-semibold">{item.label}</span>
                    <span className={`h-1.5 w-6 rounded-full ${item.active ? 'bg-[var(--hearth-accent-gold)]' : 'bg-transparent'}`} />
                </button>
            ))}
        </nav>
    );
}
