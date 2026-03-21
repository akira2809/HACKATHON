/**
 * moment.store.ts — Family Moments management
 *
 * Features:
 * - Active moment card
 * - Proximity check (geolocation)
 * - Moment timer (countdown)
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MomentActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  badge?: string;
  badgeColor?: string;
  xpReward: number;
  seedsReward: number;
  participants: Array<{ role: 'parent' | 'child'; name?: string }>;
  status: 'active' | 'completed' | 'upcoming';
}

export interface UpcomingActivity {
  id: string;
  icon: string;
  label: string;
  duration: string;
  locked: boolean;
  requiredLevel?: number;
}

export interface RecentMemory {
  id: string;
  icon: string;
  label: string;
  color: string;
}

export type ProximityStatus = 'idle' | 'checking' | 'confirmed' | 'far' | 'denied' | 'error';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

// ─── State ───────────────────────────────────────────────────────────────────

interface MomentState {
  activeMoment: MomentActivity | null;
  upcomingActivities: UpcomingActivity[];
  recentMemories: RecentMemory[];
  momentXp: number;
  momentLevel: number;
  xpToNext: number;

  // Proximity
  proximityStatus: ProximityStatus;
  proximityDistance: number | null; // km
  proximityError: string | null;

  // Timer
  timerStatus: TimerStatus;
  timerRemaining: number; // seconds remaining
  timerTotal: number;     // total seconds for this moment
  timerStartedAt: number | null; // Date.now() when started
}

interface MomentActions {
  setActiveMoment: (moment: MomentActivity | null) => void;
  completeMoment: (id: string) => void;
  addRecentMemory: (memory: Omit<RecentMemory, 'id'>) => void;
  addXp: (amount: number) => void;

  // Proximity
  setProximityStatus: (status: ProximityStatus, distance?: number, error?: string) => void;
  resetProximity: () => void;

  // Timer
  startTimer: (durationSeconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  tickTimer: () => void;     // decrement 1 second — call via setInterval
  finishTimer: (id: string) => void;
  resetTimer: () => void;

  initFromData: (data: Partial<MomentState>) => void;
}

type MomentStore = MomentState & MomentActions;

// ─── Initial Data ────────────────────────────────────────────────────────────

const INITIAL_MOMENT: MomentActivity = {
  id: 'm1',
  title: 'Cozy Reading',
  description:
    'Gather your kin in the softest nook. Open the ancient scrolls of lore and let stories take root in your homestead.',
  time: '20:00',
  badge: 'Active Suggestion',
  badgeColor: 'bg-[#FACC15]',
  xpReward: 50,
  seedsReward: 15,
  participants: [
    { role: 'parent', name: 'Parent' },
    { role: 'child', name: 'Emma' },
  ],
  status: 'active',
};

const INITIAL_UPCOMING: UpcomingActivity[] = [
  { id: 'a1', icon: 'draw',         label: 'Quick Sketch',  duration: '10 MIN', locked: false },
  { id: 'a2', icon: 'lock',         label: 'Tea Ceremony',  duration: 'LVL 15', locked: true,  requiredLevel: 15 },
  { id: 'a3', icon: 'music_note',   label: 'Humming Solo',  duration: '5 MIN',  locked: false },
  { id: 'a4', icon: 'restaurant',  label: 'Dough Prep',    duration: '15 MIN', locked: false },
];

const INITIAL_MEMORIES: RecentMemory[] = [
  { id: 'rm1', icon: 'eco',           label: 'Garden Planting', color: 'text-[#34D399]' },
  { id: 'rm2', icon: 'auto_awesome', label: 'Star Gazing',    color: 'text-[#F472B6]' },
  { id: 'rm3', icon: 'outdoor_grill', label: "S'mores Night",  color: 'text-[#38BDF8]' },
];

// ─── Store ───────────────────────────────────────────────────────────────────

export const useMomentStore = create<MomentStore>()(
  devtools(
    persist(
      (set) => ({
        activeMoment: INITIAL_MOMENT,
        upcomingActivities: INITIAL_UPCOMING,
        recentMemories: INITIAL_MEMORIES,
        momentXp: 1450,
        momentLevel: 12,
        xpToNext: 2000,
        proximityStatus: 'idle',
        proximityDistance: null,
        proximityError: null,
        timerStatus: 'idle',
        timerRemaining: 0,
        timerTotal: 0,
        timerStartedAt: null,

        setActiveMoment: (moment) => set({ activeMoment: moment }),

        completeMoment: (id) =>
          set((state) => ({
            activeMoment:
              state.activeMoment?.id === id
                ? { ...state.activeMoment, status: 'completed' }
                : state.activeMoment,
          })),

        addRecentMemory: (memory) =>
          set((state) => ({
            recentMemories: [{ ...memory, id: `rm${Date.now()}` }, ...state.recentMemories],
          })),

        addXp: (amount) =>
          set((state) => {
            const newXp = state.momentXp + amount;
            if (newXp >= state.xpToNext) {
              return { momentXp: newXp - state.xpToNext, momentLevel: state.momentLevel + 1 };
            }
            return { momentXp: newXp };
          }),

        // ── Proximity ───────────────────────────────────────────────────────

        setProximityStatus: (status, distance, error) =>
          set({
            proximityStatus: status,
            proximityDistance: distance ?? null,
            proximityError: error ?? null,
          }),

        resetProximity: () =>
          set({ proximityStatus: 'idle', proximityDistance: null, proximityError: null }),

        // ── Timer ──────────────────────────────────────────────────────────

        startTimer: (durationSeconds) =>
          set({
            timerStatus: 'running',
            timerRemaining: durationSeconds,
            timerTotal: durationSeconds,
            timerStartedAt: Date.now(),
          }),

        pauseTimer: () => set({ timerStatus: 'paused' }),

        resumeTimer: () => set({ timerStatus: 'running' }),

        /** Decrement 1 second — call from setInterval */
        tickTimer: () =>
          set((state) => {
            if (state.timerStatus !== 'running') return state;
            const next = state.timerRemaining - 1;
            if (next <= 0) {
              return { timerRemaining: 0, timerStatus: 'finished' };
            }
            return { timerRemaining: next };
          }),

        finishTimer: (id) =>
          set((state) => {
            const moment = state.activeMoment;
            return {
              timerStatus: 'finished',
              activeMoment: moment?.id === id ? { ...moment, status: 'completed' } : moment,
            };
          }),

        resetTimer: () =>
          set({ timerStatus: 'idle', timerRemaining: 0, timerTotal: 0, timerStartedAt: null }),

        initFromData: (data) => set((state) => ({ ...state, ...data })),
      }),
      {
        name: 'moment-storage',
        partialize: (state) => ({
          activeMoment: state.activeMoment,
          recentMemories: state.recentMemories,
          momentXp: state.momentXp,
          momentLevel: state.momentLevel,
          // Timer state is NOT persisted (reset on reload)
        }),
      }
    ),
    { name: 'moment-store' }
  )
);
