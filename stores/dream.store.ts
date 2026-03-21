/**
 * dream.store.ts — Dream goal & seed history
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DreamGoal {
  id: string;
  title: string;
  subtitle?: string;
  current: number;
  goal: number;
  badge?: string;
  badgeColor?: string;
  message?: string;
}

export interface SeedHistoryItem {
  id: string;
  title: string;
  time: string;
  amount: number;
  icon: string;
  iconBg?: string;
  iconColor?: string;
}

// ─── State ───────────────────────────────────────────────────────────────────

interface DreamState {
  activeDream: DreamGoal | null;
  dreams: DreamGoal[];
  seedHistory: SeedHistoryItem[];
}

interface DreamActions {
  setActiveDream: (dream: DreamGoal | null) => void;
  addSeedToDream: (dreamId: string, amount: number) => void;
  addSeedHistory: (item: Omit<SeedHistoryItem, 'id'>) => void;
}

type DreamStore = DreamState & DreamActions;

// ─── Store ───────────────────────────────────────────────────────────────────

export const useDreamStore = create<DreamStore>()(
  devtools(
    (set) => ({
      activeDream: {
        id: 'd1',
        title: 'Birthday Gift',
        subtitle: 'New LEGO Set',
        current: 30,
        goal: 100,
        badge: 'BIG DREAM',
        badgeColor: 'bg-yellow-400',
        message: "Keep going! You're 30% there!",
      },
      dreams: [],
      seedHistory: [
        { id: 'h1', title: 'Cleaned Room',   time: 'Today, 4:30 PM', amount: 5,  icon: 'brush',      iconBg: 'bg-sky-100',     iconColor: 'text-sky-600'     },
        { id: 'h2', title: 'Read 20 Mins',   time: 'Yesterday',       amount: 10, icon: 'menu_book',  iconBg: 'bg-emerald-100',  iconColor: 'text-emerald-600' },
      ],

      setActiveDream: (dream) =>
        set({ activeDream: dream }, false, 'setActiveDream'),

      addSeedToDream: (dreamId, amount) =>
        set(
          (state) => ({
            activeDream:
              state.activeDream?.id === dreamId
                ? { ...state.activeDream, current: state.activeDream.current + amount }
                : state.activeDream,
          }),
          false,
          'addSeedToDream'
        ),

      addSeedHistory: (item) =>
        set(
          (state) => ({
            seedHistory: [
              { ...item, id: `h${Date.now()}` },
              ...state.seedHistory,
            ],
          }),
          false,
          'addSeedHistory'
        ),
    }),
    { name: 'dream-store' }
  )
);
