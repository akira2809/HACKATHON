'use client';

// ============================================================
// MomentsContent — Family Moments
// Uses: useChildDashboardData (API)
// ============================================================

import { useRouter } from 'next/navigation';
import { ComicCard, ComicButton, MascotSection } from '@/components/homestead';
import { useChildDashboardData } from '@/hooks/useChildDashboardData';

export function MomentsContent() {
  const router = useRouter();
  const {
    seeds,
    activities,
    childName,
    isActivitiesLoading,
  } = useChildDashboardData();

  // Get latest activity
  const latestActivity = activities[0] ?? null;

  // Calculate some stats (placeholder for now)
  const totalActivities = activities.length;
  const completedActivities = activities.filter((a) => a.completed).length;

  if (!latestActivity) {
    return (
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">
        {/* Hero Banner */}
        <div
          className="bg-[#38BDF8] border-4 border-[#1C1917] p-8 shadow-[8px_8px_0px_#1C1917] relative overflow-hidden mb-8"
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
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-20">
          <MascotSection message="No moments yet! Start a quest to create your first family moment." />
          <ComicButton variant="gold" size="lg" className="mt-6">
            START AN ADVENTURE! 🌿
          </ComicButton>
        </div>
      </main>
    );
  }

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
                CREATE MOMENT! 🌿
              </ComicButton>
            </div>
          </div>
        </div>
      </div>

      {/* ── Proximity Indicator ───────────────────────── */}
      <div className="mb-10 flex justify-center">
        <div className="bg-[#34D399] text-white border-4 border-[#1C1917] px-6 py-2 rounded-full font-bold flex items-center gap-3 shadow-[4px_4px_0px_#1C1917]">
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
          className="md:col-span-8 bg-white border-4 border-[#1C1917] p-8 shadow-[8px_8px_0px_#1C1917]"
          style={{ transform: 'skewX(-2deg)' }}
        >
          <div>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <span className="bg-[#FACC15] border-2 border-[#1C1917] px-4 py-1 font-black text-xs uppercase tracking-tighter">
                {latestActivity.locationName || 'Family Activity'}
              </span>
              <span className={`font-black text-2xl px-3 py-1 ${latestActivity.completed ? 'bg-[#34D399] text-white' : 'bg-[#1C1917] text-white'}`}>
                {latestActivity.completed ? '✓' : '⏳'}
              </span>
            </div>

            {/* Content */}
            <h2 className="font-black text-3xl mb-4 text-[#1C1917] italic">
              {latestActivity.activity}
            </h2>
            <p className="font-medium text-lg text-stone-600 mb-6 leading-relaxed">
              {latestActivity.mapsLink ? (
                <a href={latestActivity.mapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  View location: {latestActivity.locationName}
                </a>
              ) : (
                'No location set yet.'
              )}
            </p>

            {/* Child indicator */}
            <div className="flex gap-4 items-center mb-6">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#1C1917] bg-[#38BDF8] overflow-hidden shadow-[2px_2px_0px_#1C1917]">
                  <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-white text-xs font-black">
                    {childName?.[0]?.toUpperCase() || 'C'}
                  </div>
                </div>
              </div>
              <span className="font-black text-xs uppercase tracking-widest text-[#1C1917]">
                {childName || 'Child'} · Activity {latestActivity.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>

          {/* CTA */}
          <ComicButton
            variant="danger"
            size="xl"
            icon="play_arrow"
            fullWidth
            onClick={() => router.push('/moments/proximity')}
            className="mt-4"
          >
            START MOMENT! 🚀
          </ComicButton>
        </div>

        {/* Stats Sidebar (4 cols) */}
        <div className="md:col-span-4 space-y-6">

          {/* Moment XP */}
          <ComicCard shadow="none" padding="md" style={{ transform: 'skewX(-2deg)' }}>
            <h3 className="font-black uppercase mb-4 text-[#1C1917] text-base">Activity Stats</h3>

            {/* Progress Bar */}
            <div className="h-8 bg-stone-100 border-4 border-[#1C1917] relative overflow-hidden rounded-full">
              <div
                className="h-full bg-[#38BDF8] transition-all duration-500"
                style={{ width: `${totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between font-black text-sm text-[#1C1917]">
              <span>Activities</span>
              <span>{completedActivities}/{totalActivities}</span>
            </div>
          </ComicCard>

          {/* Seeds Card */}
          <ComicCard bg="yellow" shadow="gold" padding="md" style={{ transform: 'skewX(-2deg)' }}>
            <h3 className="font-black uppercase mb-4 text-[#1C1917] text-base">Seeds</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌱</span>
              <span className="text-4xl font-black text-[#1C1917]">{seeds}</span>
            </div>
          </ComicCard>
        </div>
      </div>

      {/* ── Activity History ──────────────────────── */}
      {activities.length > 1 && (
        <div>
          <h3 className="font-black italic text-xl text-[#1C1917] uppercase mb-6 tracking-tight">
            Activity History
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.slice(0, 6).map((activity) => (
              <div
                key={activity.id}
                className="border-4 border-[#1C1917] p-4 bg-white shadow-[4px_4px_0px_#1C1917]"
                style={{ transform: 'skewX(-2deg)' }}
              >
                <span className="font-black text-sm uppercase">{activity.locationName || 'Activity'}</span>
                <p className="text-xs text-stone-500 mt-1">{activity.activity}</p>
                <span className={`inline-block mt-2 text-xs font-bold px-2 py-1 rounded ${activity.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {activity.completed ? '✓ Done' : '⏳ Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
