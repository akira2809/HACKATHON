import {
    eq,
    supabaseInsertMany,
    supabaseInsertOne,
    supabaseList,
    supabaseRemove,
    supabaseSingleStrict,
    supabaseUpdateOne,
} from '@/lib/supabase';
import type {
    ChildPreferenceRecord,
    CreateGoalInput,
    CreateQuestInput,
    GoalRecord,
    QuestRecord,
    QuestStreakRecord,
    UpdateChildPreferenceInput,
    UpdateGoalInput,
    UpdateQuestInput,
    UpdateQuestStreakInput,
} from './types';

function getTodayDateString() {
    return new Date().toISOString().slice(0, 10);
}

export const questsApi = {
    complete: (questId: string) =>
        supabaseUpdateOne<QuestRecord>(
            'quests',
            { status: 'completed', completedAt: new Date().toISOString() },
            { id: eq(questId) }
        ),
    create: (input: CreateQuestInput[]) => supabaseInsertMany<QuestRecord>('quests', input),
    listByChildAndDate: (childId: string, assignedDate: string) =>
        supabaseList<QuestRecord>('quests', {
            assignedDate: eq(assignedDate),
            childId: eq(childId),
        }),
    listToday: (childId: string, assignedDate = getTodayDateString()) =>
        supabaseList<QuestRecord>('quests', {
            assignedDate: eq(assignedDate),
            childId: eq(childId),
        }),
    remove: (questId: string) => supabaseRemove('quests', { id: eq(questId) }),
    start: (questId: string) =>
        supabaseUpdateOne<QuestRecord>('quests', { status: 'ongoing' }, { id: eq(questId) }),
};

export const questStreaksApi = {
    getByChild: (childId: string) => supabaseSingleStrict<QuestStreakRecord>('quest_streaks', { childId: eq(childId) }),
    updateByChild: (childId: string, input: UpdateQuestStreakInput) =>
        supabaseUpdateOne<QuestStreakRecord>('quest_streaks', input, { childId: eq(childId) }),
};

export const goalsApi = {
    create: (input: CreateGoalInput) => supabaseInsertOne<GoalRecord>('goals', input),
    listByChild: (childId: string) => supabaseList<GoalRecord>('goals', { childId: eq(childId) }),
    update: (goalId: string, input: UpdateGoalInput) =>
        supabaseUpdateOne<GoalRecord>('goals', input, { id: eq(goalId) }),
};

export const childPreferencesApi = {
    listByChild: (childId: string) =>
        supabaseList<ChildPreferenceRecord>('child_preferences', { childId: eq(childId) }),
    update: (preferenceId: string, input: UpdateChildPreferenceInput) =>
        supabaseUpdateOne<ChildPreferenceRecord>('child_preferences', input, { id: eq(preferenceId) }),
};
