'use client';

// ============================================================
// Client Component: Child Home interactive content
// Handles: quest state, modals, quest completion
// Parent: (homestead)/page.tsx (Server Component)
// ============================================================

import { useState } from 'react';
import { ComicCard, BentoGrid, QuestCard, QuestSection, MascotSection, DreamGoalCard, ConfirmationModal, RecommendationModal, ProgressBar } from '@/components/homestead';

const SEED_DATA = { current: 425, goal: 100 };
const LEVEL_DATA = { level: 8, xp: 85, maxXp: 100 };

type QuestStatus = 'pending' | 'completed' | 'approved' | 'pending-parent';

type Quest = {
  id: string;
  title: string;
  category: 'nature' | 'learning' | 'exercise' | 'responsibility';
  icon: string;
  reward: number;
  status: QuestStatus;
};

const TODAY_QUESTS: Quest[] = [
  { id: 'q1', title: 'Water the Sunflowers', category: 'nature',    icon: 'water_drop',   reward: 10, status: 'pending' },
  { id: 'q2', title: 'Feed the Bunnies',     category: 'nature',    icon: 'pets',         reward: 15, status: 'pending' },
  { id: 'q3', title: 'Magic Dust Sorting',   category: 'learning', icon: 'auto_awesome', reward: 20, status: 'pending' },
];

const RECOMMENDATIONS = [
  { id: 'r1', title: 'Plant a Magic Seed',    category: 'Nature Interest',    icon: 'potted_plant',  color: 'text-[#CA8A04]', bgColor: 'bg-[#FEF08A]' },
  { id: 'r2', title: 'Build a Lego Fortress', category: 'Building Interest',  icon: 'architecture',  color: 'text-[#E11D48]', bgColor: 'bg-[#FECDD3]' },
  { id: 'r3', title: 'Paint a Sunset',        category: 'Art Interest',       icon: 'palette',        color: 'text-[#0284C7]', bgColor: 'bg-[#BAE6FD]' },
];

export function ChildHomeContent() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [activeQuests, setActiveQuests] = useState(TODAY_QUESTS);

  const handleQuestGo = (id: string) => {
    setActiveQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'completed' as const } : q))
    );
    setShowWelcome(true);
  };

  const handleRecommendationSelect = () => {
    setShowRecommendations(false);
    setShowWelcome(true);
  };

  return (
    <>
      <main className="pt-24 px-4 max-w-2xl mx-auto space-y-8">

        {/* 1. Mascot Greeting */}
        <MascotSection
          message="Welcome back, Emma! Ready to grow your homestead today?"
          emoji="🌸"
        />

        {/* 2. Stats Grid */}
        <BentoGrid cols={2} gap="md">
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
                <span className="text-4xl font-black text-[#1C1917]">425</span>
              </div>
            </div>
          </ComicCard>

          <ComicCard bg="blue" skew="left" padding="md">
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase text-[#0284C7]">
                  Level {LEVEL_DATA.level}
                </span>
                <span className="text-[10px] font-black text-[#0284C7]">
                  XP {LEVEL_DATA.xp}%
                </span>
              </div>
              <ProgressBar
                value={LEVEL_DATA.xp}
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
            {activeQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                {...quest}
                onGo={handleQuestGo}
              />
            ))}
          </div>
        </QuestSection>

        {/* 4. Dream Goal Widget */}
        <DreamGoalCard
          title="Birthday Gift"
          subtitle="New LEGO Set"
          current={SEED_DATA.current}
          goal={SEED_DATA.goal}
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

      {/* Recommendations Modal */}
      <RecommendationModal
        isOpen={showRecommendations}
        onClose={() => setShowRecommendations(false)}
        recommendations={RECOMMENDATIONS}
        onSelect={handleRecommendationSelect}
      />
    </>
  );
}
