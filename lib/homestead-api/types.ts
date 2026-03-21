export type FamilyRecord = {
    createdAt?: string;
    id: string;
    name: string;
};

export type ParentRecord = {
    email: string;
    familyId: string;
    id: string;
    name: string;
};

export type ChildRecord = {
    childAge: number;
    coins: number;
    familyId: string;
    id: string;
    name: string;
};

export type QuestRecord = {
    assignedDate: string;
    childId: string;
    completedAt?: string | null;
    description: string;
    id: string;
    reward: number;
    status: 'completed' | 'ongoing' | 'pending';
    title: string;
};

export type QuestStreakRecord = {
    childId: string;
    currentStreak: number;
    id?: string;
    longestStreak: number;
};

export type ActivityRecord = {
    activity: string;
    childId: string;
    completed?: boolean;
    familyId: string;
    id: string;
    locationName: string;
    mapsLink: string;
};

export type GoalRecord = {
    childId: string;
    deadline: string;
    id: string;
    target_coins: number;
    title: string;
};

export type ChildPreferenceRecord = {
    childId: string;
    id: string;
    score: number;
};

export type AdvisorMessageRecord = {
    childId: string;
    familyId: string;
    id: string;
    message: string;
    parentId: string;
    status?: string;
    suggestedActivity: string;
};

export type EventLogRecord = {
    childId: string;
    eventType: string;
    familyId: string;
    id: string;
    metadata: Record<string, unknown>;
};

export type PlaceCacheRecord = {
    id: string;
    mapsLink: string;
    openNow: boolean;
    placeName: string;
    query: string;
    rating: number;
};

export type CalendarEventRecord = {
    endTime: string;
    familyId: string;
    id: string;
    parentId: string;
    startTime: string;
    title: string;
};

export type CreateFamilyInput = Pick<FamilyRecord, 'name'>;
export type UpdateFamilyInput = Partial<Pick<FamilyRecord, 'name'>>;

export type CreateParentInput = Pick<ParentRecord, 'email' | 'familyId' | 'name'>;
export type UpdateParentInput = Partial<Pick<ParentRecord, 'email' | 'name'>>;

export type CreateChildInput = Pick<ChildRecord, 'childAge' | 'familyId' | 'name'>;
export type UpdateChildInput = Partial<Pick<ChildRecord, 'childAge' | 'coins' | 'name'>>;

export type CreateQuestInput = Omit<QuestRecord, 'id'>;
export type UpdateQuestInput = Partial<Pick<QuestRecord, 'completedAt' | 'status'>>;

export type UpdateQuestStreakInput = Pick<QuestStreakRecord, 'currentStreak' | 'longestStreak'>;

export type CreateActivityInput = Omit<ActivityRecord, 'completed' | 'id'>;
export type UpdateActivityInput = Pick<ActivityRecord, 'completed'>;

export type CreateGoalInput = Omit<GoalRecord, 'id'>;
export type UpdateGoalInput = Partial<Pick<GoalRecord, 'deadline' | 'target_coins' | 'title'>>;

export type UpdateChildPreferenceInput = Pick<ChildPreferenceRecord, 'score'>;

export type CreateAdvisorMessageInput = Omit<AdvisorMessageRecord, 'id' | 'status'>;
export type UpdateAdvisorMessageInput = Pick<AdvisorMessageRecord, 'status'>;

export type CreateEventLogInput = Omit<EventLogRecord, 'id'>;

export type CreatePlaceCacheInput = Omit<PlaceCacheRecord, 'id'>;

export type CreateCalendarEventInput = Omit<CalendarEventRecord, 'id'>;
