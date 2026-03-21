'use client';

import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { SeedIcon, ChevronDownIcon } from '@/components/design-system/HearthPrimitives';
import type { ParentChild } from '@/state/appState';

type ChildSelectorProps = {
    items: ParentChild[];
    selectedChildId: string;
    onSelect: (childId: string) => void;
    disabled?: boolean;
};

export function ChildSelector({
    items,
    selectedChildId,
    onSelect,
    disabled = false,
}: ChildSelectorProps) {
    const activeChild = items.find((child) => child.id === selectedChildId) ?? items[0];

    if (!activeChild) {
        return null;
    }

    const trigger = (
        <button
            className={`hearth-pill flex w-full items-center justify-between gap-2.5 rounded-[999px] px-2.5 py-2.5 text-left transition-transform duration-200 sm:gap-3 sm:px-3 sm:py-3 ${
                disabled ? 'cursor-not-allowed opacity-90' : 'hover:-translate-y-px'
            }`}
            disabled={disabled}
            type="button"
        >
            <span className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-[rgba(230,199,102,0.22)] text-[var(--hearth-accent-wood)] sm:size-10">
                    <SeedIcon className="size-3.5 sm:size-4" />
                </span>
                <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-[var(--hearth-text-primary)] sm:text-sm">
                        {activeChild.name}
                    </span>
                    <span className="block truncate text-[11px] text-[var(--hearth-text-secondary)] sm:text-xs">
                        {activeChild.age} yrs / {activeChild.goal?.title ?? 'No goal yet'}
                    </span>
                </span>
            </span>
            <span className="flex shrink-0 items-center gap-2 text-[var(--hearth-text-secondary)] sm:gap-3">
                <span className="hearth-number whitespace-nowrap text-[13px] font-semibold sm:text-sm">
                    {activeChild.seeds} Seeds
                </span>
                {disabled ? (
                    <span className="rounded-full bg-[rgba(216,227,209,0.35)] px-2 py-1 text-[10px] font-semibold text-[var(--hearth-text-secondary)] sm:text-[11px]">
                        Locked
                    </span>
                ) : (
                    <ChevronDownIcon className="size-3.5 sm:size-4" />
                )}
            </span>
        </button>
    );

    if (disabled || items.length <= 1) {
        return <div className="sticky top-4 z-20">{trigger}</div>;
    }

    return (
        <div className="sticky top-4 z-20">
            <Dropdown
                placement="bottom-start"
                offset={10}
                shouldBlockScroll={false}
                classNames={{
                    base: 'z-[220]',
                    content: 'min-w-[280px] rounded-[22px] border border-[rgba(79,107,82,0.12)] bg-[var(--hearth-bg-surface)] p-2 shadow-[0_18px_40px_rgba(47,52,44,0.18)] sm:min-w-[320px] sm:rounded-[24px]',
                }}
            >
                <DropdownTrigger>{trigger}</DropdownTrigger>
                <DropdownMenu
                    aria-label="Choose a child to track"
                    className="max-h-72 min-w-[280px] overflow-auto bg-transparent p-1 sm:min-w-[320px]"
                    onAction={(key) => onSelect(String(key))}
                >
                    {items.map((child) => (
                        <DropdownItem
                            key={child.id}
                            textValue={child.name}
                            className="rounded-[18px] px-2 py-2 opacity-100 data-[hover=true]:bg-[rgba(216,227,209,0.35)] data-[selectable=true]:focus:bg-[rgba(216,227,209,0.35)]"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                                    <Avatar
                                        name={child.name}
                                        className="size-9 bg-[rgba(216,227,209,0.8)] text-[var(--hearth-text-secondary)] sm:size-10"
                                    />
                                    <div className="grid min-w-0 gap-0.5">
                                        <p className="truncate text-[13px] font-semibold text-[var(--hearth-text-primary)] sm:text-sm">
                                            {child.name}
                                        </p>
                                        <p className="truncate text-[11px] text-[var(--hearth-text-secondary)] sm:text-xs">
                                            {child.age} yrs / {child.goal?.title ?? 'No goal yet'}
                                        </p>
                                    </div>
                                </div>
                                <span className="hearth-number shrink-0 whitespace-nowrap rounded-full border border-[rgba(166,124,82,0.2)] bg-[rgba(230,199,102,0.18)] px-2.5 py-1 text-[11px] font-semibold text-[var(--hearth-text-primary)] sm:px-3 sm:text-xs">
                                    {child.seeds} Seeds
                                </span>
                            </div>
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}
