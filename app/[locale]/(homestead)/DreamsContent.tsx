'use client';

// ============================================================
// DreamsContent — Dream Tracker
// Uses: quest store (seeds) + dream store
// ============================================================

import {
  ComicCard,
  BentoGrid,
  MascotSection,
  DreamGoalCard,
  SeedHistoryItem,
} from '@/components/homestead';
import { useQuestStore, useDreamStore } from '@/stores';

export function DreamsContent() {
  const { seeds } = useQuestStore();
  const { activeDream, seedHistory } = useDreamStore();

  const dream = activeDream ?? {
    title: 'Birthday Gift',
    subtitle: 'New LEGO Set',
    current: 30,
    goal: 100,
    badge: 'BIG DREAM',
    badgeColor: 'bg-yellow-400',
    message: "Keep going! You're 30% there!",
  };

  const progressPct = Math.round((dream.current / dream.goal) * 100);

  return (
    <main className="max-w-md mx-auto px-4 pt-20 space-y-8">

      {/* Mascot */}
      <MascotSection
        message={
          progressPct >= 100
            ? "Goal reached! Amazing! 🏆"
            : `You're ${progressPct}% to your dream! Keep going! 🌱`
        }
      />

      {/* Dream Goal Card */}
      <DreamGoalCard
        title={dream.title}
        subtitle={dream.subtitle}
        current={dream.current}
        goal={dream.goal}
        badge={dream.badge}
        badgeColor={dream.badgeColor}
        message={dream.message}
        onAddSeeds={() => {}}
      />

      {/* Story Progress */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-[#1C1917] uppercase tracking-tighter px-1">
          Story Progress
        </h3>
        <BentoGrid cols={2} gap="md">
          {[
            {
              label: 'Chapter 2',
              value: 'Chapter 2',
              sub: 'The Blue Forest',
              icon: 'auto_stories',
              iconColor: 'text-rose-600',
              bg: 'bg-rose-200',
            },
            {
              label: 'Badges',
              value: '9 Badges',
              sub: 'Keep it up!',
              icon: 'verified',
              iconColor: 'text-emerald-600',
              bg: 'bg-emerald-200',
            },
          ].map((item) => (
            <ComicCard
              key={item.label}
              bg={item.bg === 'bg-rose-200' ? 'pink' : 'mint'}
              shadow={item.bg === 'bg-rose-200' ? 'pink' : 'mint'}
              padding="md"
            >
              <div className="flex flex-col justify-between h-full">
                <span
                  className="material-symbols-outlined !text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                >
                  {item.icon}
                </span>
                <div>
                  <p className="font-black text-[#1C1917] leading-tight">{item.value}</p>
                  <p className="text-[10px] font-bold uppercase opacity-70">{item.sub}</p>
                </div>
              </div>
            </ComicCard>
          ))}
        </BentoGrid>
      </section>

      {/* Seed History */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-black text-[#1C1917] uppercase tracking-tighter">
            Seed History
          </h3>
          <button className="text-[#0284C7] font-bold text-xs uppercase underline">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {seedHistory.map((item) => (
            <SeedHistoryItem key={item.id} {...item} />
          ))}
        </div>
      </section>

      {/* Spacer */}
      <div className="h-12" />
    </main>
  );
}
