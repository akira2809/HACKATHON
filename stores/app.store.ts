/**
 * app.store.ts — Global app state (user role, theme, locale)
 *
 * Team convention: only ONE app-level store, keep it thin.
 * Feature state → feature-specific stores (quest, dream, etc.)
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type UserRole = 'child' | 'parent';

interface AppState {
  role: UserRole;
  locale: string;
  familyId: string | null;
  childId: string | null;
}

interface AppActions {
  setRole: (role: UserRole) => void;
  setLocale: (locale: string) => void;
  setFamilyId: (familyId: string | null) => void;
  setChildId: (childId: string | null) => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      role: 'child',
      locale: 'en',
      familyId: process.env.NEXT_PUBLIC_SUPABASE_FAMILY_ID ?? null,
      childId: process.env.NEXT_PUBLIC_SUPABASE_CHILD_ID ?? null,

      setRole: (role) => set({ role }, false, 'setRole'),
      setLocale: (locale) => set({ locale }, false, 'setLocale'),
      setFamilyId: (familyId) => set({ familyId }, false, 'setFamilyId'),
      setChildId: (childId) => set({ childId }, false, 'setChildId'),
    }),
    { name: 'app-store' }
  )
);
