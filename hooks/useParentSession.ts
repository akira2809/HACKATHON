'use client';

/**
 * useParentSession.ts
 *
 * Quản lý parent session - lưu parentId và familyId vào localStorage
 * Tự động trigger re-render khi localStorage thay đổi
 */

const PARENT_SESSION_KEY = 'hearth_parent_session';

export interface ParentSession {
    parentId: string;
    familyId: string;
    parentName: string;
    familyName: string;
}

// Simple state để trigger re-render
let sessionVersion = 0;

export function getParentSession(): ParentSession | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(PARENT_SESSION_KEY);
        if (!stored) return null;

        return JSON.parse(stored) as ParentSession;
    } catch {
        return null;
    }
}

export function setParentSession(session: ParentSession): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(PARENT_SESSION_KEY, JSON.stringify(session));
        // Trigger re-render for all hooks using this session
        sessionVersion += 1;
    } catch {
        // Silent fail
    }
}

export function clearParentSession(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(PARENT_SESSION_KEY);
        sessionVersion += 1;
    } catch {
        // Silent fail
    }
}

/**
 * Hook để sử dụng parent session trong components
 * Tự động sync với localStorage và trigger re-render khi session thay đổi
 */
export function useParentSession() {
    // Force re-render when sessionVersion changes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _trigger = sessionVersion;

    const session = getParentSession();

    return {
        parentId: session?.parentId ?? null,
        familyId: session?.familyId ?? null,
        parentName: session?.parentName ?? null,
        familyName: session?.familyName ?? null,
        hasSession: session !== null,
        session,
    };
}
