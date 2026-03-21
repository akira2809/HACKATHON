'use client';

// ============================================================
// DreamsContent — Dream Tracker
// Dynamic data from dream.store + quest.store
// ============================================================

import {
  ComicCard,
  BentoGrid,
  MascotSection,
  DreamGoalCard,
  SeedHistoryItem,
  MaterialIcon,
} from '@/components/homestead';
import { useQuestStore, useDreamStore } from '@/stores';

export function DreamsContent() {
  // Get seeds from quest store
  const seeds = useQuestStore((state) => state.seeds);

  // Get dream data from dream store
  const activeDream = useDreamStore((state) => state.activeDream);
  const seedHistory = useDreamStore((state) => state.seedHistory);

  // Calculate progress based on actual seeds from quest store
  const progressPct = activeDream
    ? Math.round((seeds / activeDream.goal) * 100)
    : 0;

  // Lena's mascot message based on progress
  const getMascotMessage = () => {
    if (!activeDream) {
      return "Your dream shelf is waiting. Let's set a goal together!";
    }
    if (progressPct >= 100) {
      return "Amazing! Your dream has come true! What a wonderful journey.";
    }
    if (progressPct >= 75) {
      return "Almost there! Your dream is within reach. Keep going, dear.";
    }
    if (progressPct >= 50) {
      return "Halfway to your dream! Every seed counts, you're doing wonderfully.";
    }
    if (progressPct >= 25) {
      return "Great start! Your dream is growing beautifully.";
    }
    return `You're ${progressPct}% to your dream. Every small step matters!`;
  };

  // If no active dream, show placeholder state
  if (!activeDream) {
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
              <span className="text-4xl font-black text-[#1C1917]">{seeds}</span>
            </div>
          </div>
        </ComicCard>

        {/* Seed History */}
        <section className="space-y-4">
          <h3 className="text-lg font-black text-[#1C1917] uppercase tracking-tighter px-1">
            Seed History
          </h3>
          {seedHistory.length > 0 ? (
            <div className="space-y-3">
              {seedHistory.map((item) => (
                <SeedHistoryItem key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#7C8E76] px-1">
              No seeds collected yet. Complete quests to earn seeds!
            </p>
          )}
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
        title={activeDream.title}
        subtitle={activeDream.subtitle}
        current={seeds}
        goal={activeDream.goal}
        badge={activeDream.badge}
        badgeColor={activeDream.badgeColor}
        message={`${progressPct}% complete - Keep going!`}
      />

      {/* Current Seeds */}
      <ComicCard bg="yellow" shadow="gold" padding="md">
        <div className="flex flex-col items-center justify-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#CA8A04]">
            Seeds Collected
          </span>
          <div className="flex items-center gap-2">
            <MaterialIcon icon="eco" filled className="!text-4xl text-[#FACC15]" />
            <span className="text-4xl font-black text-[#1C1917]">{seeds}</span>
          </div>
        </div>
      </ComicCard>

      {/* Seed History */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-black text-[#1C1917] uppercase tracking-tighter">
            Seed History
          </h3>
          <span className="text-xs font-medium text-[#7C8E76]">
            {seedHistory.length} {seedHistory.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        {seedHistory.length > 0 ? (
          <div className="space-y-3">
            {seedHistory.map((item) => (
              <SeedHistoryItem key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#7C8E76] px-1">
            No seeds collected yet. Complete quests to earn seeds!
          </p>
        )}
      </section>
    </main>
  );
}
