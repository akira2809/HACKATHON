'use client';

import { useMemo, useState } from 'react';
import { ComicButton, ComicCard } from '@/components/homestead';
import { useActivities } from '@/hooks/useActivities';
import { useChildren } from '@/hooks/useChildren';
import { useFamilies } from '@/hooks/useFamilies';
import { useAppState } from '@/state/appState';

type ActivitySuggestion = {
  description: string;
  emoji: string;
  id: string;
  title: string;
};

const ACTIVITY_SUGGESTION_TEMPLATES: ActivitySuggestion[] = [
  {
    description: 'Take turns moving pieces, laughing, and making one cozy memory together.',
    emoji: '🎲',
    id: 'board-game',
    title: 'Play a board game together',
  },
  {
    description: 'Pick a short favorite story and make the room feel calm for shared reading.',
    emoji: '📚',
    id: 'story-time',
    title: 'Read a short story together',
  },
  {
    description: 'Share paper, colors, and one simple idea to draw side by side.',
    emoji: '🎨',
    id: 'drawing-time',
    title: 'Draw a picture together',
  },
];

export function MomentsContent() {
  const configuredFamilyId = useAppState((state) => state.familyId);
  const selectedChildId = useAppState((state) => state.selectedChildId);

  const familiesQuery = useFamilies();
  const family = familiesQuery.families.find((item) => item.id === configuredFamilyId) ?? familiesQuery.families[0] ?? null;
  const familyId = family?.id;

  const childrenQuery = useChildren(familyId, {
    enabled: Boolean(familyId),
  });
  const activeChild = childrenQuery.children.find((child) => child.id === selectedChildId) ?? childrenQuery.children[0] ?? null;

  const activitiesQuery = useActivities(familyId, {
    enabled: Boolean(familyId),
  });

  const currentRequest = useMemo(() => {
    if (!activeChild) {
      return null;
    }

    const openRequests = activitiesQuery.activities.filter(
      (activity) => activity.childId === activeChild.id && !activity.completed,
    );

    return openRequests[openRequests.length - 1] ?? null;
  }, [activeChild, activitiesQuery.activities]);

  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);

  const selectedSuggestion = ACTIVITY_SUGGESTION_TEMPLATES.find(
    (suggestion) => suggestion.id === selectedSuggestionId,
  ) ?? null;

  const handleRequestActivity = async () => {
    if (!familyId || !activeChild || !selectedSuggestion || currentRequest) {
      return;
    }

    setIsSubmitting(true);
    setRequestError(null);
    setRequestMessage(null);

    try {
      await activitiesQuery.createActivity({
        activity: selectedSuggestion.title,
        childId: activeChild.id,
        familyId,
        locationName: null,
        mapsLink: null,
      });
      await activitiesQuery.refetch();

      setRequestMessage(`Lena sent "${selectedSuggestion.title}" to your parent.`);
      setSelectedSuggestionId(null);
    } catch {
      setRequestError('Your family moment could not be sent just yet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (familiesQuery.isLoading || childrenQuery.isLoading || activitiesQuery.isLoading) {
    return (
      <main className="mx-auto max-w-2xl space-y-6 px-4 pb-32 pt-24">
        <div className="animate-pulse space-y-4">
          <div className="h-32 rounded-[28px] bg-[#F5E7B2]" />
          <div className="h-40 rounded-[28px] bg-white" />
          <div className="h-40 rounded-[28px] bg-white" />
        </div>
      </main>
    );
  }

  if (!activeChild) {
    return (
      <main className="mx-auto max-w-2xl px-4 pb-32 pt-24">
        <ComicCard bg="yellow" shadow="gold" padding="lg">
          <div className="space-y-3 text-center">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#92400E]">Family Moments</p>
            <h1 className="text-3xl font-black text-[#1C1917]">No child profile yet</h1>
            <p className="text-base font-bold text-stone-600">
              Add a child profile before asking Lena to send a family activity request.
            </p>
          </div>
        </ComicCard>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 pb-32 pt-24">
      <ComicCard bg="blue" padding="lg" shadow="none">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0369A1]">Family Moments</p>
            <h1 className="mt-2 text-4xl font-black italic text-white">Choose one shared activity</h1>
            <p className="mt-3 max-w-lg text-base font-bold text-white/90">
              Pick one cozy idea for {activeChild.name}. Lena will send it to your parent so they can set the family time.
            </p>
          </div>

          <div className="rounded-3xl border-4 border-[#1C1917] bg-white px-5 py-4">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">How it works</p>
            <p className="mt-2 text-base font-bold text-[#1C1917]">
              Choose 1 activity, send it to your parent, then wait for the family plan.
            </p>
          </div>
        </div>
      </ComicCard>

      {currentRequest ? (
        <ComicCard bg="yellow" shadow="gold" padding="lg">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#92400E]">Request Sent</p>
              <h2 className="mt-2 text-3xl font-black text-[#1C1917]">{currentRequest.activity}</h2>
            </div>
            <p className="text-base font-bold leading-7 text-stone-700">
              Your parent has the request now. They can open Moments on the parent side and choose the family time window.
            </p>
            <div className="rounded-3xl border-4 border-[#1C1917] bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-[#1C1917]">
              Waiting for parent planning
            </div>
          </div>
        </ComicCard>
      ) : (
        <>
          <section className="space-y-4">
            {ACTIVITY_SUGGESTION_TEMPLATES.map((suggestion) => {
              const isSelected = selectedSuggestionId === suggestion.id;

              return (
                <button
                  key={suggestion.id}
                  className={`block w-full text-left transition-transform ${isSelected ? 'scale-[1.01]' : ''}`}
                  onClick={() => {
                    setSelectedSuggestionId(suggestion.id);
                    setRequestError(null);
                    setRequestMessage(null);
                  }}
                  type="button"
                >
                  <ComicCard
                    bg={isSelected ? 'yellow' : 'white'}
                    padding="lg"
                    shadow={isSelected ? 'gold' : 'none'}
                    className={isSelected ? 'ring-4 ring-[#FACC15]' : ''}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{suggestion.emoji}</span>
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">Suggestion</p>
                            <h2 className="mt-1 text-2xl font-black text-[#1C1917]">{suggestion.title}</h2>
                          </div>
                        </div>
                        <span className="rounded-full border-4 border-[#1C1917] bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#1C1917]">
                          {isSelected ? 'Chosen' : 'Tap'}
                        </span>
                      </div>
                      <p className="text-base font-bold leading-7 text-stone-700">{suggestion.description}</p>
                    </div>
                  </ComicCard>
                </button>
              );
            })}
          </section>

          <ComicCard bg="white" padding="lg" shadow="none">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-stone-500">Send to parent</p>
                <p className="mt-2 text-base font-bold leading-7 text-stone-700">
                  {selectedSuggestion
                    ? `Lena will send "${selectedSuggestion.title}" to your parent.`
                    : 'Pick one activity first, then ask Lena to send it.'}
                </p>
              </div>

              {requestError ? (
                <p className="text-sm font-black text-[#B45309]">{requestError}</p>
              ) : null}

              {requestMessage ? (
                <p className="text-sm font-black text-[#166534]">{requestMessage}</p>
              ) : null}

              <ComicButton
                variant="gold"
                size="lg"
                disabled={!selectedSuggestion || isSubmitting}
                onClick={() => void handleRequestActivity()}
              >
                {isSubmitting ? 'SENDING TO PARENT...' : 'SEND TO PARENT'}
              </ComicButton>
            </div>
          </ComicCard>
        </>
      )}
    </main>
  );
}
