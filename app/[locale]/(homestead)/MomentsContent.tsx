'use client';

// ============================================================
// MomentsContent — Family Moments
// Uses: moment store + quest store (for seeds)
// ============================================================

import { useRouter } from 'next/navigation';
import { ComicCard, ComicButton } from '@/components/homestead';
import { useMomentStore, useQuestStore } from '@/stores';

export function MomentsContent() {
  const router = useRouter();
  const {
    activeMoment,
    upcomingActivities,
    recentMemories,
    momentXp,
    momentLevel,
    xpToNext,
  } = useMomentStore();

  const { seeds } = useQuestStore();

  if (!activeMoment) {
    return (
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">
        <div className="text-center py-20">
          <p className="font-black text-2xl text-slate-400">No active moment</p>
          <ComicButton variant="gold" size="lg" className="mt-6">
            GENERATE MOMENT! 🌿
          </ComicButton>
        </div>
      </main>
    );
  }

  const progressPct = Math.round((momentXp / xpToNext) * 100);

  return (
    <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">

      {/* ── Hero Section ─────────────────────────────── */}
      <div className="relative mb-12">

        {/* Mascot peeking top-right */}
        <div className="absolute -top-8 -right-4 z-20 w-32 h-32 hover:scale-110 transition-transform cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvAUdCiRolxM-2AOr96STNpbUb77wPzFny4OipaEqgjs3CFWUpxCQwiSC-3hNIDAznK2ytDt4zUo3nwe6UHx-QFzAWF5bn8Uu6OISsFl8aNy05sGsndYWEbvpTZEl0SLa2EeJDr0GEzu8iDtx-qZ9y7VVB-Z5WTQ25prqtd32j82TB6zQNx_f69xNKEw0nX6FVxomAcR0Ke9a0MjdZZADXnu4tMDv9hY0LFRCq5Is5Q6hxuMs-NHdAkHtHy2dLMdJQnFgVHRbM8CHE"
            alt="Lena the Flower Nymph"
            width={128}
            height={128}
            className="object-contain"
          />
          <div
            className="absolute -left-36 top-0 bg-white border-4 border-[#1C1917] p-3 shadow-[4px_4px_0px_#1C1917] rounded-xl w-40 text-sm font-black leading-tight"
            style={{ transform: 'skewX(-2deg)' }}
          >
            Homestead connection — SOLID! 💪
          </div>
        </div>

        {/* Hero Banner */}
        <div
          className="bg-[#38BDF8] border-4 border-[#1C1917] p-8 shadow-[8px_8px_0px_#1C1917] relative overflow-hidden"
          style={{ transform: 'skewX(-2deg)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
              backgroundSize: '8px 8px',
              opacity: 0.2,
            }}
          />
          <div className="relative z-10">
            <h1 className="font-black italic text-4xl text-white uppercase tracking-tight mb-3 drop-shadow-[2px_2px_0px_#1C1917]">
              Family Moments
            </h1>
            <p className="text-white text-lg font-extrabold max-w-md drop-shadow-[1px_1px_0px_#1C1917]">
              Crafting heroic legacies, one small growth at a time.
            </p>
            <div className="mt-6">
              <ComicButton variant="gold" size="md" icon="add_circle">
                GENERATE MOMENT! 🌿
              </ComicButton>
            </div>
          </div>
        </div>
      </div>

      {/* ── Proximity Indicator ───────────────────────── */}
      <div className="mb-10 flex justify-center">
        <div className="bg-[#34D399] text-white border-4 border-[#1C1917] px-6 py-2 rounded-full font-bold flex items-center gap-3 comic-shadow">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
          >
            wifi_tethering
          </span>
          <span>HOMESTEAD CONNECTION — SOLID! 💪</span>
        </div>
      </div>

      {/* ── Bento Layout ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">

        {/* Active Moment Card (8 cols) */}
        <div
          className="md:col-span-8 bg-white border-4 border-[#1C1917] p-8 flex flex-col justify-between comic-shadow"
          style={{ transform: 'skewX(-2deg)' }}
        >
          <div>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <span className="bg-[#FACC15] border-2 border-[#1C1917] px-4 py-1 font-black text-xs uppercase tracking-tighter">
                {activeMoment.badge}
              </span>
              <span className="font-black text-2xl bg-[#1C1917] text-white px-3 py-1">
                {activeMoment.time}
              </span>
            </div>

            {/* Content */}
            <h2 className="font-black text-5xl mb-4 text-[#1C1917] italic">
              {activeMoment.title}
            </h2>
            <p className="font-medium text-lg text-stone-600 mb-6 leading-relaxed">
              {activeMoment.description}
            </p>

            {/* Participants */}
            <div className="flex gap-4 items-center mb-6">
              <div className="flex -space-x-3">
                {activeMoment.participants.map((p) => (
                  <div
                    key={p.role}
                    className="w-12 h-12 rounded-full border-2 border-[#1C1917] bg-[#38BDF8] overflow-hidden shadow-[2px_2px_0px_#1C1917]"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-white text-xs font-black">
                      {p.role[0].toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
              <span className="font-black text-xs uppercase tracking-widest text-[#1C1917]">
                Parent-Child Activity · +{activeMoment.xpReward} XP
              </span>
            </div>
          </div>

          {/* CTA — navigate to proximity check first */}
          <ComicButton
            variant="danger"
            size="xl"
            icon="play_arrow"
            fullWidth
            onClick={() => router.push('/moments/proximity')}
            className="comic-shadow-pink mt-4"
          >
            START MOMENT! 🚀
          </ComicButton>
        </div>

        {/* Stats Sidebar (4 cols) */}
        <div className="md:col-span-4 space-y-6">

          {/* Moment XP */}
          <ComicCard shadow="none" padding="md" className="skew-panel" style={{ transform: 'skewX(-2deg)' }}>
            <h3 className="font-black uppercase mb-4 text-[#1C1917] text-base">Moment XP</h3>

            {/* Bar */}
            <div className="h-8 bg-stone-100 border-4 border-[#1C1917] relative overflow-hidden rounded-full">
              <div
                className="h-full bg-[#38BDF8] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between font-black text-sm text-[#1C1917]">
              <span>LVL {momentLevel}</span>
              <span>{momentXp}/{xpToNext}</span>
            </div>
          </ComicCard>

          {/* Recent Memories */}
          <ComicCard bg="yellow" shadow="gold" padding="md" className="skew-panel relative overflow-hidden" style={{ transform: 'skewX(-2deg)' }}>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#1C1917 1px, transparent 1px)',
                backgroundSize: '8px 8px',
                opacity: 0.05,
              }}
            />
            <h3 className="font-black uppercase mb-4 text-[#1C1917] text-base relative z-10">
              Recent Memories
            </h3>
            <div className="space-y-3 relative z-10">
              {recentMemories.map((mem) => (
                <div key={mem.id} className="flex items-center gap-3">
                  <span className={`material-symbols-outlined font-black ${mem.color}`}>
                    {mem.icon}
                  </span>
                  <span className="font-black uppercase text-xs">{mem.label}</span>
                </div>
              ))}
            </div>
          </ComicCard>
        </div>
      </div>

      {/* ── Upcoming Activities ──────────────────────── */}
      <div>
        <h3 className="font-black italic text-xl text-[#1C1917] uppercase mb-6 tracking-tight">
          Queue of Adventures
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {upcomingActivities.map((act) => (
            <div
              key={act.id}
              className={`
                border-4 border-[#1C1917] p-4 flex flex-col items-center text-center
                ${act.locked ? 'bg-stone-200 opacity-70' : 'bg-white'}
                shadow-[4px_4px_0px_#1C1917]
                cursor-pointer hover:bg-blue-50 transition-colors
              `}
              style={{ transform: 'skewX(-2deg)' }}
            >
              <span
                className={`material-symbols-outlined text-3xl mb-2 ${act.locked ? 'text-stone-400' : 'text-[#1C1917]'}`}
              >
                {act.icon}
              </span>
              <span className="font-black text-xs uppercase">{act.label}</span>
              <span className={`font-bold text-[10px] mt-1 ${act.locked ? 'text-stone-600' : 'text-stone-500'}`}>
                {act.duration}
              </span>
              {act.locked && act.requiredLevel && (
                <span className="text-[9px] font-black text-stone-500 mt-0.5">
                  Req. LVL {act.requiredLevel}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
