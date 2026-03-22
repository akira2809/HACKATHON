'use client';

import React, { useState } from 'react';

interface CreateMomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMomentData) => Promise<void>;
  familyId: string | null;
  childId: string | null;
}

export interface CreateMomentData {
  activity: string;
  locationName: string;
  mapsLink: string;
  childId: string;
  familyId: string;
}

export function CreateMomentModal({
  isOpen,
  onClose,
  onSubmit,
  familyId,
  childId,
}: CreateMomentModalProps) {
  const [activity, setActivity] = useState('');
  const [locationName, setLocationName] = useState('');
  const [mapsLink, setMapsLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activity.trim()) {
      setError('Please enter an activity name');
      return;
    }

    if (!familyId || !childId) {
      setError('Missing family or child information');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        activity: activity.trim(),
        locationName: locationName.trim() || 'Family Home',
        mapsLink: mapsLink.trim(),
        childId,
        familyId,
      });

      // Reset form
      setActivity('');
      setLocationName('');
      setMapsLink('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create moment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border-4 border-[#1C1917] rounded-3xl shadow-[8px_8px_0px_#1C1917] w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#38BDF8] p-4 border-b-4 border-[#1C1917]">
          <h2 className="font-black text-2xl text-white uppercase italic">
            Create Moment
          </h2>
          <p className="text-white/80 text-sm">
            Create a new family activity
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Activity Name */}
          <div>
            <label className="block font-black text-sm uppercase mb-2 text-[#1C1917]">
              Activity Name *
            </label>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="e.g., Reading Time, Nature Walk"
              className="w-full border-4 border-[#1C1917] rounded-xl p-3 font-medium focus:outline-none focus:ring-4 focus:ring-[#38BDF8]"
            />
          </div>

          {/* Location Name */}
          <div>
            <label className="block font-black text-sm uppercase mb-2 text-[#1C1917]">
              Location
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g., Living Room, Garden"
              className="w-full border-4 border-[#1C1917] rounded-xl p-3 font-medium focus:outline-none focus:ring-4 focus:ring-[#38BDF8]"
            />
          </div>

          {/* Maps Link */}
          <div>
            <label className="block font-black text-sm uppercase mb-2 text-[#1C1917]">
              Maps Link (optional)
            </label>
            <input
              type="url"
              value={mapsLink}
              onChange={(e) => setMapsLink(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full border-4 border-[#1C1917] rounded-xl p-3 font-medium focus:outline-none focus:ring-4 focus:ring-[#38BDF8]"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 border-4 border-red-400 rounded-xl p-3">
              <p className="text-red-600 font-bold text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 border-4 border-[#1C1917] rounded-xl py-3 font-black uppercase transition-all hover:bg-gray-300 active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !activity.trim()}
              className="flex-1 bg-[#34D399] border-4 border-[#1C1917] rounded-xl py-3 font-black text-white uppercase transition-all hover:bg-[#2CB885] active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
