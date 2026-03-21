"use client";

// ============================================================
// Client Component: Child Home interactive content
// Uses: quest store (zustand/persist → localStorage)
// Parent: (homestead)/page.tsx (Server Component)
// ============================================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  StreakBadge,
  MaterialIcon,
} from "@/components/homestead";
import { useQuestStore } from "@/stores";
import { getChildQuestsFromStorage, getAvailableChildIds } from "@/lib/child-quests";

export function ChildHomeContent() {
  const router = useRouter();
  const {
    seeds,
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
    initFromData,
  } = useQuestStore();

  // Quest start modal state
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Get selected quest data for modal
  const selectedQuest = todayQuests.find((q) => q.id === selectedQuestId);

  // On mount: load approved quests from localStorage + check streak
  useEffect(() => {
    // Sync approved quests from parent dashboard
    const syncQuests = () => {
      const childIds = getAvailableChildIds();

      if (childIds.length > 0) {
        setIsSyncing(true);
        try {
          // Get quests from the first available child's approved quests
          const childId = childIds[0];
          const approvedQuests = getChildQuestsFromStorage(childId);

          if (approvedQuests.length > 0) {
            // Get current quests from store
            const currentQuests = useQuestStore.getState().todayQuests;

            // Merge with existing quests (keep unique by id)
            const existingIds = new Set(currentQuests.map(q => q.id));
            const newQuests = approvedQuests.filter(q => !existingIds.has(q.id));

            if (newQuests.length > 0) {
              initFromData({
                todayQuests: [...currentQuests, ...newQuests],
              });
            }
          }
        } finally {
          setIsSyncing(false);
        }
      }
    };

    // Run sync
    syncQuests();

    // Check streak
    checkAndUpdateStreak();
    checkExpiredQuests();

    // Set up interval for expired check
    const interval = setInterval(checkExpiredQuests, 60_000);
    return () => clearInterval(interval);
  }, [checkAndUpdateStreak, checkExpiredQuests, initFromData]);

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

  const handleOpenRecommendations = () => {
    setShowRecommendations(true);
  };

  const pendingCount = todayQuests.filter((q) => q.status === "pending").length;
  const mascotMessage =
    pendingCount === todayQuests.length
      ? "Welcome back! Ready to grow your homestead today? 🌸"
      : pendingCount > 0
        ? `${pendingCount} quests left — keep going! 💪`
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
                  {seeds}
                </span>
              </div>
            </div>
          </ComicCard>

          {/* Streak Badge */}
          <div className="flex items-center justify-center">
            <StreakBadge streak={streak} size="md" />
          </div>
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
          message="Keep going! You're almost at the Lego set!"
          navigateToAdventures="/adventures"
        />

        {/* Bottom Nav Spacer */}
        <div className="h-12" />
      </main>

      {/* FAB: Recommendations */}
      <button
        onClick={handleOpenRecommendations}
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
        questIcon={selectedQuest?.icon ?? "task"}
        questCategory={selectedQuest?.category}
        reward={selectedQuest?.reward ?? 0}
        durationMinutes={
          selectedQuest?.expiredAt && selectedQuest?.startedAt
            ? Math.round(
                (selectedQuest.expiredAt - selectedQuest.startedAt) / 60000,
              )
            : 120
        }
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
