'use client';

// ============================================================
// AdventuresContent — Quest Board
// Uses: quest store
// ============================================================

import { useEffect } from 'react';
import { MascotSection } from '@/components/homestead';
import { ComicButton } from '@/components/homestead';
import { useQuestStore } from '@/stores';

const CATEGORY_COLORS: Record<string, string> = {
  learning:     'bg-[#F472B6]',
  exercise:     'bg-[#38BDF8]',
  responsibility: 'bg-[#FACC15]',
  nature:       'bg-[#34D399]',
};

const CATEGORY_EMOJI: Record<string, string> = {
  learning:     '📚',
  exercise:     '🏃‍♀️',
  responsibility: '🧼',
  nature:       '🌿',
};

const CATEGORY_TITLES: Record<string, string> = {
  learning:     'The Ancient Story',
  exercise:     'Sonic Sprint',
  responsibility: 'Dish Destroyer',
};

const CATEGORY_DESCS: Record<string, string> = {
  learning:     'Read 10 pages of your favorite book to unlock the Wisdom Totem.',
  exercise:     'Run in place for 2 minutes to charge the Homestead batteries!',
  responsibility: 'Clear your plate after dinner to keep the kitchen monsters away.',
};

export function AdventuresContent() {
  const {
    level,
    xp,
    xpToNext,
    todayQuests,
    checkExpiredQuests,
    startQuest,
    completeQuest,
    failQuest,
    uncompleteQuest,
  } = useQuestStore();

  // Auto-fail expired
  useEffect(() => {
    checkExpiredQuests();
    const interval = setInterval(checkExpiredQuests, 60_000);
    return () => clearInterval(interval);
  }, [checkExpiredQuests]);

  const handleDidIt = (category: string) => {
    // Find a pending quest of this category and start it
    const quest = todayQuests.find(
      (q) => q.category === category && q.status === 'pending'
    );
    if (quest) startQuest(quest.id);
  };

  const totalXp = (level - 1) * xpToNext + xp;
  const progressPct = Math.round((xp / xpToNext) * 100);

  // Calculate today's completed quests across all categories
  const completedCount = todayQuests.filter((q) => q.status === 'completed').length;
  const totalCount = todayQuests.length;

  return (
    <>
      <main className="relative min-h-screen pb-28 overflow-hidden">

        {/* Halftone texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#1C1917 1px, transparent 1px)',
            backgroundSize: '12px 12px',
            opacity: 0.04,
          }}
        />

        <div className="container mx-auto px-6 pt-20 relative z-10">

          {/* Mascot */}
          <MascotSection
            message={
              completedCount === totalCount
                ? "You've conquered all quests today! 🏆"
                : `${totalCount - completedCount} more adventures await! ⚡`
            }
            avatarSize={100}
            emoji="⚡"
            className="mb-6"
          />

          {/* Page Title */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="font-black text-5xl md:text-7xl text-[#1C1917] uppercase tracking-tighter transform -rotate-1">
              Quest <span className="text-[#F472B6] italic">Board</span>
            </h1>
            <div className="h-3 w-48 bg-[#38BDF8] mt-2 mx-auto md:mx-0 -skew-x-12 border-2 border-[#1C1917]" />
          </div>

          {/* Quest Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {(['learning', 'exercise', 'responsibility'] as const).map((cat) => {
              const catQuests = todayQuests.filter((q) => q.category === cat);
              const pending = catQuests.find((q) => q.status === 'pending');
              const ongoing = catQuests.find((q) => q.status === 'ongoing');
              const completed = catQuests.filter((q) => q.status === 'completed');

              return (
                <article
                  key={cat}
                  className={`
                    bg-white border-4 border-[#1C1917] p-6
                    skew-panel comic-shadow
                    flex flex-col
                    ${completed.length > 0 ? 'opacity-80' : ''}
                  `}
                >
                  {/* Category badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`
                      ${CATEGORY_COLORS[cat]} text-white px-3 py-1
                      font-black text-xs uppercase rounded border-2 border-[#1C1917]
                    `}>
                      {cat}
                    </span>
                    <span className="text-3xl">{CATEGORY_EMOJI[cat]}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-2xl mb-3 text-[#1C1917] leading-none uppercase">
                    {CATEGORY_TITLES[cat]}
                  </h3>

                  {/* Description */}
                  <p className="font-bold text-base text-slate-600 mb-4 flex-1">
                    {CATEGORY_DESCS[cat]}
                  </p>

                  {/* Status pills */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {pending && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                        {pending.reward} Seeds
                      </span>
                    )}
                    {ongoing && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                        In Progress
                      </span>
                    )}
                    {completed.length > 0 && (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                        Done {completed.length}×
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <ComicButton
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => handleDidIt(cat)}
                    className="comic-shadow"
                  >
                    {completed.length > 0 ? 'DO AGAIN! 🔄' : 'I DID IT! 💪'}
                  </ComicButton>
                </article>
              );
            })}
          </div>

          {/* Level Progress Banner */}
          <div
            className="bg-[#FACC15] border-4 border-[#1C1917] p-6 skew-panel relative overflow-hidden comic-shadow"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-8xl text-[#1C1917]">
                auto_awesome
              </span>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">

              {/* XP progress */}
              <div className="flex-1">
                <h4 className="font-black text-3xl text-[#1C1917] uppercase italic tracking-tighter">
                  Level {level} Explorer
                </h4>

                {/* Bar */}
                <div className="w-full max-w-md bg-white border-4 border-[#1C1917] h-8 mt-2 relative overflow-hidden rounded-full">
                  <div
                    className="h-full bg-[#F472B6] transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: 'radial-gradient(#1C1917 1px, transparent 1px)',
                      backgroundSize: '6px 6px',
                    }}
                  />
                </div>
                <p className="font-black text-xs mt-1.5 uppercase text-[#1C1917]">
                  {xp.toLocaleString()} / {xpToNext.toLocaleString()} XP to next level
                </p>
                <p className="text-[10px] font-bold text-slate-600 mt-0.5">
                  Total: {totalXp.toLocaleString()} XP earned
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-3">
                <div className="bg-white border-4 border-[#1C1917] px-5 py-3 rounded-xl comic-shadow text-center">
                  <p className="font-black text-3xl text-[#F472B6]">{completedCount}</p>
                  <p className="font-black text-[10px] uppercase text-slate-600">Done Today</p>
                </div>
                <div className="bg-white border-4 border-[#1C1917] px-5 py-3 rounded-xl comic-shadow text-center">
                  <p className="font-black text-3xl text-[#34D399]">{totalCount - completedCount}</p>
                  <p className="font-black text-[10px] uppercase text-slate-600">Remaining</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
