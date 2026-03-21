import { create } from 'zustand';

export type QuestStatus = 'suggested' | 'approved' | 'rejected' | 'completed';

export type QuestCategory = 'Care' | 'Exercise' | 'Habit' | 'Learning' | 'Movement' | 'Responsibility';

export type ParentGoal = {
    title: string;
    target: number;
    milestone: number;
    note: string;
};

export type ParentQuest = {
    id: string;
    title: string;
    reward: number;
    category: QuestCategory;
    description: string;
    status: QuestStatus;
};

export type ParentMoment = {
    title: string;
    duration: string;
    description: string;
    supplies: string[];
    rewardSeeds: number;
    rewardTokens: number;
};

export type ParentChild = {
    id: string;
    agentChildId: string;
    name: string;
    age: number;
    seeds: number;
    aiTokens: number;
    goal: ParentGoal | null;
    quests: ParentQuest[];
    moment: ParentMoment | null;
    introMessage: string;
    generationError?: string;
    networkIssue?: string;
    momentError?: string;
    proximityDistance: number;
};

type ParentAppState = {
    parentName: string;
    familyId: string;
    familySeeds: number;
    children: ParentChild[];
    selectedChildId: string;
    lockedChildId: string | null;
    activeMomentChildId: string | null;
    selectChild: (childId: string) => void;
    approveQuest: (childId: string, questId: string) => void;
    rejectQuest: (childId: string, questId: string) => void;
    completeQuest: (childId: string, questId: string) => void;
    regenerateSuggestedQuests: (childId: string) => boolean;
    applyGeneratedQuests: (childId: string, quests: ParentQuest[]) => void;
    sendSeeds: (childId: string, amount: number) => void;
    startMomentFlow: (childId: string) => void;
    cancelMomentFlow: () => void;
    completeMomentFlow: () => void;
};

const regeneratedQuestSets: Record<string, ParentQuest[]> = {
    mina: [
        {
            id: 'mina-refresh-1',
            title: 'Practice three new nature words',
            reward: 10,
            category: 'Learning',
            description: 'A short language quest that keeps the day calm and curiosity-led.',
            status: 'suggested',
        },
        {
            id: 'mina-refresh-2',
            title: 'Stretch with a five-minute garden walk',
            reward: 10,
            category: 'Movement',
            description: 'A gentle movement task that still feels cozy and parent-friendly.',
            status: 'suggested',
        },
        {
            id: 'mina-refresh-3',
            title: 'Refill the bird water dish',
            reward: 8,
            category: 'Care',
            description: 'A nurturing task that reinforces the homestead theme without feeling busy.',
            status: 'suggested',
        },
    ],
    leo: [
        {
            id: 'leo-refresh-1',
            title: 'Put pajamas in the basket',
            reward: 6,
            category: 'Responsibility',
            description: 'A tiny evening reset that keeps the flow easy and age-appropriate.',
            status: 'suggested',
        },
        {
            id: 'leo-refresh-2',
            title: 'Hop across the rug ten times',
            reward: 8,
            category: 'Movement',
            description: 'Short energy release with a simple success moment.',
            status: 'suggested',
        },
    ],
    ava: [
        {
            id: 'ava-refresh-1',
            title: 'Sketch one flower from memory',
            reward: 12,
            category: 'Learning',
            description: 'A creative task that supports Ava’s goal and keeps the UI in an empty-safe state.',
            status: 'suggested',
        },
    ],
};

const initialChildren: ParentChild[] = [
    {
        id: 'mina',
        agentChildId: 'c1000000-0000-0000-0000-000000000001',
        name: 'Mina',
        age: 8,
        seeds: 30,
        aiTokens: 6,
        goal: {
            title: 'Birthday Gift',
            target: 100,
            milestone: 50,
            note: 'At 50 seeds, Lena unlocks a special family message.',
        },
        quests: [
            {
                id: 'mina-quest-1',
                title: 'Read 10 pages before dinner',
                reward: 10,
                category: 'Learning',
                description: 'A quiet, confidence-building task that keeps the day grounded and purposeful.',
                status: 'suggested',
            },
            {
                id: 'mina-quest-2',
                title: 'Tidy the toy shelf',
                reward: 8,
                category: 'Responsibility',
                description: 'A gentle reset that feels helpful without turning the app into a task manager.',
                status: 'approved',
            },
            {
                id: 'mina-quest-3',
                title: 'Water the window plants',
                reward: 12,
                category: 'Care',
                description: 'A small nurturing ritual that fits the homestead tone beautifully.',
                status: 'completed',
            },
        ],
        moment: {
            title: 'Blanket Reading Nest',
            duration: '20 minutes',
            description: 'Build a pillow corner, dim the lights, and read a favorite story together.',
            supplies: ['blanket', 'two pillows', 'favorite book'],
            rewardSeeds: 5,
            rewardTokens: 3,
        },
        introMessage: 'Welcome back to the homestead. Small care moments count today.',
        proximityDistance: 34,
    },
    {
        id: 'leo',
        agentChildId: 'c1000000-0000-0000-0000-000000000002',
        name: 'Leo',
        age: 6,
        seeds: 18,
        aiTokens: 4,
        goal: null,
        quests: [
            {
                id: 'leo-quest-1',
                title: 'Put pajamas in the basket',
                reward: 6,
                category: 'Responsibility',
                description: 'A tiny reset that stays age-appropriate and low-pressure.',
                status: 'suggested',
            },
            {
                id: 'leo-quest-2',
                title: 'Take a five-minute stretch break',
                reward: 8,
                category: 'Movement',
                description: 'A small movement quest that supports energy without overstimulation.',
                status: 'approved',
            },
        ],
        moment: {
            title: 'Shadow Puppet Story',
            duration: '15 minutes',
            description: 'Use a lamp and a sheet to invent a tiny family story together.',
            supplies: ['lamp', 'sheet'],
            rewardSeeds: 5,
            rewardTokens: 3,
        },
        introMessage: 'Leo is in a gentle-building phase, so keep the UI simple and encouraging.',
        proximityDistance: 48,
    },
    {
        id: 'ava',
        agentChildId: 'c1000000-0000-0000-0000-000000000003',
        name: 'Ava',
        age: 9,
        seeds: 62,
        aiTokens: 10,
        goal: {
            title: 'Art Kit',
            target: 120,
            milestone: 80,
            note: 'The next milestone should feel reflective and creative, not loud.',
        },
        quests: [],
        moment: null,
        introMessage: 'Ava is between quest batches right now, so the empty states should still feel intentional.',
        proximityDistance: 28,
    },
    {
        id: 'noah',
        agentChildId: 'c1000000-0000-0000-0000-000000000004',
        name: 'Noah',
        age: 7,
        seeds: 25,
        aiTokens: 5,
        goal: {
            title: 'Museum Trip',
            target: 90,
            milestone: 45,
            note: 'Keep milestone language warm even if other systems are unavailable.',
        },
        quests: [],
        moment: null,
        introMessage: 'The homestead connection feels a little quiet for Noah right now.',
        generationError: 'Lena could not gather fresh quests right now. Try again in a moment.',
        networkIssue: 'The family board is having trouble syncing. Your saved progress is still safe.',
        momentError: 'A new family moment suggestion is unavailable right now. Try again shortly.',
        proximityDistance: 84,
    },
];

function updateChild(
    children: ParentChild[],
    childId: string,
    update: (child: ParentChild) => ParentChild,
) {
    return children.map((child) => (child.id === childId ? update(child) : child));
}

export const useAppState = create<ParentAppState>((set, get) => ({
    parentName: 'Eric',
    familyId: 'a1000000-0000-0000-0000-000000000001',
    familySeeds: 30,
    children: initialChildren,
    selectedChildId: initialChildren[0].id,
    lockedChildId: null,
    activeMomentChildId: null,
    selectChild: (childId) => {
        const { lockedChildId } = get();

        if (lockedChildId) {
            return;
        }

        set({ selectedChildId: childId });
    },
    approveQuest: (childId, questId) => {
        set((state) => ({
            children: updateChild(state.children, childId, (child) => ({
                ...child,
                quests: child.quests.map((quest) =>
                    quest.id === questId ? { ...quest, status: 'approved' } : quest,
                ),
            })),
        }));
    },
    rejectQuest: (childId, questId) => {
        set((state) => ({
            children: updateChild(state.children, childId, (child) => ({
                ...child,
                quests: child.quests.map((quest) =>
                    quest.id === questId ? { ...quest, status: 'rejected' } : quest,
                ),
            })),
        }));
    },
    completeQuest: (childId, questId) => {
        set((state) => ({
            children: updateChild(state.children, childId, (child) => {
                const quest = child.quests.find((item) => item.id === questId);

                if (!quest || quest.status === 'completed') {
                    return child;
                }

                return {
                    ...child,
                    seeds: child.seeds + quest.reward,
                    quests: child.quests.map((item) =>
                        item.id === questId ? { ...item, status: 'completed' } : item,
                    ),
                };
            }),
        }));
    },
    regenerateSuggestedQuests: (childId) => {
        const child = get().children.find((item) => item.id === childId);

        if (!child || child.generationError || child.networkIssue) {
            return false;
        }

        const fallback = regeneratedQuestSets[childId] ?? child.quests;

        set((state) => ({
            children: updateChild(state.children, childId, (currentChild) => ({
                ...currentChild,
                quests: [
                    ...fallback,
                    ...currentChild.quests.filter((quest) => quest.status === 'approved' || quest.status === 'completed'),
                ],
            })),
        }));

        return true;
    },
    applyGeneratedQuests: (childId, quests) => {
        set((state) => ({
            children: updateChild(state.children, childId, (child) => ({
                ...child,
                generationError: undefined,
                quests: [
                    ...quests.map((quest) => ({
                        ...quest,
                        status: 'suggested' as const,
                    })),
                    ...child.quests.filter((quest) => quest.status === 'approved' || quest.status === 'completed'),
                ],
            })),
        }));
    },
    sendSeeds: (childId, amount) => {
        const safeAmount = Math.max(0, Math.min(amount, get().familySeeds));

        if (!safeAmount) {
            return;
        }

        set((state) => ({
            familySeeds: Math.max(0, state.familySeeds - safeAmount),
            children: updateChild(state.children, childId, (child) => ({
                ...child,
                seeds: child.seeds + safeAmount,
            })),
        }));
    },
    startMomentFlow: (childId) => {
        set({
            lockedChildId: childId,
            activeMomentChildId: childId,
            selectedChildId: childId,
        });
    },
    cancelMomentFlow: () => {
        set({
            lockedChildId: null,
            activeMomentChildId: null,
        });
    },
    completeMomentFlow: () => {
        const { activeMomentChildId } = get();

        if (!activeMomentChildId) {
            return;
        }

        set((state) => ({
            lockedChildId: null,
            activeMomentChildId: null,
            children: updateChild(state.children, activeMomentChildId, (child) => ({
                ...child,
                seeds: child.seeds + 5,
                aiTokens: child.aiTokens + 3,
            })),
        }));
    },
}));
