'use client';

export type QueryOptions = {
    enabled?: boolean;
    sessionVersion?: number;
    refetchIntervalMs?: number;
};

export type QueryState<T> = {
    data: T;
    error: string | null;
    isLoaded: boolean;
    isLoading: boolean;
};

export function createQueryState<T>(data: T): QueryState<T> {
    return {
        data,
        error: null,
        isLoaded: false,
        isLoading: false,
    };
}

export function getTodayDateString() {
    return new Date().toISOString().slice(0, 10);
}

export function toErrorMessage(error: unknown, fallbackMessage: string) {
    return error instanceof Error ? error.message : fallbackMessage;
}

export function createMissingParameterError(parameterName: string) {
    return new Error(`${parameterName} is required.`);
}
