/**
 * lib/child-quests.ts
 *
 * Handles syncing approved quests from Parent → Child via localStorage.
 * This enables the flow:
 * 1. Parent generates & approves quests
 * 2. Quests sync to localStorage
 * 3. Child reads approved quests on mount
 */

import { Quest, QuestCategory, QuestStatus } from '@/stores/quest.store';

const APPROVED_QUESTS_KEY = 'hearth_approved_quests';

export type ApprovedQuest = {
  id: string;
  title: string;
  reward: number;
  category: QuestCategory;
  description: string;
  approvedAt: number; // timestamp
};

/**
 * Map Parent category to Child quest category
 * Parent: 'Learning' | 'Responsibility' | 'Movement' | 'Care'
 * Child:  'learning' | 'responsibility' | 'exercise' | 'nature'
 */
function mapCategoryToChild(parentCategory: string): QuestCategory {
  const map: Record<string, QuestCategory> = {
    Learning: 'learning',
    Responsibility: 'responsibility',
    Movement: 'exercise',
    Care: 'nature',
  };
  return map[parentCategory] ?? 'learning';
}

/**
 * Map Parent quest status to Child quest status
 */
function mapStatusToChild(parentStatus: string): QuestStatus {
  const map: Record<string, QuestStatus> = {
    suggested: 'pending',
    approved: 'pending',
    rejected: 'failed',
    completed: 'completed',
  };
  return map[parentStatus] ?? 'pending';
}

/**
 * Get icon for category (Material Symbols)
 */
function getCategoryIcon(category: QuestCategory): string {
  const icons: Record<QuestCategory, string> = {
    learning: 'menu_book',
    exercise: 'directions_run',
    responsibility: 'cleaning_services',
    nature: 'eco',
  };
  return icons[category] ?? 'star';
}

/**
 * Convert ApprovedQuest (Parent format) to Quest (Child format)
 */
export function toChildQuest(approvedQuest: ApprovedQuest): Quest {
  const childCategory = mapCategoryToChild(approvedQuest.category);

  return {
    id: approvedQuest.id,
    title: approvedQuest.title,
    description: approvedQuest.description,
    category: childCategory,
    icon: getCategoryIcon(childCategory),
    reward: approvedQuest.reward,
    status: 'pending' as QuestStatus, // Always start as pending for child
  };
}

/**
 * Get approved quests from localStorage for a specific child
 */
export function getApprovedQuestsFromStorage(childId: string): ApprovedQuest[] {
  if (typeof window === 'undefined') return [];

  try {
    const key = `${APPROVED_QUESTS_KEY}_${childId}`;
    const stored = localStorage.getItem(key);

    if (!stored) return [];

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    // Filter out expired quests (older than 24 hours)
    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;

    return parsed.filter((quest: ApprovedQuest) => {
      const age = now - quest.approvedAt;
      return age < DAY_MS; // Keep quests less than 24 hours old
    });
  } catch {
    return [];
  }
}

/**
 * Save approved quest to localStorage
 * Called when parent approves a quest
 */
export function saveApprovedQuestToStorage(
  childId: string,
  quest: {
    id: string;
    title: string;
    reward: number;
    category: string;
    description: string;
  }
): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `${APPROVED_QUESTS_KEY}_${childId}`;
    const existing = getApprovedQuestsFromStorage(childId);

    // Check if quest already exists
    const existingIndex = existing.findIndex(q => q.id === quest.id);

    // Map category to child format
    const mappedCategory = mapCategoryToChild(quest.category);

    if (existingIndex >= 0) {
      // Update existing
      existing[existingIndex] = {
        ...existing[existingIndex],
        approvedAt: Date.now(),
      };
    } else {
      // Add new with proper category type
      existing.push({
        id: quest.id,
        title: quest.title,
        reward: quest.reward,
        category: mappedCategory,
        description: quest.description,
        approvedAt: Date.now(),
      });
    }

    // Keep max 5 quests (last 5 approved)
    const toSave = existing.slice(-5);

    localStorage.setItem(key, JSON.stringify(toSave));
  } catch {
    // Silent fail
  }
}

/**
 * Remove quest from approved storage
 * Called when parent rejects or completes a quest
 */
export function removeApprovedQuestFromStorage(childId: string, questId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `${APPROVED_QUESTS_KEY}_${childId}`;
    const existing = getApprovedQuestsFromStorage(childId);

    const filtered = existing.filter(q => q.id !== questId);

    if (filtered.length === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(filtered));
    }
  } catch {
    // Silent fail
  }
}

/**
 * Clear all approved quests for a child
 */
export function clearApprovedQuestsForChild(childId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `${APPROVED_QUESTS_KEY}_${childId}`;
    localStorage.removeItem(key);
  } catch {
    // Silent fail
  }
}

/**
 * Get all approved quests for child as Quest[] (Child format)
 * Used by ChildHomeContent on mount
 */
export function getChildQuestsFromStorage(childId: string): Quest[] {
  const approved = getApprovedQuestsFromStorage(childId);
  return approved.map(toChildQuest);
}

/**
 * Get available child IDs from localStorage
 * Used for multi-child support
 */
export function getAvailableChildIds(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const prefix = APPROVED_QUESTS_KEY;
    const keys = Object.keys(localStorage).filter(k =>
      k.startsWith(prefix) && k !== prefix
    );

    return keys.map(k => k.replace(`${prefix}_`, ''));
  } catch {
    return [];
  }
}
