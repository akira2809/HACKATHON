'use client';

// ============================================================
// DreamsContent — Dream Tracker
// Dynamic data from useChildDashboardData (API)
// ============================================================

import {
  ComicCard,
  MascotSection,
  DreamGoalCard,
  MaterialIcon,
} from '@/components/homestead';
import { useChildDashboardData } from '@/hooks/useChildDashboardData';

export function DreamsContent() {
  const {
    seeds,
    currentGoal,
    goalProgress,
    isGoalsLoading,
  } = useChildDashboardData();

  // Lena's mascot message based on progress
  const getMascotMessage = () => {
    if (!currentGoal) {
      return "Your dream shelf is waiting. Let's set a goal together!";
    }
    if (goalProgress >= 100) {
      return "Amazing! Your dream has come true! What a wonderful journey.";
    }
    if (goalProgress >= 75) {
      return "Almost there! Your dream is within reach. Keep going, dear.";
    }
    if (goalProgress >= 50) {
      return "Halfway to your dream! Every seed counts, you're doing wonderfully.";
    }
    if (goalProgress >= 25) {
      return "Great start! Your dream is growing beautifully.";
    }
    return `You're ${goalProgress}% to your dream. Every small step matters!`;
  };

  // If no active goal, show placeholder state
  if (!currentGoal) {
    return (
      <main className="max-w-md mx-auto px-4 pt-20 space-y-8 pb-32">
        {/* Mascot */}
        <MascotSection message={getMascotMessage()} />

        {/* Empty State */}
        <div className="bg-[#FBF8F1] border-4 border-[#D8E3D1] rounded-3xl p-8 text-center">
          <MaterialIcon icon="favorite" className="!text-5xl text-[#8E7BAF] mx-auto mb-4" />
          <h2 className="font-bold text-xl text-[#2F342C] mb-2">No Dream Yet</h2>
          <p className="text-sm text-[#7C8E76] leading-relaxed">
            Your dream shelf is empty. Ask a parent to help set a dream!
          </p>
        </div>

        {/* Current Seeds */}
        <ComicCard bg="yellow" shadow="gold" padding="md">
          <div className="flex flex-col items-center justify-center space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#CA8A04]">
              Seeds Collected
            </span>
            <div className="flex items-center gap-2">
              <MaterialIcon icon="eco" filled className="!text-4xl text-[#FACC15]" />
              <span className="text-4xl font-black text-[#1C1917]">
                {isGoalsLoading ? '—' : seeds}
              </span>
            </div>
          </div>
        </ComicCard>

        {/* Seed History placeholder */}
        <section className="space-y-4">
          <h3 className="text-lg font-black text-[#1C1917] uppercase tracking-tighter px-1">
            Seed History
          </h3>
          <p className="text-sm text-[#7C8E76] px-1">
            No seeds collected yet. Complete quests to earn seeds!
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-4 pt-20 space-y-8 pb-32">
      {/* Mascot */}
      <MascotSection message={getMascotMessage()} />

      {/* Dream Goal Card */}
      <DreamGoalCard
        title={currentGoal.title}
        subtitle="Keep going!"
        current={seeds}
        goal={currentGoal.target_coins}
        message={`${goalProgress}% complete - Keep going!`}
      />

      {/* Current Seeds */}
      <ComicCard bg="yellow" shadow="gold" padding="md">
        <div className="flex flex-col items-center justify-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#CA8A04]">
            Seeds Collected
          </span>
          <div className="flex items-center gap-2">
            <MaterialIcon icon="eco" filled className="!text-4xl text-[#FACC15]" />
            <span className="text-4xl font-black text-[#1C1917]">
              {isGoalsLoading ? '—' : seeds}
            </span>
          </div>
        </div>
      </ComicCard>

      {/* Seed History placeholder */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-black text-[#1C1917] uppercase tracking-tighter">
            Seed History
          </h3>
          <span className="text-xs font-medium text-[#7C8E76]">
            Coming soon
          </span>
        </div>
        <p className="text-sm text-[#7C8E76] px-1">
          No seeds collected yet. Complete quests to earn seeds!
        </p>
      </section>
    </main>
  );
}
