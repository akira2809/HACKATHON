'use client';

// ============================================================
// Client Component: Child Home interactive content
// Uses: quest store (zustand/persist → localStorage)
// Parent: (homestead)/page.tsx (Server Component)
// ============================================================

import { useEffect, useState } from 'react';
import {
  ComicCard,
  BentoGrid,
  QuestCard,
  QuestSection,
  MascotSection,
  DreamGoalCard,
  ConfirmationModal,
  QuestStartModal,
  RecommendationModal,
  ProgressBar,
  StreakBadge,
} from '@/components/homestead';
import { useQuestStore } from '@/stores';

export function ChildHomeContent() {
  const {
    seeds,
    level,
    xp,
    xpToNext,
    streak,
    todayQuests,
    showWelcome,
    showRecommendations,
    recommendations,
    checkExpiredQuests,
    checkAndUpdateStreak,
    startQuest,
    completeQuest,
    uncompleteQuest,
    failQuest,
    setShowWelcome,
    setShowRecommendations,
  } = useQuestStore();

  // Quest start modal state
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  // Get selected quest data for modal
  const selectedQuest = todayQuests.find((q) => q.id === selectedQuestId);

  // On mount: check streak + auto-fail expired quests + interval
  useEffect(() => {
    checkAndUpdateStreak();
    checkExpiredQuests();
    const interval = setInterval(checkExpiredQuests, 60_000);
    return () => clearInterval(interval);
  }, [checkAndUpdateStreak, checkExpiredQuests]);

  const handleQuestGo = (id: string) => {
    setSelectedQuestId(id);
    setShowQuestModal(true);
  };

  const handleQuestStart = () => {
    if (selectedQuestId) {
      startQuest(selectedQuestId);
      setShowQuestModal(false);
      setSelectedQuestId(null);
    }
  };

  const handleQuestModalClose = () => {
    setShowQuestModal(false);
    setSelectedQuestId(null);
  };

  const handleQuestComplete = (id: string) => {
    completeQuest(id);
  };

  const handleQuestUncomplete = (id: string) => {
    uncompleteQuest(id);
  };

  const handleQuestFail = (id: string) => {
    failQuest(id);
  };

  const handleRecommendationSelect = () => {
    setShowRecommendations(false);
    setShowWelcome(true);
  };

  const pendingCount = todayQuests.filter((q) => q.status === 'pending').length;
  const mascotMessage =
    pendingCount === todayQuests.length
      ? "Welcome back! Ready to grow your homestead today? 🌸"
      : pendingCount > 0
      ? `${pendingCount} quests left — keep going! 💪`
      : "All done! You're a superstar! ⭐";

  return (
    <>
      <main className="pt-24 px-4 max-w-2xl mx-auto space-y-8 pb-32">

        {/* 1. Mascot Greeting */}
        <MascotSection message={mascotMessage} />

        {/* 2. Stats Grid */}
        <BentoGrid cols={3} gap="md">
          {/* Seeds */}
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
                  {seeds}
                </span>
              </div>
            </div>
          </ComicCard>

          {/* Streak Badge */}
          <div className="flex items-center justify-center">
            <StreakBadge streak={streak} size="md" />
          </div>

          {/* Level Progress */}
          <ComicCard bg="blue" skew="left" padding="md">
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase text-[#0284C7]">
                  Level {level}
                </span>
                <span className="text-[10px] font-black text-[#0284C7]">
                  XP {xp}%
                </span>
              </div>
              <ProgressBar
                value={xp}
                max={xpToNext}
                size="md"
                color="bg-[#38BDF8]"
                bgColor="bg-white"
              />
            </div>
          </ComicCard>
        </BentoGrid>

        {/* 3. Today's Quests */}
        <QuestSection
          title="Today's Quests"
          badge="Today's Quests"
          badgeColor="bg-[#FB7185]"
        >
          <div className="space-y-4 mt-4">
            {todayQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                {...quest}
                onGo={handleQuestGo}
                onComplete={handleQuestComplete}
                onUncomplete={handleQuestUncomplete}
                onFail={handleQuestFail}
                isChild
              />
            ))}
          </div>
        </QuestSection>

        {/* 4. Dream Goal Widget */}
        <DreamGoalCard
          title="Birthday Gift"
          subtitle="New LEGO Set"
          current={seeds}
          goal={100}
          message="Keep going! You're almost at the Lego set! 🧱"
          onAddSeeds={() => setShowRecommendations(true)}
        />

        {/* Bottom Nav Spacer */}
        <div className="h-12" />
      </main>

      {/* Welcome Modal */}
      <ConfirmationModal
        isOpen={showWelcome}
        onConfirm={() => setShowWelcome(false)}
        onDismiss={() => setShowWelcome(false)}
        title="Ready for an adventure?"
        description="Your garden is waiting for its first magical seeds! Shall we begin?"
      />

      {/* Quest Start Modal */}
      <QuestStartModal
        isOpen={showQuestModal}
        questTitle={selectedQuest?.title ?? ''}
        questDescription={selectedQuest?.description}
        questIcon={selectedQuest?.icon ?? 'task'}
        questCategory={selectedQuest?.category}
        reward={selectedQuest?.reward ?? 0}
        durationMinutes={selectedQuest?.expiredAt && selectedQuest?.startedAt
          ? Math.round((selectedQuest.expiredAt - selectedQuest.startedAt) / 60000)
          : 120}
        onStart={handleQuestStart}
        onClose={handleQuestModalClose}
      />

      {/* Recommendations Modal */}
      <RecommendationModal
        isOpen={showRecommendations}
        onClose={() => setShowRecommendations(false)}
        recommendations={recommendations}
        onSelect={handleRecommendationSelect}
      />
    </>
  );
}
