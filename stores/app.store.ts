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
}

interface AppActions {
  setRole: (role: UserRole) => void;
  setLocale: (locale: string) => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      role: 'child',
      locale: 'en',

      setRole: (role) => set({ role }, false, 'setRole'),
      setLocale: (locale) => set({ locale }, false, 'setLocale'),
    }),
    { name: 'app-store' }
  )
);
