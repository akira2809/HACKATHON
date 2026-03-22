"use client";

// ============================================================
// Client Component: Child Home interactive content
// Uses: useChildDashboardData (API + Zustand hooks)
// Parent: (homestead)/page.tsx (Server Component)
// ============================================================

import { useState } from "react";
import {
  ComicCard,
  BentoGrid,
  QuestCard,
  QuestSection,
  MascotSection,
  DreamGoalCard,
  ConfirmationModal,
  QuestStartModal,
  MaterialIcon,
} from "@/components/homestead";
import { useChildDashboardData } from "@/hooks/useChildDashboardData";

export function ChildHomeContent() {
  const {
    seeds,
    quests,
    pendingQuests,
    currentGoal,
    goalProgress,
    childName,
    isLoading,
    questActions,
  } = useChildDashboardData();

  // Modal state
  const [showWelcome, setShowWelcome] = useState(false);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  // Get selected quest data for modal
  const selectedQuest = quests.find((q) => q.id === selectedQuestId);

  // Quest handlers
  const handleQuestGo = (id: string) => {
    setSelectedQuestId(id);
    setShowQuestModal(true);
  };

  const handleQuestStart = () => {
    if (selectedQuestId) {
      questActions.startQuest(selectedQuestId);
      setShowQuestModal(false);
      setSelectedQuestId(null);
    }
  };

  const handleQuestModalClose = () => {
    setShowQuestModal(false);
    setSelectedQuestId(null);
  };

  const handleQuestComplete = (id: string) => {
    questActions.completeQuest(id);
  };

  const handleQuestFail = (id: string) => {
    questActions.removeQuest(id);
  };

  // Mascot message
  const pendingCount = pendingQuests.length;
  const mascotMessage =
    pendingCount === quests.length && quests.length > 0
      ? `Welcome back, ${childName || 'friend'}! Ready to grow your homestead today? 🌸`
      : pendingCount > 0
        ? `${pendingCount} quests left — keep going! 💪`
        : quests.length === 0
          ? "No quests yet! Check back soon for adventures."
          : "All done! You're a superstar! ⭐";

  return (
    <>
      <main className="pt-24 px-4 max-w-2xl mx-auto space-y-8 pb-10">
        {/* 1. Mascot Greeting */}
        <MascotSection message={mascotMessage} />

        {/* 2. Stats Grid */}
        <BentoGrid cols={2} gap="md">
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
                  {isLoading ? "—" : seeds}
                </span>
              </div>
            </div>
          </ComicCard>

          {/* Streak Badge */}
          <div className="flex items-center justify-center">
            {/* TODO: Add streak from quest_streaks API */}
            <div className="w-16 h-16 bg-[#FBF8F1] border-4 border-[#D8E3D1] rounded-full flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
          </div>
        </BentoGrid>

        {/* 3. Today's Quests */}
        <QuestSection
          title="Today's Quests"
          badge="Today's Quests"
          badgeColor="bg-[#FB7185]"
        >
          <div className="space-y-4 mt-4">
            {isLoading ? (
              <div className="text-center py-8 text-[#7C8E76]">
                Loading quests...
              </div>
            ) : quests.length === 0 ? (
              <div className="text-center py-8">
                <MaterialIcon icon="explore" className="!text-4xl text-[#7C8E76] mx-auto mb-2" />
                <p className="text-sm text-[#7C8E76]">
                  No quests yet! Ask a parent to create some adventures.
                </p>
              </div>
            ) : (
              quests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  id={quest.id}
                  title={quest.title}
                  description={quest.description}
                  category="default"
                  icon="task"
                  reward={quest.reward}
                  status={quest.status}
                  onGo={handleQuestGo}
                  onComplete={handleQuestComplete}
                  onUncomplete={() => {}}
                  onFail={handleQuestFail}
                  isChild
                />
              ))
            )}
          </div>
        </QuestSection>

        {/* 4. Dream Goal Widget */}
        {currentGoal && (
          <DreamGoalCard
            title={currentGoal.title}
            subtitle="Keep going!"
            current={seeds}
            goal={currentGoal.target_coins}
            message={`${goalProgress}% complete - Keep going!`}
            navigateToAdventures="/adventures"
          />
        )}

        {/* Bottom Nav Spacer */}
        <div className="h-12" />
      </main>

      {/* FAB: Recommendations */}
      <button
        onClick={() => setShowWelcome(true)}
        className="
          fixed bottom-30 right-4
          w-14 h-14
          bg-[#F472B6] text-white
          rounded-full
          border-4 border-[#1C1917]
          comic-shadow
          flex items-center justify-center
          hover:scale-110 hover:bg-[#F9A8D4]
          active:scale-95 active:shadow-none
          transition-all duration-200
          cursor-pointer
          z-50
          animate-bounce-float
        "
        style={{
          animation: "bounce-float 3s ease-in-out infinite",
          boxShadow: "4px 4px 0px #1c1917, 0 0 12px rgba(244, 114, 182, 0.4)",
        }}
        aria-label="Get recommendations"
      >
        <MaterialIcon icon="lightbulb" className="!text-2xl" filled />
      </button>

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
        questTitle={selectedQuest?.title ?? ""}
        questDescription={selectedQuest?.description}
        questIcon={selectedQuest?.title ? "task" : "task"}
        questCategory={selectedQuest?.status}
        reward={selectedQuest?.reward ?? 0}
        durationMinutes={120}
        onStart={handleQuestStart}
        onClose={handleQuestModalClose}
      />
    </>
  );
}
