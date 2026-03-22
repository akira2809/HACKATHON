"use client";

// ============================================================
// MomentsContent — Family Moments
// Uses: useChildDashboardData (API) + AI Moments Generation
// ============================================================

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ComicCard, ComicButton, MascotSection } from "@/components/homestead";
import {
  CreateMomentModal,
  type CreateMomentData,
} from "@/components/homestead/CreateMomentModal";
import { useChildDashboardData } from "@/hooks/useChildDashboardData"; 
import {
  generateMomentsWithAgent,
  type GeneratedActivityItem,
} from "@/lib/agent";
import type { ActivityRecord } from "@/lib/homestead-api";

const ITEMS_PER_PAGE = 4;

export function MomentsContent() {
  const router = useRouter();
  const {
    seeds,
    activities,
    childName,
    familyId,
    childId,
    isActivitiesLoading,
    activityActions,
    activitiesQuery,
  } = useChildDashboardData();

  const refetchActivities = () => activitiesQuery.refetch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // AI Moments Generation State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiMoments, setAiMoments] = useState<GeneratedActivityItem[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showAiMoments, setShowAiMoments] = useState(false);

  // Sort activities by id descending (newest first)
  const sortedActivities = [...activities].sort((a, b) => b.id.localeCompare(a.id));
  const latestActivity = sortedActivities[0] ?? null;

  // Pagination
  const totalPages = Math.ceil(sortedActivities.length / ITEMS_PER_PAGE);
  const paginatedActivities = sortedActivities.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  // Use selected activity or latest
  const displayActivity = selectedActivity ?? latestActivity;

  // Calculate stats
  const totalActivities = activities.length;
  const completedActivities = activities.filter((a) => a.completed).length;

  // Generate AI moments
  const generateAiMoments = useCallback(async () => {
    if (!familyId || !childId) {
      setAiError("Missing family or child information");
      return;
    }

    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const response = await generateMomentsWithAgent({
        familyId,
        childId,
        childAge: undefined,
        location: undefined,
        theme: undefined,
      });

      const moments = response.suggestions ?? response.activities ?? [];
      setAiMoments(moments);
      setShowAiMoments(true);
    } catch (err) {
      setAiError(
        err instanceof Error ? err.message : "Failed to generate moments"
      );
    } finally {
      setIsGeneratingAi(false);
    }
  }, [familyId, childId]);

  // Select AI moment to create
  const selectAiMoment = useCallback(
    async (moment: GeneratedActivityItem) => {
      if (!familyId || !childId) return;

      try {
        await activityActions.createActivity({
          activity: moment.title,
          locationName: moment.location || "Home",
          mapsLink: "",
          familyId,
          childId,
        });

        await refetchActivities();
        setAiMoments([]);
        setShowAiMoments(false);
        setIsModalOpen(false);
      } catch (err) {
        setAiError(
          err instanceof Error ? err.message : "Failed to create moment"
        );
      }
    },
    [familyId, childId, activityActions, refetchActivities]
  );

  // Close AI moments panel
  const closeAiMoments = useCallback(() => {
    setAiMoments([]);
    setShowAiMoments(false);
    setAiError(null);
  }, []);

  // Handle create moment
  const handleCreateMoment = async (data: CreateMomentData) => {
    await activityActions.createActivity({
      activity: data.activity,
      locationName: data.locationName,
      mapsLink: data.mapsLink,
      familyId: data.familyId,
      childId: data.childId,
    });
    await refetchActivities();
  };

  // Handle activity complete
  const handleCompleteActivity = async (activityId: string) => {
    await activityActions.completeActivity(activityId, { completed: true });
    await refetchActivities();
  };

  // Select activity card
  const handleSelectActivity = (activity: ActivityRecord) => {
    setSelectedActivity(activity);
  };

  // Back to latest
  const handleBackToLatest = () => {
    setSelectedActivity(null);
  };

  if (isActivitiesLoading) {
    return (
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-gray-200 rounded-3xl" />
          <div className="h-64 bg-gray-200 rounded-3xl" />
        </div>
      </main>
    );
  }

  if (!latestActivity) {
    return (
      <>
        <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">
          {/* Hero Banner */}
          <div
            className="bg-[#38BDF8] border-4 border-[#1C1917] p-8 shadow-[8px_8px_0px_#1C1917] relative overflow-hidden mb-8"
            style={{ transform: "skewX(-2deg)" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                backgroundSize: "8px 8px",
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
              <div className="mt-6 flex gap-3 flex-wrap">
                <ComicButton
                  variant="gold"
                  size="md"
                  icon="add_circle"
                  onClick={() => setIsModalOpen(true)}
                >
                  CREATE MOMENT! 🌿
                </ComicButton>
                <ComicButton
                  variant="success"
                  size="md"
                  icon="auto_awesome"
                  onClick={generateAiMoments}
                  disabled={isGeneratingAi}
                >
                  {isGeneratingAi ? "GENERATING..." : "AI SUGGEST! ✨"}
                </ComicButton>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="text-center py-20">
            <MascotSection message="No moments yet! Create your first family moment." />
          </div>
        </main>

        <CreateMomentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateMoment}
          familyId={familyId}
          childId={childId}
        />
      </>
    );
  }

  return (
    <>
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-28">
        {/* ── Hero Section ─────────────────────────────── */}
        <div className="relative mb-12">
          {/* Back button when viewing selected activity */}
          {selectedActivity && (
            <button
              onClick={handleBackToLatest}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 bg-white border-4 border-[#1C1917] rounded-full w-12 h-12 flex items-center justify-center shadow-[4px_4px_0px_#1C1917] hover:scale-110 transition-transform"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          )}

          {/* Hero Banner */}
          <div
            className="bg-[#38BDF8] border-4 border-[#1C1917] p-8 shadow-[8px_8px_0px_#1C1917] relative overflow-hidden"
            style={{ transform: "skewX(-2deg)" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                backgroundSize: "8px 8px",
                opacity: 0.2,
              }}
            />
            <div className="relative z-10">
              <h1 className="font-black italic text-4xl text-white uppercase tracking-tight mb-3 drop-shadow-[2px_2px_0px_#1C1917]">
                {selectedActivity ? "Activity Details" : "Family Moments"}
              </h1>
              <p className="text-white text-lg font-extrabold max-w-md drop-shadow-[1px_1px_0px_#1C1917]">
                {selectedActivity
                  ? `Viewing: ${selectedActivity.activity}`
                  : "Crafting heroic legacies, one small growth at a time."}
              </p>
              <div className="mt-6 flex gap-3 flex-wrap">
                <ComicButton
                  variant="gold"
                  size="md"
                  icon="add_circle"
                  onClick={() => setIsModalOpen(true)}
                >
                  CREATE MOMENT! 🌿
                </ComicButton>
                <ComicButton
                  variant="success"
                  size="md"
                  icon="auto_awesome"
                  onClick={generateAiMoments}
                  disabled={isGeneratingAi}
                >
                  {isGeneratingAi ? "GENERATING..." : "AI SUGGEST! ✨"}
                </ComicButton>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Activity Card ─────────────────────────────── */}
        <div
          className="bg-white border-4 border-[#1C1917] p-8 shadow-[8px_8px_0px_#1C1917] mb-8"
          style={{ transform: "skewX(-2deg)" }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <span
              className={`font-black text-xs uppercase px-4 py-1 border-2 border-[#1C1917] ${displayActivity.completed ? "bg-green-400" : "bg-[#FACC15]"}`}
            >
              {displayActivity.locationName || "Family Activity"}
            </span>
            <span
              className={`font-black text-2xl px-3 py-1 ${displayActivity.completed ? "bg-[#34D399]" : "bg-[#1C1917]"}`}
            >
              {displayActivity.completed ? "✓" : "⏳"}
            </span>
          </div>

          {/* Content */}
          <h2 className="font-black text-3xl mb-4 text-[#1C1917] italic">
            {displayActivity.activity}
          </h2>
          <p className="font-medium text-lg text-stone-600 mb-6 leading-relaxed">
            {displayActivity.mapsLink ? (
              <a
                href={displayActivity.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View location: {displayActivity.locationName}
              </a>
            ) : (
              "No location set yet."
            )}
          </p>

          {/* Child indicator */}
          <div className="flex gap-4 items-center mb-6">
            <div className="flex -space-x-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#1C1917] bg-[#38BDF8] overflow-hidden shadow-[2px_2px_0px_#1C1917]">
                <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-white text-xs font-black">
                  {childName?.[0]?.toUpperCase() || "C"}
                </div>
              </div>
            </div>
            <span className="font-black text-xs uppercase tracking-widest text-[#1C1917]">
              {childName || "Child"} · Activity{" "}
              {displayActivity.completed ? "Completed" : "In Progress"}
            </span>
          </div>

          {/* CTA */}
          <div className="flex gap-3 mt-4">
            {displayActivity.completed ? (
              <div className="flex-1 bg-green-100 border-4 border-green-400 rounded-xl p-4 text-center">
                <span className="font-black text-green-600">
                  ✓ Completed!
                </span>
              </div>
            ) : (
              <>
                <ComicButton
                  variant="success"
                  size="lg"
                  icon="check"
                  onClick={() => handleCompleteActivity(displayActivity.id)}
                  className="flex-1"
                >
                  COMPLETE!
                </ComicButton>
                <ComicButton
                  variant="danger"
                  size="lg"
                  icon="play_arrow"
                  onClick={() => router.push("/moments/proximity")}
                >
                  CHECK IN!
                </ComicButton>
              </>
            )}
          </div>
        </div>

        {/* ── Activity History ──────────────────────── */}
        <div className="mb-8">
          <h3 className="font-black italic text-xl text-[#1C1917] uppercase mb-6 tracking-tight">
            Activity History ({totalActivities})
          </h3>

          {sortedActivities.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {paginatedActivities.map((activity) => (
                  <div
                    key={activity.id}
                    onClick={() => handleSelectActivity(activity)}
                    className={`border-4 border-[#1C1917] p-4 bg-white shadow-[4px_4px_0px_#1C1917] cursor-pointer hover:shadow-[6px_6px_0px_#1C1917] hover:scale-[1.02] transition-all ${
                      selectedActivity?.id === activity.id
                        ? "ring-4 ring-[#38BDF8] ring-offset-2"
                        : ""
                    }`}
                    style={{ transform: "skewX(-2deg)" }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-black text-sm uppercase">
                        {activity.locationName || "Activity"}
                      </span>
                      <span
                        className={`text-lg ${activity.completed ? "text-green-500" : "text-yellow-500"}`}
                      >
                        {activity.completed ? "✓" : "⏳"}
                      </span>
                    </div>
                    <p className="text-base font-bold text-[#1C1917] mt-2">
                      {activity.activity}
                    </p>
                    <span
                      className={`inline-block mt-3 text-xs font-bold px-3 py-1 rounded-full ${
                        activity.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {activity.completed ? "✓ Done" : "⏳ Pending"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="w-10 h-10 bg-white border-4 border-[#1C1917] rounded-full flex items-center justify-center font-black disabled:opacity-50 hover:bg-gray-100 transition-colors"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-10 h-10 border-4 border-[#1C1917] rounded-full font-black transition-colors ${
                        currentPage === i
                          ? "bg-[#38BDF8] text-white"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={currentPage === totalPages - 1}
                    className="w-10 h-10 bg-white border-4 border-[#1C1917] rounded-full flex items-center justify-center font-black disabled:opacity-50 hover:bg-gray-100 transition-colors"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-stone-500">
              <p>No activity history yet.</p>
            </div>
          )}
        </div>

        {/* ── Stats & Seeds Sidebar ──────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activity Stats */}
          <ComicCard shadow="none" padding="md">
            <h3 className="font-black uppercase mb-4 text-[#1C1917] text-base">
              Activity Stats
            </h3>
            <div className="h-8 bg-stone-100 border-4 border-[#1C1917] relative overflow-hidden rounded-full">
              <div
                className="h-full bg-[#38BDF8] transition-all duration-500"
                style={{
                  width: `${
                    totalActivities > 0
                      ? (completedActivities / totalActivities) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <div className="mt-2 flex justify-between font-black text-sm text-[#1C1917]">
              <span>Activities</span>
              <span>
                {completedActivities}/{totalActivities}
              </span>
            </div>
          </ComicCard>

          {/* Seeds Card */}
          <ComicCard bg="yellow" shadow="gold" padding="md">
            <h3 className="font-black uppercase mb-4 text-[#1C1917] text-base">
              Seeds
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌱</span>
              <span className="text-4xl font-black text-[#1C1917]">
                {seeds}
              </span>
            </div>
          </ComicCard>
        </div>
      </main>

      {/* ── AI Moments Suggestions Panel ─────────────────── */}
      {showAiMoments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeAiMoments}
          />

          <div className="relative bg-white border-4 border-[#1C1917] rounded-3xl shadow-[8px_8px_0px_#1C1917] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 border-b-4 border-[#1C1917]">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-black text-2xl text-white uppercase italic">
                    ✨ AI Suggested Moments
                  </h2>
                  <p className="text-white/80 text-sm">
                    Pick a moment that sparks joy for your family!
                  </p>
                </div>
                <button
                  onClick={closeAiMoments}
                  className="w-10 h-10 bg-white rounded-full border-4 border-[#1C1917] flex items-center justify-center font-black text-[#1C1917] hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {aiError && (
                <div className="bg-red-100 border-4 border-red-400 rounded-xl p-4 mb-4">
                  <p className="text-red-600 font-bold text-sm">{aiError}</p>
                </div>
              )}

              {aiMoments.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {aiMoments.map((moment, index) => (
                    <div
                      key={moment.id || index}
                      className="border-4 border-[#1C1917] rounded-xl p-4 bg-gradient-to-br from-blue-50 to-purple-50 shadow-[4px_4px_0px_#1C1917] hover:shadow-[6px_6px_0px_#1C1917] transition-all cursor-pointer hover:scale-[1.02]"
                      onClick={() => selectAiMoment(moment)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-black text-lg text-[#1C1917]">
                          {moment.title}
                        </span>
                        <span className="bg-[#FACC15] border-2 border-[#1C1917] px-2 py-1 rounded-lg text-xs font-black">
                          {moment.duration || "15 min"}
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 mb-3">
                        {moment.description}
                      </p>
                      <div className="flex flex-wrap gap-2 items-center">
                        {moment.location && (
                          <span className="bg-blue-100 border-2 border-blue-300 px-2 py-1 rounded-lg text-xs font-bold">
                            📍 {moment.location}
                          </span>
                        )}
                        {moment.supplies && moment.supplies.length > 0 && (
                          <span className="bg-green-100 border-2 border-green-300 px-2 py-1 rounded-lg text-xs font-bold">
                            🎒 {moment.supplies.slice(0, 2).join(", ")}
                          </span>
                        )}
                        <span className="bg-yellow-100 border-2 border-yellow-300 px-2 py-1 rounded-lg text-xs font-bold ml-auto">
                          🌱 {moment.rewards?.seeds ?? 5} seeds
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-stone-500 font-medium">No moments generated yet.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t-4 border-[#1C1917] bg-gray-50">
              <button
                onClick={closeAiMoments}
                className="w-full bg-gray-200 border-4 border-[#1C1917] rounded-xl py-3 font-black uppercase hover:bg-gray-300 transition-all"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateMomentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateMoment}
        familyId={familyId}
        childId={childId}
      />
    </>
  );
}
