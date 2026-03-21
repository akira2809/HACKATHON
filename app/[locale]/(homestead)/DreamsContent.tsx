'use client';

// ============================================================
// Client Component: Dream Tracker interactive content
// Handles: dream goal card with onAddSeeds handler
// Parent: (homestead)/dreams/page.tsx (Server Component)
// ============================================================

import { ComicCard, BentoGrid, MascotSection, DreamGoalCard, SeedHistoryItem } from '@/components/homestead';

const ACTIVE_DREAM = {
  title: 'Birthday Gift',
  subtitle: 'New LEGO Set',
  current: 30,
  goal: 100,
};

const STORY_PROGRESS = [
  { label: 'Chapter 2', value: 'Chapter 2', sub: 'The Blue Forest', icon: 'auto_stories', iconColor: 'text-rose-600', bg: 'bg-rose-200' },
  { label: 'Badges', value: '9 Badges', sub: 'Keep it up!', icon: 'verified', iconColor: 'text-emerald-600', bg: 'bg-emerald-200' },
];

const SEED_HISTORY = [
  { title: 'Cleaned Room', time: 'Today, 4:30 PM', amount: 5, icon: 'brush', iconBg: 'bg-sky-100', iconColor: 'text-sky-600' },
  { title: 'Read 20 Mins', time: 'Yesterday', amount: 10, icon: 'menu_book', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
];

export function DreamsContent() {
  return (
    <main className="max-w-md mx-auto px-4 pt-20 space-y-8">

      {/* Mascot + Message */}
      <MascotSection message="AMAZING! Seeds earned!" />

      {/* Dream Goal Card */}
      <DreamGoalCard
        title={ACTIVE_DREAM.title}
        subtitle={ACTIVE_DREAM.subtitle}
        current={ACTIVE_DREAM.current}
        goal={ACTIVE_DREAM.goal}
        badge="BIG DREAM"
        badgeColor="bg-yellow-400"
        message="Keep going! You're 30% there!"
        onAddSeeds={() => alert('Add seeds!')}
      />

      {/* Story Progress */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-[#1C1917] uppercase tracking-tighter px-1">
          Story Progress
        </h3>
        <BentoGrid cols={2} gap="md">
          {STORY_PROGRESS.map((item) => (
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
                  data-icon={item.icon}
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
          {SEED_HISTORY.map((item) => (
            <SeedHistoryItem key={item.title} {...item} />
          ))}
        </div>
      </section>

      {/* Spacer */}
      <div className="h-12" />
    </main>
  );
}
