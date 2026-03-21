'use client';

import type { ParentChild, ParentGoal, ParentMoment, ParentQuest } from '@/state/appState';
import { getSupabaseBrowserClient } from './client';

type FamilyRow = { id: string; name: string | null };
type ParentRow = { id: string; familyId: string; name: string | null; email: string | null };
type ChildRow = { id: string; familyId: string; name: string; childAge: number | null; coins: number | null };
type QuestRow = {
  id: string;
  childId: string;
  title: string;
  description: string | null;
  reward: number | null;
  status: string | null;
  assignedDate: string | null;
  completedAt: string | null;
};
type GoalRow = {
  id: string;
  childId: string;
  title: string;
  target_coins: number | null;
  deadline: string | null;
};
type ChildPreferenceRow = {
  id: string;
  childId: string;
  label: string | null;
  score: number | null;
};
type AdvisorMessageRow = {
  id: string;
  familyId: string;
  parentId: string;
  childId: string;
  message: string;
  suggestedActivity: string | null;
  status: string | null;
};
type EventLogRow = {
  id: string;
  familyId: string;
  childId: string;
  eventType: string;
  metadata: Record<string, unknown> | null;
  created_at?: string | null;
  createdAt?: string | null;
};
type CalendarEventRow = {
  id: string;
  parentId: string;
  familyId: string;
  title: string;
  startTime: string;
  endTime: string;
};
type ActivityRow = {
  id: string;
  familyId: string;
  childId: string;
  activity: string;
  locationName: string | null;
  mapsLink: string | null;
  completed: boolean | null;
};
type QuestStreakRow = {
  id: string;
  childId: string;
  currentStreak: number | null;
  longestStreak: number | null;
};

export type ParentFamilySnapshot = {
  familyName: string | null;
  parentId: string | null;
  parentName: string | null;
  children: ParentChild[];
};

export type CreateApprovedQuestInput = Pick<ParentQuest, 'title' | 'description' | 'reward'> & {
  childId: string;
};

export type CreateActivityInput = {
  familyId: string;
  childId: string;
  activity: string;
  locationName?: string;
  mapsLink?: string;
};

export type AdvisorSuggestionPayload = {
  activity: string;
  duration: string;
  rationale: string;
  supplies: string[];
  encouragement: string;
  nearbySuggestions: Array<{
    name: string;
    query: string;
    distanceLabel: string;
    ratingLabel: string;
    note: string;
  }>;
};

export type ChildHomesteadSnapshot = {
  coins: number;
  goal: ParentGoal | null;
  moment: ParentMoment | null;
  eventLogs: EventLogRow[];
  advisorMessages: AdvisorMessageRow[];
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function mapQuestStatus(status: string | null): ParentQuest['status'] {
  if (status === 'completed') {
    return 'completed';
  }

  if (status === 'failed') {
    return 'rejected';
  }

  return 'approved';
}

function mapGoal(row: GoalRow | undefined): ParentGoal | null {
  if (!row) {
    return null;
  }

  const target = row.target_coins ?? 0;

  return {
    id: row.id,
    title: row.title,
    target,
    milestone: Math.max(10, Math.floor(target / 2)),
    note: row.deadline
      ? `Goal date ${row.deadline}. Keep progress steady and shared.`
      : 'A small family goal gives daily rewards a clear meaning.',
  };
}

function mapMoment(row: ActivityRow | undefined): ParentMoment | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    mapsLink: row.mapsLink ?? undefined,
    title: row.activity,
    duration: '20 minutes',
    description: row.locationName
      ? `Planned at ${row.locationName}. Keep the moment simple and warm.`
      : 'A shared family activity ready to begin at home.',
    supplies: row.mapsLink ? ['maps link ready'] : ['home setup'],
    rewardSeeds: 5,
    rewardTokens: 3,
  };
}

function mapChild(
  row: ChildRow,
  quests: QuestRow[],
  goal: GoalRow | undefined,
  activity: ActivityRow | undefined,
  streak: QuestStreakRow | undefined,
): ParentChild {
  return {
    id: row.id,
    agentChildId: row.id,
    name: row.name,
    age: row.childAge ?? 7,
    seeds: row.coins ?? 0,
    aiTokens: 0,
    goal: mapGoal(goal),
    quests: quests.map((quest) => ({
      id: quest.id,
      title: quest.title,
      reward: quest.reward ?? 0,
      category: 'Learning',
      description: quest.description ?? 'A parent-approved quest ready for the day.',
      status: mapQuestStatus(quest.status),
    })),
    moment: mapMoment(activity),
    introMessage: streak?.currentStreak
      ? `${row.name} is on a ${streak.currentStreak}-day streak. Keep the momentum gentle.`
      : `Welcome back to the homestead. ${row.name}'s next small win is ready when you are.`,
    proximityDistance: 35,
  };
}

export async function fetchParentFamilySnapshot(familyId: string): Promise<ParentFamilySnapshot> {
  const supabase = getSupabaseBrowserClient();
  const today = todayIsoDate();

  const [{ data: family }, { data: parents }, { data: children, error: childrenError }] = await Promise.all([
    supabase.from('families').select('id,name').eq('id', familyId).maybeSingle<FamilyRow>(),
    supabase.from('parents').select('id,familyId,name,email').eq('familyId', familyId).limit(1).returns<ParentRow[]>(),
    supabase.from('children').select('id,familyId,name,childAge,coins').eq('familyId', familyId).returns<ChildRow[]>(),
  ]);

  if (childrenError) {
    throw childrenError;
  }

  const childRows = children ?? [];
  const childIds = childRows.map((child) => child.id);

  if (!childIds.length) {
    return {
      familyName: family?.name ?? null,
      parentId: parents?.[0]?.id ?? null,
      parentName: parents?.[0]?.name ?? null,
      children: [],
    };
  }

  const [{ data: quests }, { data: goals }, { data: activities }, { data: streaks }] = await Promise.all([
    supabase
      .from('quests')
      .select('id,childId,title,description,reward,status,assignedDate,completedAt')
      .in('childId', childIds)
      .eq('assignedDate', today)
      .returns<QuestRow[]>(),
    supabase
      .from('goals')
      .select('id,childId,title,target_coins,deadline')
      .in('childId', childIds)
      .returns<GoalRow[]>(),
    supabase
      .from('activities')
      .select('id,familyId,childId,activity,locationName,mapsLink,completed')
      .eq('familyId', familyId)
      .eq('completed', false)
      .returns<ActivityRow[]>(),
    supabase
      .from('quest_streaks')
      .select('id,childId,currentStreak,longestStreak')
      .in('childId', childIds)
      .returns<QuestStreakRow[]>(),
  ]);

  return {
    familyName: family?.name ?? null,
    parentId: parents?.[0]?.id ?? null,
    parentName: parents?.[0]?.name ?? null,
    children: childRows.map((child) =>
      mapChild(
        child,
        (quests ?? []).filter((quest) => quest.childId === child.id),
        (goals ?? []).find((goal) => goal.childId === child.id),
        (activities ?? []).find((activity) => activity.childId === child.id),
        (streaks ?? []).find((streak) => streak.childId === child.id),
      )
    ),
  };
}

export async function createGoal(input: {
  childId: string;
  title: string;
  targetCoins: number;
  deadline?: string | null;
}) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('goals')
    .insert({
      childId: input.childId,
      title: input.title,
      target_coins: input.targetCoins,
      deadline: input.deadline ?? null,
    })
    .select('id,childId,title,target_coins,deadline')
    .single<GoalRow>();

  if (error) {
    throw error;
  }

  return mapGoal(data);
}

export async function updateGoalTarget(goalId: string, targetCoins: number) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('goals')
    .update({ target_coins: targetCoins })
    .eq('id', goalId)
    .select('id,childId,title,target_coins,deadline')
    .single<GoalRow>();

  if (error) {
    throw error;
  }

  return mapGoal(data);
}

export async function updateChildCoins(childId: string, coins: number) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from('children')
    .update({ coins })
    .eq('id', childId);

  if (error) {
    throw error;
  }
}

export async function createEventLog(input: {
  familyId: string;
  childId: string;
  eventType: string;
  metadata: Record<string, unknown>;
}) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from('event_logs').insert({
    familyId: input.familyId,
    childId: input.childId,
    eventType: input.eventType,
    metadata: input.metadata,
  });

  if (error) {
    throw error;
  }
}

export async function updateQuestStreak(childId: string, currentStreak: number, longestStreak: number) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from('quest_streaks').upsert({
    childId,
    currentStreak,
    longestStreak,
  }, { onConflict: 'childId' });

  if (error) {
    throw error;
  }
}

export async function fetchChildPreferences(childId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('child_preferences')
    .select('id,childId,label,score')
    .eq('childId', childId)
    .returns<ChildPreferenceRow[]>();

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function upsertChildPreference(input: {
  childId: string;
  label: string;
  score: number;
}) {
  const supabase = getSupabaseBrowserClient();
  const existing = await fetchChildPreferences(input.childId);
  const match = existing.find((item) => item.label?.toLowerCase() === input.label.toLowerCase());

  if (match) {
    const { error } = await supabase
      .from('child_preferences')
      .update({ score: input.score })
      .eq('id', match.id);

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await supabase.from('child_preferences').insert({
    childId: input.childId,
    label: input.label,
    score: input.score,
  });

  if (error) {
    throw error;
  }
}

export async function createAdvisorMessage(input: {
  familyId: string;
  parentId: string;
  childId: string;
  message: string;
  suggestedActivity: string;
}) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('advisor_messages')
    .insert(input)
    .select('id,familyId,parentId,childId,message,suggestedActivity,status')
    .single<AdvisorMessageRow>();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchAdvisorMessages(familyId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('advisor_messages')
    .select('id,familyId,parentId,childId,message,suggestedActivity,status')
    .eq('familyId', familyId)
    .returns<AdvisorMessageRow[]>();

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function updateAdvisorMessageStatus(messageId: string, status: string) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from('advisor_messages')
    .update({ status })
    .eq('id', messageId);

  if (error) {
    throw error;
  }
}

export async function createCalendarEvent(input: {
  parentId: string;
  familyId: string;
  title: string;
  startTime: string;
  endTime: string;
}) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('calendar_events')
    .insert(input)
    .select('id,parentId,familyId,title,startTime,endTime')
    .single<CalendarEventRow>();

  if (error) {
    throw error;
  }

  return data;
}

export async function storePlaceCache(input: {
  query: string;
  placeName: string;
  rating: number;
  openNow: boolean;
  mapsLink: string;
}) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from('place_cache').insert(input);

  if (error) {
    throw error;
  }
}

export async function createApprovedQuests(input: CreateApprovedQuestInput[]) {
  const supabase = getSupabaseBrowserClient();
  const rows = input.map((quest) => ({
    childId: quest.childId,
    title: quest.title,
    description: quest.description,
    reward: quest.reward,
    assignedDate: todayIsoDate(),
    status: 'pending',
  }));

  const { error } = await supabase.from('quests').insert(rows);

  if (error) {
    throw error;
  }
}

export async function updateQuestStatus(questId: string, status: 'ongoing' | 'completed' | 'failed') {
  const supabase = getSupabaseBrowserClient();
  const updates = status === 'completed'
    ? { status, completedAt: new Date().toISOString() }
    : { status };

  const { error } = await supabase.from('quests').update(updates).eq('id', questId);

  if (error) {
    throw error;
  }
}

export async function createActivity(input: CreateActivityInput) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('activities')
    .insert({
      familyId: input.familyId,
      childId: input.childId,
      activity: input.activity,
      locationName: input.locationName ?? 'Home',
      mapsLink: input.mapsLink ?? '',
    })
    .select('id,familyId,childId,activity,locationName,mapsLink,completed')
    .single<ActivityRow>();

  if (error) {
    throw error;
  }

  return data;
}

export async function completeActivity(activityId: string) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from('activities')
    .update({ completed: true })
    .eq('id', activityId);

  if (error) {
    throw error;
  }
}

export async function fetchChildHomesteadSnapshot(childId: string, familyId: string): Promise<ChildHomesteadSnapshot> {
  const supabase = getSupabaseBrowserClient();

  const [{ data: child }, { data: goals }, { data: activities }, { data: eventLogs }, { data: advisorMessages }] = await Promise.all([
    supabase
      .from('children')
      .select('id,familyId,name,childAge,coins')
      .eq('id', childId)
      .maybeSingle<ChildRow>(),
    supabase
      .from('goals')
      .select('id,childId,title,target_coins,deadline')
      .eq('childId', childId)
      .returns<GoalRow[]>(),
    supabase
      .from('activities')
      .select('id,familyId,childId,activity,locationName,mapsLink,completed')
      .eq('familyId', familyId)
      .eq('childId', childId)
      .eq('completed', false)
      .returns<ActivityRow[]>(),
    supabase
      .from('event_logs')
      .select('id,familyId,childId,eventType,metadata,created_at')
      .eq('familyId', familyId)
      .eq('childId', childId)
      .returns<EventLogRow[]>(),
    supabase
      .from('advisor_messages')
      .select('id,familyId,parentId,childId,message,suggestedActivity,status')
      .eq('familyId', familyId)
      .eq('childId', childId)
      .returns<AdvisorMessageRow[]>(),
  ]);

  return {
    coins: child?.coins ?? 0,
    goal: mapGoal(goals?.[0]),
    moment: mapMoment(activities?.[0]),
    eventLogs: eventLogs ?? [],
    advisorMessages: advisorMessages ?? [],
  };
}

export async function fetchChildQuestSnapshot(childId: string) {
  const supabase = getSupabaseBrowserClient();
  const today = todayIsoDate();

  const [{ data: quests }, { data: streak }] = await Promise.all([
    supabase
      .from('quests')
      .select('id,childId,title,description,reward,status,assignedDate,completedAt')
      .eq('childId', childId)
      .eq('assignedDate', today)
      .returns<QuestRow[]>(),
    supabase
      .from('quest_streaks')
      .select('id,childId,currentStreak,longestStreak')
      .eq('childId', childId)
      .maybeSingle<QuestStreakRow>(),
  ]);

  return {
    quests: (quests ?? []).map((quest) => ({
      id: quest.id,
      title: quest.title,
      description: quest.description ?? undefined,
      category: 'learning' as const,
      icon: 'menu_book',
      reward: quest.reward ?? 0,
      status: quest.status === 'ongoing'
        ? 'ongoing'
        : quest.status === 'completed'
          ? 'completed'
          : quest.status === 'failed'
            ? 'failed'
            : 'pending',
    })),
    streak: streak?.currentStreak ?? 0,
  };
}
