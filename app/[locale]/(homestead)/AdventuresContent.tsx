"use client";

// ============================================================
// AdventuresContent — Quest Board
// Gamified quest cards with cozy hearth aesthetic
// Uses: useChildDashboardData (API + Zustand hooks)
// ============================================================

import { MascotSection, ComicButton, MaterialIcon } from "@/components/homestead";
import { useChildDashboardData } from "@/hooks/useChildDashboardData"; 

// Category icons (Material Symbols)
const CATEGORY_ICONS: Record<string, string> = {
  learning: "menu_book",
  exercise: "directions_run",
  responsibility: "cleaning_services",
  nature: "eco",
};

// Softer, warmer category colors (pastel + cozy)
const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; light: string }> = {
  learning: { bg: "bg-[#E9D5FF]", border: "border-[#7E22CE]", text: "text-[#5B21B6]", light: "bg-violet-100 text-violet-700" },
  exercise: { bg: "bg-[#BAE6FD]", border: "border-[#0284C7]", text: "text-[#0369A1]", light: "bg-sky-100 text-sky-700" },
  responsibility: { bg: "bg-[#FEF08A]", border: "border-[#CA8A04]", text: "text-[#92400E]", light: "bg-amber-100 text-amber-700" },
  nature: { bg: "bg-[#A7F3D0]", border: "border-[#059669]", text: "text-[#047857]", light: "bg-emerald-100 text-emerald-700" },
};

// Map quest status to category for display
const getCategoryFromStatus = (status: string): string => {
  // Default category when no specific category is set
  return "learning";
};

export function AdventuresContent() {
  const {
    quests,
    completedQuests,
    ongoingQuests,
    pendingQuests,
    isQuestsLoading,
    questActions,
  } = useChildDashboardData();

  // Calculate stats
  const completedCount = completedQuests.length;
  const ongoingCount = ongoingQuests.length;
  const pendingCount = pendingQuests.length;
  const totalCount = quests.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Mascot message
  const mascotMessage =
    completedCount === totalCount && totalCount > 0
      ? "You've conquered all quests today! What a champion!"
      : ongoingCount > 0
      ? "You're on a roll! Keep going, champion!"
      : `${pendingCount > 0 ? `${pendingCount} more adventures await! Let's do this!` : "Welcome to your Quest Board! Ready for an adventure?"}`;

  return (
    <>
      <main className="relative min-h-screen pb-24 overflow-hidden">

        {/* Background texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#1C1917 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            opacity: 0.03,
          }}
        />

        <div className="container mx-auto px-4 pt-20 relative z-10 max-w-4xl">

          {/* Mascot */}
          <MascotSection
            message={mascotMessage}
            avatarSize={90}
            className="mb-6"
          />

          {/* Page Title + Progress */}
          <div className="mb-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h1 className="font-black text-3xl md:text-4xl text-[#2F342C] uppercase tracking-tight leading-none">
                  Quest <span className="text-[#7E22CE] italic">Board</span>
                </h1>
                <div className="h-2 w-32 bg-[#BAE6FD] mt-2 -skew-x-12 border-2 border-[#0284C7] rounded-full" />
              </div>

              {/* Progress ring */}
              {totalCount > 0 && (
                <div className="flex flex-col items-center">
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#E5E7EB" strokeWidth="5" />
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke="#6E8B63"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={`${(progressPct / 100) * 150.8} 150.8`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-bold text-sm text-[#2F342C]">
                      {progressPct}%
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-[#7C8E76] mt-1 uppercase tracking-wide">
                    Done
                  </span>
                </div>
              )}
            </div>

            {/* Stats pills */}
            {totalCount > 0 && (
              <div className="flex gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-white border-2 border-[#D8E3D1] rounded-full px-3 py-1.5 shadow-sm">
                  <MaterialIcon icon="check_circle" className="!text-sm text-[#6E8B63]" />
                  <span className="text-sm font-semibold text-[#2F342C]">{completedCount} Done</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white border-2 border-[#D8E3D1] rounded-full px-3 py-1.5 shadow-sm">
                  <MaterialIcon icon="pending" className="!text-sm text-[#CA8A04]" />
                  <span className="text-sm font-semibold text-[#2F342C]">{pendingCount} Left</span>
                </div>
                {ongoingCount > 0 && (
                  <div className="flex items-center gap-1.5 bg-white border-2 border-[#D8E3D1] rounded-full px-3 py-1.5 shadow-sm">
                    <MaterialIcon icon="play_circle" className="!text-sm text-[#0284C7]" />
                    <span className="text-sm font-semibold text-[#2F342C]">{ongoingCount} Active</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quest Cards */}
          <div className="space-y-3">
            {isQuestsLoading ? (
              /* Loading state */
              <div className="bg-[#FBF8F1] border-4 border-[#D8E3D1] rounded-3xl p-10 text-center shadow-md">
                <p className="text-[#7C8E76] text-sm leading-relaxed">
                  Loading quests...
                </p>
              </div>
            ) : totalCount === 0 ? (
              /* Empty state */
              <div className="bg-[#FBF8F1] border-4 border-[#D8E3D1] rounded-3xl p-10 text-center shadow-md">
                <MaterialIcon icon="explore" className="!text-5xl text-[#7C8E76] mx-auto mb-4" />
                <h3 className="font-bold text-xl text-[#2F342C] mb-2">No Quests Yet!</h3>
                <p className="text-[#7C8E76] text-sm leading-relaxed">
                  Check back soon for new adventures!
                </p>
              </div>
            ) : (
              quests.map((quest) => {
                // Map status to display category (default to learning)
                const displayCategory = getCategoryFromStatus(quest.status);
                const colors = CATEGORY_COLORS[displayCategory] || CATEGORY_COLORS.learning;
                const iconName = CATEGORY_ICONS[displayCategory] || "star";
                const isCompleted = quest.status === "completed";
                const isOngoing = quest.status === "ongoing";
                const isPending = quest.status === "pending";

                return (
                  <article
                    key={quest.id}
                    className={`
                      bg-[#FBF8F1] border-3 border-[#D8E3D1] rounded-2xl overflow-hidden
                      shadow-sm transition-all duration-200
                      ${isCompleted ? "opacity-70" : ""}
                      ${isOngoing ? "border-[#0284C7] border-3 ring-2 ring-[#BAE6FD]" : ""}
                      hover:shadow-md hover:border-[#B8C6B1]
                    `}
                  >
                    {/* Card header */}
                    <div className={`${colors.bg} ${colors.text} px-4 py-3 flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg ${colors.border} border-2 bg-white/30 flex items-center justify-center`}>
                          <MaterialIcon icon={iconName} className={`!text-lg ${colors.text}`} />
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                            {displayCategory}
                          </span>
                          <h3 className="font-bold text-base leading-tight capitalize" style={{ fontFamily: "inherit" }}>
                            {quest.title}
                          </h3>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div
                        className={`
                          px-2.5 py-1 rounded-full border ${colors.border} text-[10px] font-bold uppercase tracking-wide
                          ${isCompleted ? "bg-white/50" : ""}
                          ${isOngoing ? "bg-white/50" : ""}
                          ${isPending ? "bg-white/50" : ""}
                        `}
                      >
                        {isCompleted && "Done"}
                        {isOngoing && "Active"}
                        {isPending && "Ready"}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4">
                      {/* Description */}
                      <p className="text-sm text-[#5B6550] leading-relaxed mb-4" style={{ lineHeight: "1.6" }}>
                        {quest.description || `Complete this quest to earn seeds!`}
                      </p>

                      {/* Reward + Timer */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1.5 bg-[#FEF9C3] border border-[#E6C766] rounded-full px-3 py-1">
                          <MaterialIcon icon="eco" className="!text-sm text-[#CA8A04]" />
                          <span className="text-sm font-semibold text-[#92400E]">
                            {quest.reward} Seeds
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {isPending && (
                          <ComicButton
                            variant="primary"
                            size="md"
                            fullWidth
                            icon="play_arrow"
                            onClick={() => questActions.startQuest(quest.id)}
                          >
                            Start Quest
                          </ComicButton>
                        )}

                        {isOngoing && (
                          <>
                            <ComicButton
                              variant="success"
                              size="md"
                              icon="check"
                              onClick={() => questActions.completeQuest(quest.id)}
                              className="flex-1"
                            >
                              Done!
                            </ComicButton>
                            <ComicButton
                              variant="danger"
                              size="md"
                              icon="close"
                              onClick={() => questActions.removeQuest(quest.id)}
                            >
                              Fail
                            </ComicButton>
                          </>
                        )}

                        {isCompleted && (
                          <div className="flex-1 text-center py-2 bg-[#A7F3D0] rounded-lg">
                            <span className="text-xs font-semibold text-[#047857]">
                              ✓ Completed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Bottom decoration */}
          <div className="mt-10 pt-6 text-center">
            <div className="inline-flex items-center gap-2 text-[#B8C6B1]">
              <MaterialIcon icon="potted_plant" className="!text-2xl" />
              <span className="text-xs font-medium tracking-wide">Keep growing!</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
