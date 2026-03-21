/**
 * quest.store.ts — Quest & Seed management
 *
 * Team convention:
 * - One store per domain
 * - Use `create` from zustand
 * - `persist` middleware → localStorage
 * - `devtools` middleware → Redux DevTools
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * Quest lifecycle:
 *
 *   pending ──► ongoing ──► completed
 *                │  ▲
 *                │  └── uncomplete (back to pending)
 *                │
 *                └──► failed (expired or manually)
 *
 * pending-parent ──► approved (parent approves child's work)
 */

export type QuestStatus =
  | 'pending'        // Not started
  | 'ongoing'       // In progress
  | 'pending-parent' // Waiting for parent approval
  | 'completed'     // Done, reward auto-claimed
  | 'failed'         // Expired or manually failed
  | 'approved';      // Parent approved

export type QuestCategory = 'nature' | 'learning' | 'exercise' | 'responsibility';

export interface Quest {
  id: string;
  title: string;
  category: QuestCategory;
  icon: string;
  reward: number;
  status: QuestStatus;
  startedAt?: number; // timestamp when "GO!" clicked
  expiredAt?: number;  // deadline timestamp
}

export interface QuestRecommendation {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  bgColor: string;
}

// ─── Config ─────────────────────────────────────────────────────────────────

/** Default duration before quest expires after starting */
export const DEFAULT_QUEST_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Returns today's date as 'YYYY-MM-DD' string */
function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Check if `last` is exactly one day before `today`.
 */
function isYesterday(last: string, today: string): boolean {
  const d1 = new Date(last);
  const d2 = new Date(today);
  const diffDays = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays === 1;
}

// ─── State ──────────────────────────────────────────────────────────────────

interface QuestState {
  seeds: number;
  level: number;
  xp: number;
  xpToNext: number;
  todayQuests: Quest[];
  showWelcome: boolean;
  showRecommendations: boolean;
  recommendations: QuestRecommendation[];
  streak: number;
  lastCompletedDate: string | null; // ISO date 'YYYY-MM-DD'
}

interface QuestActions {
  startQuest: (id: string, durationMs?: number) => void;
  completeQuest: (id: string) => void;
  uncompleteQuest: (id: string) => void;
  failQuest: (id: string) => void;
  approveQuest: (id: string) => void;
  checkExpiredQuests: () => void;
  setShowWelcome: (show: boolean) => void;
  setShowRecommendations: (show: boolean) => void;
  addSeeds: (amount: number) => void;
  deductSeeds: (amount: number) => void;
  addXp: (amount: number) => void;
  checkAndUpdateStreak: () => void;
  initFromData: (data: Partial<QuestState>) => void;
  resetTodayQuests: () => void;
}

type QuestStore = QuestState & QuestActions;

// ─── Initial Data ────────────────────────────────────────────────────────────

const INITIAL_QUESTS: Quest[] = [
  { id: 'q1', title: 'Water the Sunflowers', category: 'nature',    icon: 'water_drop',   reward: 10, status: 'pending' },
  { id: 'q2', title: 'Feed the Bunnies',     category: 'nature',    icon: 'pets',         reward: 15, status: 'pending' },
  { id: 'q3', title: 'Magic Dust Sorting',   category: 'learning', icon: 'auto_awesome', reward: 20, status: 'pending' },
];

const INITIAL_RECOMMENDATIONS: QuestRecommendation[] = [
  { id: 'r1', title: 'Plant a Magic Seed',    category: 'Nature Interest',   icon: 'potted_plant', color: 'text-[#CA8A04]', bgColor: 'bg-[#FEF08A]' },
  { id: 'r2', title: 'Build a Lego Fortress', category: 'Building Interest', icon: 'architecture',  color: 'text-[#E11D48]', bgColor: 'bg-[#FECDD3]' },
  { id: 'r3', title: 'Paint a Sunset',        category: 'Art Interest',       icon: 'palette',       color: 'text-[#0284C7]', bgColor: 'bg-[#BAE6FD]' },
];

// ─── Store ───────────────────────────────────────────────────────────────────

export const useQuestStore = create<QuestStore>()(
  devtools(
    persist(
      (set, get) => ({
        seeds: 425,
        level: 8,
        xp: 85,
        xpToNext: 100,
        todayQuests: INITIAL_QUESTS,
        showWelcome: false,
        showRecommendations: false,
        recommendations: INITIAL_RECOMMENDATIONS,
        streak: 0,
        lastCompletedDate: null,

        // ── Quest lifecycle ────────────────────────────────────────────────

        startQuest: (id, durationMs = DEFAULT_QUEST_DURATION_MS) =>
          set((state) => ({
            todayQuests: state.todayQuests.map((q) =>
              q.id === id
                ? { ...q, status: 'ongoing', startedAt: Date.now(), expiredAt: Date.now() + durationMs }
                : q
            ),
          })),

        completeQuest: (id) => {
          const state = get();
          const quest = state.todayQuests.find((q) => q.id === id);
          const today = todayStr();
          const last = state.lastCompletedDate;

          let newStreak: number;
          if (!last) {
            newStreak = 1;
          } else if (last === today) {
            newStreak = state.streak;
          } else if (isYesterday(last, today)) {
            newStreak = state.streak + 1;
          } else {
            newStreak = 1; // gap → reset
          }

          set({
            todayQuests: state.todayQuests.map((q) =>
              q.id === id ? { ...q, status: 'completed' } : q
            ),
            seeds: state.seeds + (quest?.reward ?? 0),
            lastCompletedDate: today,
            streak: newStreak,
          });
        },

        uncompleteQuest: (id) =>
          set((state) => ({
            todayQuests: state.todayQuests.map((q) =>
              q.id === id
                ? { ...q, status: 'pending', startedAt: undefined, expiredAt: undefined }
                : q
            ),
          })),

        failQuest: (id) =>
          set((state) => ({
            todayQuests: state.todayQuests.map((q) =>
              q.id === id
                ? { ...q, status: 'failed', startedAt: undefined, expiredAt: undefined }
                : q
            ),
          })),

        approveQuest: (id) =>
          set((state) => ({
            todayQuests: state.todayQuests.map((q) =>
              q.id === id ? { ...q, status: 'approved' } : q
            ),
          })),

        checkExpiredQuests: () =>
          set((state) => {
            const now = Date.now();
            const updated = state.todayQuests.map((q) =>
              q.status === 'ongoing' && q.expiredAt && now > q.expiredAt
                ? { ...q, status: 'failed' as const, startedAt: undefined, expiredAt: undefined }
                : q
            );
            const changed = updated.some((q, i) => q.status !== state.todayQuests[i].status);
            return changed ? { todayQuests: updated } : state;
          }),

        // ── Modals ────────────────────────────────────────────────────────

        setShowWelcome: (show) => set({ showWelcome: show }),
        setShowRecommendations: (show) => set({ showRecommendations: show }),

        // ── Seeds & XP ─────────────────────────────────────────────────────

        addSeeds: (amount) => set((state) => ({ seeds: state.seeds + amount })),
        deductSeeds: (amount) => set((state) => ({ seeds: Math.max(0, state.seeds - amount) })),

        addXp: (amount) =>
          set((state) => {
            const newXp = state.xp + amount;
            if (newXp >= state.xpToNext) {
              return { xp: newXp - state.xpToNext, level: state.level + 1 };
            }
            return { xp: newXp };
          }),

        // ── Streak ─────────────────────────────────────────────────────────

        /** Call on mount: if gap > 1 day since last completion → reset streak */
        checkAndUpdateStreak: () =>
          set((state) => {
            const today = todayStr();
            const last = state.lastCompletedDate;
            if (!last) return state;
            if (last === today) return state;
            if (isYesterday(last, today)) return state; // streak continues, no change
            // Gap > 1 day → reset
            return { streak: 0, lastCompletedDate: null };
          }),

        // ── Hydration ──────────────────────────────────────────────────────

        initFromData: (data) => set((state) => ({ ...state, ...data })),

        resetTodayQuests: () => set({ todayQuests: INITIAL_QUESTS }),
      }),
      {
        name: 'quest-storage',
        partialize: (state) => ({
          seeds: state.seeds,
          level: state.level,
          xp: state.xp,
          xpToNext: state.xpToNext,
          todayQuests: state.todayQuests,
          streak: state.streak,
          lastCompletedDate: state.lastCompletedDate,
        }),
      }
    ),
    { name: 'quest-store' }
  )
);
