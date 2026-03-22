'use client';

import { useMemo, useState } from 'react';
import {
  BentoGrid,
  ComicCard,
  ConfirmationModal,
  DreamGoalCard,
  MascotSection,
  ProgressBar,
  QuestCard,
  QuestSection,
  QuestStartModal,
  RecommendationModal,
  StreakBadge,
} from '@/components/homestead';
import { useParentDashboardData } from '@/hooks/useParentDashboardData';

const RECOMMENDATIONS = [
  {
    bgColor: 'bg-[#FEF08A]',
    category: 'Family Moment',
    color: 'text-[#CA8A04]',
    icon: 'auto_stories',
    id: 'reading',
    title: 'Read together tonight',
  },
  {
    bgColor: 'bg-[#BAE6FD]',
    category: 'Healthy Habit',
    color: 'text-[#0284C7]',
    icon: 'restaurant',
    id: 'snack',
    title: 'Make a simple snack',
  },
  {
    bgColor: 'bg-[#DCFCE7]',
    category: 'Movement',
    color: 'text-[#059669]',
    icon: 'self_improvement',
    id: 'stretch',
    title: 'Take a calm stretch break',
  },
] as const;

function getQuestCategory(category?: string) {
  switch (category) {
    case 'Exercise':
    case 'Movement':
      return 'exercise' as const;
    case 'Responsibility':
      return 'responsibility' as const;
    case 'Care':
      return 'nature' as const;
    default:
      return 'learning' as const;
  }
}

function getQuestIcon(category?: string) {
  switch (category) {
    case 'Exercise':
    case 'Movement':
      return 'directions_run';
    case 'Responsibility':
      return 'cleaning_services';
    case 'Care':
      return 'favorite';
    case 'Habit':
      return 'task_alt';
    default:
      return 'menu_book';
  }
}

export function ChildHomeContent() {
  const {
    activeChild,
    dashboardError,
    hasNoChildren,
    isOverviewLoading,
    questActions,
    todayQuestsError,
  } = useParentDashboardData({
    syncSelectedChild: false,
  });

  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const todayQuests = useMemo(
    () =>
      (activeChild?.quests ?? []).map((quest) => ({
        category: getQuestCategory(quest.category),
        description: quest.description,
        icon: getQuestIcon(quest.category),
        id: quest.id,
        reward: quest.reward,
        status: quest.status === 'ongoing'
          ? 'ongoing'
          : quest.status === 'completed'
            ? 'completed'
            : 'pending',
        title: quest.title,
      })),
    [activeChild?.quests],
  );
  const selectedQuest = todayQuests.find((quest) => quest.id === selectedQuestId) ?? null;
  const pendingCount = todayQuests.filter((quest) => quest.status === 'pending').length;
  const errorMessage = dashboardError ?? todayQuestsError;
  const goalTarget = activeChild?.goal?.target ?? 100;
  const goalProgress = activeChild?.goal
    ? Math.min(100, Math.round((activeChild.seeds / activeChild.goal.target) * 100))
    : 0;
  const mascotMessage = !todayQuests.length
    ? 'Lena is preparing more adventures for today.'
    : pendingCount === todayQuests.length
      ? `${activeChild?.name}'s adventures are ready to begin.`
      : pendingCount > 0
        ? `${pendingCount} quests are still ready to begin.`
        : 'The completed quests are resting on the board now.';

  const handleQuestGo = (id: string) => {
    setSelectedQuestId(id);
    setShowQuestModal(true);
  };

  const handleQuestStart = async () => {
    if (!selectedQuestId) {
      return;
    }

    await questActions.startQuest(selectedQuestId);
    setShowQuestModal(false);
    setSelectedQuestId(null);
  };

  const handleQuestModalClose = () => {
    setShowQuestModal(false);
    setSelectedQuestId(null);
  };

  const handleRecommendationSelect = () => {
    setShowRecommendations(false);
    setShowWelcome(true);
  };

  if (hasNoChildren) {
    return (
      <main className="pt-24 px-4 max-w-2xl mx-auto space-y-8 pb-32">
        <ComicCard bg="yellow" shadow="gold" padding="lg">
          <div className="space-y-3 text-center">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#92400E]">Dashboard</p>
            <h1 className="text-3xl font-black text-[#1C1917]">No child profile yet</h1>
            <p className="text-base font-bold text-stone-600">
              Add a child profile first so the home dashboard can load real quest data.
            </p>
          </div>
        </ComicCard>
      </main>
    );
  }

  if (isOverviewLoading && !activeChild) {
    return (
      <main className="pt-24 px-4 max-w-2xl mx-auto space-y-8 pb-32">
        <div className="space-y-4 animate-pulse">
          <div className="h-28 rounded-[2rem] bg-[#E9D5FF]" />
          <div className="h-40 rounded-[2rem] bg-white" />
          <div className="h-40 rounded-[2rem] bg-white" />
        </div>
      </main>
    );
  }

  if (!activeChild) {
    return null;
  }

  return (
    <>
      <main className="pt-24 px-4 max-w-2xl mx-auto space-y-8 pb-32">
        <MascotSection message={mascotMessage} />

        {errorMessage ? (
          <ComicCard bg="yellow" shadow="gold" padding="md">
            <p className="text-sm font-black text-[#92400E]">{errorMessage}</p>
          </ComicCard>
        ) : null}

        <BentoGrid cols={3} gap="md">
          <ComicCard bg="yellow" shadow="gold" skew="right" padding="md">
            <div className="flex flex-col items-center justify-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#CA8A04]">
                Seeds Collected
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-4xl text-[#FACC15] seed-glow"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                >
                  eco
                </span>
                <span className="text-4xl font-black text-[#1C1917]">
                  {activeChild.seeds}
                </span>
              </div>
            </div>
          </ComicCard>

          <div className="flex items-center justify-center">
            <StreakBadge streak={0} size="md" />
          </div>

          <ComicCard bg="blue" skew="left" padding="md">
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase text-[#0284C7]">
                  Goal Progress
                </span>
                <span className="text-[10px] font-black text-[#0284C7]">
                  {goalProgress}%
                </span>
              </div>
              <ProgressBar
                value={activeChild.goal ? activeChild.seeds : 0}
                max={goalTarget}
                size="md"
                color="bg-[#38BDF8]"
                bgColor="bg-white"
              />
            </div>
          </ComicCard>
        </BentoGrid>

        <QuestSection
          title="Today's Quests"
          badge="Today's Quests"
          badgeColor="bg-[#FB7185]"
        >
          {todayQuests.length ? (
            <div className="space-y-4 mt-4">
              {todayQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  {...quest}
                  onGo={handleQuestGo}
                  isChild
                />
              ))}
            </div>
          ) : (
            <ComicCard bg="white" padding="md" shadow="none" className="mt-4">
              <p className="text-sm font-black text-[#1C1917]">
                Lena is preparing the next calm set of quests now.
              </p>
            </ComicCard>
          )}
        </QuestSection>

        {activeChild.goal ? (
          <DreamGoalCard
            title={activeChild.goal.title}
            subtitle={activeChild.name}
            current={activeChild.seeds}
            goal={activeChild.goal.target}
            message={activeChild.goal.note}
            onAddSeeds={() => setShowRecommendations(true)}
          />
        ) : (
          <ComicCard bg="white" padding="lg" shadow="none">
            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-stone-500">Dream Goal</p>
              <h2 className="text-2xl font-black text-[#1C1917]">No goal yet</h2>
              <p className="text-sm font-bold text-stone-600">
                Quests can still begin today. Add a family goal when you want the progress bar to track something specific.
              </p>
            </div>
          </ComicCard>
        )}

        <div className="h-12" />
      </main>

      <ConfirmationModal
        isOpen={showWelcome}
        onConfirm={() => setShowWelcome(false)}
        onDismiss={() => setShowWelcome(false)}
        title="Ready for an adventure?"
        description="Your garden is waiting for its first magical seeds! Shall we begin?"
      />

      <QuestStartModal
        isOpen={showQuestModal}
        questTitle={selectedQuest?.title ?? ''}
        questDescription={selectedQuest?.description}
        questIcon={selectedQuest?.icon ?? 'task'}
        questCategory={selectedQuest?.category}
        reward={selectedQuest?.reward ?? 0}
        durationMinutes={120}
        onStart={() => void handleQuestStart()}
        onClose={handleQuestModalClose}
      />

      <RecommendationModal
        isOpen={showRecommendations}
        onClose={() => setShowRecommendations(false)}
        recommendations={[...RECOMMENDATIONS]}
        onSelect={handleRecommendationSelect}
      />
    </>
  );
}
