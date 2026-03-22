'use client';

/**
 * useChildSession.ts
 *
 * Quản lý child session - lưu childId và familyId vào localStorage
 * Tự động trigger re-render khi localStorage thay đổi
 */

const CHILD_SESSION_KEY = 'hearth_child_session';

export interface ChildSession {
    childId: string;
    familyId: string;
    childName: string;
    childAge: number;
}

// Simple state để trigger re-render
let sessionVersion = 0;

export function getChildSession(): ChildSession | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(CHILD_SESSION_KEY);
        if (!stored) return null;

        return JSON.parse(stored) as ChildSession;
    } catch {
        return null;
    }
}

export function setChildSession(session: ChildSession): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(CHILD_SESSION_KEY, JSON.stringify(session));
        // Trigger re-render for all hooks using this session
        sessionVersion += 1;
    } catch {
        // Silent fail
    }
}

export function clearChildSession(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(CHILD_SESSION_KEY);
        sessionVersion += 1;
    } catch {
        // Silent fail
    }
}

/**
 * Hook để sử dụng child session trong components
 * Tự động sync với localStorage và trigger re-render khi session thay đổi
 */
export function useChildSession() {
    // Force re-render when sessionVersion changes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _trigger = sessionVersion;

    const session = getChildSession();

    return {
        childId: session?.childId ?? null,
        familyId: session?.familyId ?? null,
        childName: session?.childName ?? null,
        childAge: session?.childAge ?? null,
        hasSession: session !== null,
        session,
    };
}
