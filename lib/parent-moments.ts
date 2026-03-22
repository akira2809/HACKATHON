export const FAMILY_MOMENT_DURATION_MINUTES = 20;
export const FAMILY_MOMENT_REWARD_SEEDS = 20;
export const DEFAULT_MOMENT_START_TIME = '18:30';
export const DEFAULT_MOMENT_END_TIME = '19:30';

export function toIsoFromTime(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 0, minutes || 0, 0, 0);
    return date.toISOString();
}

export function toTimeInputValue(value?: string | null) {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function formatTimeLabel(value?: string | null) {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
}

export function formatTimeWindow(startTime?: string | null, endTime?: string | null) {
    const startLabel = formatTimeLabel(startTime);
    const endLabel = formatTimeLabel(endTime);

    if (!startLabel || !endLabel) {
        return null;
    }

    return `${startLabel} - ${endLabel}`;
}

export function getActivityLocationLabel(locationName?: string | null) {
    return locationName?.trim() || 'Home';
}

export function getActivitySupportCopy(childName: string, activityTitle: string) {
    return `${childName} asked for "${activityTitle}". Set a time window, keep the setup light, and let the activity stay easy to begin.`;
}
