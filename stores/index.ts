/**
 * stores/index.ts — Central export
 *
 * Team convention:
 * - Import from '@/stores' (not '@/stores/quest.store')
 * - Each store file = one domain
 */

export { useQuestStore } from './quest.store';
export type {
  Quest,
  QuestStatus,
  QuestCategory,
  QuestRecommendation,
} from './quest.store';
/** Default 2h quest duration. Override per-quest in startQuest() */
export { DEFAULT_QUEST_DURATION_MS } from './quest.store';

export { useDreamStore } from './dream.store';
export type { DreamGoal, SeedHistoryItem } from './dream.store';

export { useMomentStore } from './moment.store';
export type {
  MomentActivity,
  UpcomingActivity,
  RecentMemory,
  ProximityStatus,
  TimerStatus,
} from './moment.store';

export { useAppStore } from './app.store';
