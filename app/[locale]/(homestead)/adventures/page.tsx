// ============================================================
// Screen: Child Adventures / Quest Board
// Route: (homestead)/adventures/page.tsx
// Layout: (homestead)/layout.tsx (TopNav + BottomNav via pathname)
// ============================================================

import { MascotSection } from "@/components/homestead";
import { ComicButton } from "@/components/homestead";

const QUEST_CATEGORIES = [
  {
    category: "Learning" as const,
    label: "Learning",
    color: "bg-[#F472B6]",
    emoji: "📚",
    title: "The Ancient Story",
    description:
      "Read 10 pages of your favorite book to unlock the Wisdom Totem.",
    reward: 5,
  },
  {
    category: "Exercise" as const,
    label: "Exercise",
    color: "bg-[#38BDF8]",
    emoji: "🏃‍♀️",
    title: "Sonic Sprint",
    description:
      "Run in place for 2 minutes to charge the Homestead batteries!",
    reward: 10,
  },
  {
    category: "Responsibility" as const,
    label: "Responsibility",
    color: "bg-[#FACC15]",
    emoji: "🧼",
    title: "Dish Destroyer",
    description:
      "Clear your plate after dinner to keep the kitchen monsters away.",
    reward: 15,
  },
];

const LEVEL_XP = { current: 2450, goal: 3000, level: 4 };
const NEXT_PRIZE = "🏆 Golden Watering Can";

export default function AdventuresPage() {
  return (
    <>
      <main className="relative min-h-screen pb-28 overflow-hidden">
        {/* Halftone background texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#1C1917 1px, transparent 1px)",
            backgroundSize: "12px 12px",
            opacity: 0.04,
          }}
        />

        <div className="container mx-auto px-6 pt-20 relative z-10">
          {/* Mascot Section */}
          <MascotSection
            message="New adventures appear!"
            avatarSize={128}
            emoji="⚡"
            className="mb-8"
          />

          {/* Page Title */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="font-black text-5xl md:text-7xl text-[#1C1917] uppercase tracking-tighter transform -rotate-1">
              Quest{" "}
              <span className="text-[#F472B6] text-stroke italic">Board</span>
            </h1>
            <div className="h-3 w-48 bg-[#38BDF8] mt-2 mx-auto md:mx-0 -skew-x-12 border-2 border-[#1C1917]" />
          </div>

          {/* Quest Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {QUEST_CATEGORIES.map((quest) => (
              <article
                key={quest.category}
                className="
                  bg-white border-4 border-[#1C1917] p-6
                  skew-panel comic-shadow
                  group hover:bg-[#E0F2FE] transition-all
                  flex flex-col
                "
              >
                {/* Category badge + emoji */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`${quest.color} text-white px-3 py-1 font-black text-xs uppercase rounded border-2 border-[#1C1917]`}
                  >
                    {quest.label}
                  </span>
                  <span className="text-3xl">{quest.emoji}</span>
                </div>

                {/* Title */}
                <h3 className="font-black text-2xl mb-3 text-[#1C1917] leading-none uppercase">
                  {quest.title}
                </h3>

                {/* Description */}
                <p className="font-bold text-base text-slate-600 mb-6 flex-1">
                  {quest.description}
                </p>

                {/* CTA Button */}
                <button
                  className="
                    w-full bg-[#38BDF8] text-white font-black text-xl py-3
                    border-4 border-[#1C1917] comic-shadow
                    hover:translate-y-0.5 hover:translate-x-0.5
                    hover:shadow-[2px_2px_0px_#1C1917]
                    active:translate-y-1 active:shadow-none
                    transition-all uppercase tracking-tight
                  "
                >
                  I DID IT! 💪
                </button>

                {/* Reward */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="font-black text-sm text-[#F472B6]">
                    +{quest.reward} SEEDS
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Level Progress Banner */}
          <div
            className="
              bg-[#FACC15] border-4 border-[#1C1917] p-6
              skew-panel relative overflow-hidden comic-shadow
            "
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-8xl text-[#1C1917]">
                auto_awesome
              </span>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-black text-3xl text-[#1C1917] uppercase italic tracking-tighter">
                  Level {LEVEL_XP.level} Explorer
                </h4>
                {/* XP Bar */}
                <div className="w-72 bg-white border-4 border-[#1C1917] h-8 mt-2 relative overflow-hidden">
                  <div
                    className="h-full bg-[#F472B6] relative"
                    style={{
                      width: `${(LEVEL_XP.current / LEVEL_XP.goal) * 100}%`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "radial-gradient(#1C1917 1px, transparent 1px)",
                        backgroundSize: "6px 6px",
                      }}
                    />
                  </div>
                </div>
                <p className="font-black text-xs mt-1.5 uppercase text-[#1C1917]">
                  {LEVEL_XP.current.toLocaleString()} /{" "}
                  {LEVEL_XP.goal.toLocaleString()} XP to next level
                </p>
              </div>

              {/* Prize Card */}
              <div
                className="
                bg-white border-4 border-[#1C1917]
                px-6 py-4 rounded-xl
                -rotate-2 comic-shadow
                whitespace-nowrap
              "
              >
                <p className="font-black text-xl text-[#F472B6] uppercase">
                  Legendary Prize: {NEXT_PRIZE.split(" ")[0]}
                </p>
                <p className="font-black text-[#1C1917] uppercase tracking-widest text-sm">
                  {NEXT_PRIZE.replace(/^[^\s]+\s/, "")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
