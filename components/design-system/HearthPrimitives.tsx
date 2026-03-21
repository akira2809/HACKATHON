'use client';

import type { ComponentProps, ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { Button, Card, CardBody, Chip, Code, Divider, Input } from '@heroui/react';

type HearthActionButtonProps = ComponentProps<typeof Button> & {
    tone?: 'primary' | 'secondary' | 'ghost';
};

type HearthSectionProps = {
    kicker: string;
    title: string;
    description: string;
    children: ReactNode;
    aside?: ReactNode;
};

type HearthPaletteSwatchProps = {
    name: string;
    token: string;
    value: string;
    textClassName?: string;
};

const toneClasses: Record<NonNullable<HearthActionButtonProps['tone']>, string> = {
    primary: 'border-transparent bg-[var(--hearth-accent-gold)] text-[var(--hearth-text-primary)] shadow-[0_10px_20px_rgba(166,124,82,0.16)] hover:-translate-y-px',
    secondary: 'border-[color:var(--hearth-border-soft)] bg-[var(--hearth-bg-surface)] text-[var(--hearth-text-secondary)] hover:-translate-y-px',
    ghost: 'border-transparent bg-transparent text-[var(--hearth-text-secondary)] shadow-none hover:bg-[rgba(79,107,82,0.06)]',
};

export function HearthActionButton({
    tone = 'primary',
    className = '',
    ...props
}: HearthActionButtonProps) {
    return (
        <Button
            radius="full"
            className={`h-10 border px-4 text-sm font-semibold transition-transform duration-200 sm:h-11 sm:px-5 sm:text-[15px] ${toneClasses[tone]} ${className}`}
            {...props}
        />
    );
}

export function HearthRewardChip({
    children,
    className = '',
    startContent,
}: {
    children: ReactNode;
    className?: string;
    startContent?: ReactNode;
}) {
    return (
        <Chip
            radius="full"
            variant="flat"
            startContent={startContent}
            className={`border border-[rgba(166,124,82,0.2)] bg-[rgba(230,199,102,0.18)] px-1 text-[var(--hearth-text-primary)] ${className}`}
        >
            <span className="hearth-number text-[11px] font-semibold sm:text-xs">{children}</span>
        </Chip>
    );
}

const hearthCategoryMeta = {
    learning: {
        label: 'Learning',
        icon: 'lucide:book-open-text',
        chipClassName: 'border-[rgba(118,147,112,0.2)] bg-[rgba(216,227,209,0.34)] text-[var(--hearth-text-secondary)]',
        iconClassName: 'text-[var(--hearth-text-secondary)]',
    },
    exercise: {
        label: 'Exercise',
        icon: 'lucide:dumbbell',
        chipClassName: 'border-[rgba(100,136,148,0.24)] bg-[rgba(211,230,236,0.6)] text-[#4E6973]',
        iconClassName: 'text-[#4E6973]',
    },
    responsibility: {
        label: 'Responsibility',
        icon: 'lucide:clipboard-check',
        chipClassName: 'border-[rgba(166,124,82,0.2)] bg-[rgba(238,229,214,0.85)] text-[var(--hearth-accent-wood)]',
        iconClassName: 'text-[var(--hearth-accent-wood)]',
    },
    habit: {
        label: 'Habit',
        icon: 'lucide:sparkles',
        chipClassName: 'border-[rgba(214,174,95,0.24)] bg-[rgba(230,199,102,0.18)] text-[#8B6C25]',
        iconClassName: 'text-[#8B6C25]',
    },
    care: {
        label: 'Care',
        icon: 'lucide:heart-handshake',
        chipClassName: 'border-[rgba(216,183,170,0.26)] bg-[rgba(216,183,170,0.18)] text-[#8F675E]',
        iconClassName: 'text-[#8F675E]',
    },
    movement: {
        label: 'Movement',
        icon: 'lucide:footprints',
        chipClassName: 'border-[rgba(110,146,131,0.22)] bg-[rgba(217,234,224,0.54)] text-[#52715F]',
        iconClassName: 'text-[#52715F]',
    },
} as const;

export function getHearthCategoryMeta(category: string) {
    const normalizedCategory = category.trim().toLowerCase();

    return hearthCategoryMeta[normalizedCategory as keyof typeof hearthCategoryMeta]
        ?? hearthCategoryMeta.learning;
}

export function HearthCategoryChip({
    category,
    className = '',
}: {
    category: string;
    className?: string;
}) {
    const meta = getHearthCategoryMeta(category);

    return (
        <Chip
            radius="full"
            variant="flat"
            startContent={<Icon icon={meta.icon} className={`size-3.5 ${meta.iconClassName}`} />}
            className={`border px-1 ${meta.chipClassName} ${className}`}
        >
            <span className="px-0.5 text-[10px] font-semibold sm:text-[11px]">
                {meta.label}
            </span>
        </Chip>
    );
}

export function HearthStatusChip({
    label,
    tone,
}: {
    label: string;
    tone: 'neutral' | 'success' | 'warning' | 'danger';
}) {
    const toneMap = {
        neutral: 'border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]',
        success: 'border-[rgba(110,139,99,0.18)] bg-[rgba(110,139,99,0.14)] text-[var(--hearth-success)]',
        warning: 'border-[rgba(198,154,67,0.18)] bg-[rgba(198,154,67,0.16)] text-[var(--hearth-warning)]',
        danger: 'border-[rgba(180,106,90,0.18)] bg-[rgba(180,106,90,0.14)] text-[var(--hearth-danger)]',
    } as const;

    return (
        <Chip
            radius="full"
            variant="flat"
            className={`border px-1 ${toneMap[tone]}`}
        >
            <span className="text-[10px] font-semibold sm:text-[11px]">{label}</span>
        </Chip>
    );
}

export function HearthSection({
    kicker,
    title,
    description,
    children,
    aside,
}: HearthSectionProps) {
    return (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
            <div className="grid gap-5">
                <header className="grid gap-2">
                    <p className="hearth-kicker">{kicker}</p>
                    <h2 className="hearth-heading text-3xl font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)]">
                        {title}
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-[var(--hearth-text-secondary)]">
                        {description}
                    </p>
                </header>
                {children}
            </div>
            {aside ? <div className="grid gap-5">{aside}</div> : null}
        </section>
    );
}

export function HearthPanel({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <Card shadow="none" className={`hearth-panel rounded-[24px] ${className}`}>
            <CardBody className="p-5">{children}</CardBody>
        </Card>
    );
}

export function HearthPaletteSwatch({
    name,
    token,
    value,
    textClassName = '',
}: HearthPaletteSwatchProps) {
    return (
        <div className="grid gap-3 rounded-[22px] border border-[rgba(79,107,82,0.12)] bg-[rgba(251,248,241,0.76)] p-4">
            <div className={`h-24 rounded-[18px] border border-[rgba(79,107,82,0.08)] ${textClassName}`} style={{ backgroundColor: value }} />
            <div className="grid gap-1">
                <p className="text-sm font-semibold text-[var(--hearth-text-primary)]">{name}</p>
                <p className="hearth-number text-xs text-[var(--hearth-text-secondary)]">{value}</p>
                <Code className="w-fit rounded-full bg-[rgba(216,227,209,0.28)] px-2 py-1 text-[11px] text-[var(--hearth-text-secondary)]">
                    {token}
                </Code>
            </div>
        </div>
    );
}

export function HearthTypeSample({
    label,
    preview,
    className = '',
}: {
    label: string;
    preview: string;
    className?: string;
}) {
    return (
        <div className="grid gap-2 rounded-[20px] border border-[rgba(79,107,82,0.08)] bg-[rgba(251,248,241,0.8)] p-4">
            <p className="hearth-kicker">{label}</p>
            <p className={`text-[var(--hearth-text-primary)] ${className}`}>{preview}</p>
        </div>
    );
}

export function HearthTextInput({
    label,
    placeholder,
    description,
}: {
    label: string;
    placeholder: string;
    description?: string;
}) {
    return (
        <Input
            label={label}
            labelPlacement="outside"
            placeholder={placeholder}
            description={description}
            radius="lg"
            classNames={{
                label: 'text-sm font-medium text-[var(--hearth-text-secondary)]',
                inputWrapper:
                    'border border-[color:var(--hearth-border-soft)] bg-[var(--hearth-bg-surface)] shadow-none transition-shadow data-[hover=true]:border-[color:var(--hearth-border-strong)] group-data-[focus=true]:border-[color:var(--hearth-accent-gold)] group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-[rgba(230,199,102,0.2)]',
                input: 'text-[var(--hearth-text-primary)] placeholder:text-[var(--hearth-text-muted)]',
                description: 'text-xs text-[var(--hearth-text-muted)]',
            }}
        />
    );
}

export function HearthDivider() {
    return <Divider className="bg-[rgba(79,107,82,0.12)]" />;
}

export function HearthUsageBlock({
    title,
    code,
}: {
    title: string;
    code: string;
}) {
    return (
        <Card shadow="none" className="hearth-panel rounded-[24px]">
            <CardBody className="grid gap-3 p-5">
                <p className="text-sm font-semibold text-[var(--hearth-text-primary)]">{title}</p>
                <Code className="overflow-auto whitespace-pre rounded-[20px] bg-[rgba(47,52,44,0.94)] p-4 font-mono text-xs text-[#F6F0E5]">
                    {code}
                </Code>
            </CardBody>
        </Card>
    );
}

export function SeedIcon({
    className = 'size-4',
}: {
    className?: string;
}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M12.9 3.6C8.2 4.5 5 8.2 5 12.6c0 4.4 3.3 7.8 7.5 7.8 4.2 0 6.5-3.8 6.5-8.2 0-4.4-2.5-7.9-6.1-8.6Z"
                fill="currentColor"
            />
            <path
                d="M12 4.1c1.2 2.6 1.1 5-.2 7.4"
                stroke="rgba(47,52,44,0.35)"
                strokeLinecap="round"
                strokeWidth="1.4"
            />
        </svg>
    );
}

export function ChevronDownIcon({
    className = 'size-4',
}: {
    className?: string;
}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M6 9.5 12 15l6-5.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
            />
        </svg>
    );
}

export function VoiceIcon({
    className = 'size-4',
}: {
    className?: string;
}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M12 4.5a2.5 2.5 0 0 0-2.5 2.5v4.8a2.5 2.5 0 1 0 5 0V7A2.5 2.5 0 0 0 12 4.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M7.5 10.8a4.5 4.5 0 1 0 9 0M12 17v2.5M9.5 19.5h5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
            />
        </svg>
    );
}

export function HomeIcon({
    className = 'size-4',
}: {
    className?: string;
}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.8v-5.6H9.8V20H5a1 1 0 0 1-1-1v-8.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
    );
}

export function CompassIcon({
    className = 'size-4',
}: {
    className?: string;
}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
            <path d="m10 14 1.8-4.1L16 8l-1.9 4.2L10 14Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
    );
}

export function TargetIcon({
    className = 'size-4',
}: {
    className?: string;
}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.7" />
        </svg>
    );
}

export function CalendarIcon({
    className = 'size-4',
}: {
    className?: string;
}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <rect x="4" y="5.5" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" />
            <path d="M8 3.8v3.4M16 3.8v3.4M4.8 9.5h14.4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        </svg>
    );
}
