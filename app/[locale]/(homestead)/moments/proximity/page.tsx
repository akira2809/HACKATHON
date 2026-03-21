'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProximity, formatDistance, isGeolocationSupported } from '@/hooks/useProximity';
import { useMomentStore } from '@/stores';
import { MaterialIcon } from '@/components/homestead/TopNav';

// Target homestead coordinates — UPDATE THIS with real family location
const HOMESTEAD_COORDS = { lat: 10.7769, lng: 106.7009 };

function StatusIdle({ onStart }: { onStart: () => void }) {
  // SSR: default to false (matches server render)
  // Client: check navigator after mount
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isGeolocationSupported());
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Radar rings */}
      <div className="relative w-40 h-40">
        {[3, 2, 1].map((i) => (
          <div
            key={i}
            className="absolute inset-0 border-4 border-[#38BDF8] rounded-full opacity-20 animate-ping"
            style={{ animationDuration: `${i * 1.5}s`, animationDelay: `${i * 0.3}s` }}
          />
        ))}
        <div className="absolute inset-8 bg-[#38BDF8] border-4 border-[#1C1917] rounded-full flex items-center justify-center shadow-[4px_4px_0px_#1C1917]">
          <span className="material-symbols-outlined text-4xl text-white">near_me</span>
        </div>
      </div>

      <p className="font-black text-2xl text-[#1C1917]">TRACKING READY</p>

      {!supported && (
        <div className="bg-[#FB7185] border-4 border-[#1C1917] rounded-2xl p-4 shadow-[4px_4px_0px_#1C1917]">
          <p className="font-black text-white text-sm">
            Browser does not support GPS. Use Chrome or Safari on mobile.
          </p>
        </div>
      )}

      {supported && (
        <p className="text-slate-500 font-bold text-sm max-w-xs text-center">
          Enable GPS on your phone and start moving!
        </p>
      )}

      <button
        onClick={onStart}
        disabled={!supported}
        className={`px-8 py-4 border-4 border-[#1C1917] shadow-[4px_4px_0px_#1C1917] font-black text-xl uppercase rounded-2xl active:scale-95 transition-all ${
          supported
            ? 'bg-[#34D399] text-white hover:bg-[#2cb885]'
            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
        }`}
      >
        START TRACKING
      </button>
    </div>
  );
}

function StatusTracking({
  distanceM,
  speed,
  onConfirm,
  onStop,
}: {
  distanceM?: number;
  speed?: number;
  onConfirm: () => void;
  onStop: () => void;
}) {
  const close = distanceM !== undefined && distanceM <= 50;
  const near = distanceM !== undefined && distanceM <= 200;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Pulsing dot */}
      <div className="relative w-32 h-32">
        {[3, 2, 1].map((i) => (
          <div
            key={i}
            className={`absolute inset-0 border-4 rounded-full ${
              close ? 'border-[#34D399] animate-ping' : 'border-slate-300'
            }`}
            style={{ animationDuration: `${i * 1.5}s` }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-6 h-6 rounded-full ${close ? 'bg-[#34D399]' : 'bg-[#38BDF8] animate-bounce'}`} />
        </div>
      </div>

      {/* Distance */}
      <div className="text-center">
        <p className="font-black text-5xl text-[#1C1917]">
          {distanceM !== undefined ? formatDistance(distanceM) : '...'}
        </p>
        <p className="font-bold text-slate-500 text-sm">from homestead</p>
      </div>

      {/* Speed */}
      {speed !== undefined && speed > 0 && (
        <div className="bg-white border-4 border-[#1C1917] rounded-full px-4 py-1 shadow-[2px_2px_0px_#1C1917]">
          <span className="font-black text-sm text-slate-600">
            Walking {Math.round(speed * 3.6)} km/h
          </span>
        </div>
      )}

      {/* Status pill */}
      <div
        className={`px-4 py-2 rounded-full font-black text-lg ${
          close
            ? 'bg-[#34D399] text-white'
            : near
            ? 'bg-[#FACC15] text-[#1C1917]'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        {close ? 'ARRIVED!' : near ? 'ALMOST THERE!' : 'MOVING...'}
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-2">
        <button
          onClick={onStop}
          className="px-6 py-3 bg-slate-200 border-4 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] font-black text-slate-700 uppercase rounded-2xl active:scale-95 transition-all"
        >
          STOP
        </button>
        {close && (
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-[#34D399] border-4 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] font-black text-white uppercase rounded-2xl active:scale-95 transition-all animate-bounce"
          >
            CONFIRM
          </button>
        )}
      </div>
    </div>
  );
}

function StatusConfirmed({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-24 h-24 bg-[#34D399] border-4 border-[#1C1917] rounded-full flex items-center justify-center shadow-[4px_4px_0px_#1C1917] animate-bounce">
        <span className="material-symbols-outlined text-6xl text-white">check</span>
      </div>
      <p className="font-black text-3xl text-[#1C1917]">HOMESTEAD CONFIRMED!</p>
      <p className="text-[#0284C7] font-bold text-center max-w-xs">
        Family is together! Ready for your moment!
      </p>
      <button
        onClick={onContinue}
        className="px-8 py-4 bg-[#38BDF8] border-4 border-[#1C1917] shadow-[4px_4px_0px_#1C1917] font-black text-white text-xl uppercase rounded-2xl active:scale-95 transition-all"
      >
        START MOMENT!
      </button>
    </div>
  );
}

function StatusDenied() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-24 h-24 bg-[#FB7185] border-4 border-[#1C1917] rounded-full flex items-center justify-center shadow-[4px_4px_0px_#1C1917]">
        <span className="material-symbols-outlined text-6xl text-white">location_off</span>
      </div>
      <p className="font-black text-2xl text-[#1C1917]">GPS BLOCKED</p>
      <p className="text-slate-500 font-bold text-center max-w-xs text-sm">
        Enable location in browser settings to track movement.
      </p>
    </div>
  );
}

function StatusError({ error, onRetry }: { error?: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-20 h-20 bg-slate-100 border-4 border-[#1C1917] rounded-full flex items-center justify-center shadow-[4px_4px_0px_#1C1917]">
        <span className="material-symbols-outlined text-5xl text-slate-400">warning</span>
      </div>
      <p className="font-black text-xl text-[#1C1917]">GPS ERROR</p>
      <p className="text-slate-500 font-bold text-sm">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-[#38BDF8] border-4 border-[#1C1917] shadow-[4px_4px_0px_#1C1917] font-black text-white uppercase rounded-2xl"
      >
        TRY AGAIN
      </button>
    </div>
  );
}

export default function ProximityPage() {
  const router = useRouter();
  const { setProximityStatus } = useMomentStore();

  const { status, distanceM, speed, error, startTracking, stopTracking } = useProximity({
    targetCoords: HOMESTEAD_COORDS,
    thresholdKm: 0.05,
  });

  useEffect(() => {
    setProximityStatus(status === 'confirmed' ? 'confirmed' : status === 'tracking' ? 'checking' : 'idle');
  }, [status, setProximityStatus]);

  const handleConfirm = useCallback(() => {
    router.push('/moments');
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E9D5FF] to-[#BAE6FD] flex flex-col relative">

      {/* Lena mascot */}
      <div className="flex justify-center pt-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD43Ak8jrM1vR43A58_wI-I7HzU2BCesFqsPV-OJPv5r7kYWMHaVokI7ZV6fjXkqmgUF9IkxsBC75C8RPpJY8zHscq-O0zePLLKr8u2XVYDvrGc-MjkHxDvvQ_aOOWBOFD1Ejgtjo5eenjrOwR-smQmqR30Du3jS3BO98erZ_TKsPuiwWqDgiQHXn6pVHGSQFabcpqIBu-PG3N5_KF6PJvDGfrfvGNe4_iP1xVcpgkM2B8HXR3vrQ56MY2QCyRlKYfZL77Nu97JnJEd"
          alt="Lena"
          className="w-24 h-24 object-contain drop-shadow-lg"
        />
      </div>

      {/* Header */}
      <div className="text-center px-6 mb-6">
        <h1 className="font-black text-3xl text-[#1C1917] uppercase italic tracking-tight">
          Homestead Check
        </h1>
        <p className="text-[#7E22CE] font-bold text-sm mt-1">
          {status === 'tracking'
            ? 'Tracking your location...'
            : status === 'confirmed'
            ? 'Homestead confirmed!'
            : 'Move closer to your family'}
        </p>
      </div>

      {/* Main card */}
      <div className="flex-1 flex items-center justify-center px-6 pb-32">
        <div className="bg-white border-4 border-[#1C1917] rounded-3xl shadow-[8px_8px_0px_#1C1917] p-8 w-full max-w-sm">

          {status === 'idle' && <StatusIdle onStart={startTracking} />}

          {(status === 'tracking' || status === 'far') && (
            <StatusTracking
              distanceM={distanceM}
              speed={speed}
              onConfirm={handleConfirm}
              onStop={stopTracking}
            />
          )}

          {status === 'confirmed' && <StatusConfirmed onContinue={handleConfirm} />}
          {status === 'denied' && <StatusDenied />}
          {(status === 'error' || status === 'unavailable') && (
            <StatusError error={error} onRetry={startTracking} />
          )}

        </div>
      </div>

      {/* Back link */}
      <div className="absolute bottom-28 left-0 right-0 flex justify-center">
        <Link
          href="/moments"
          className="flex items-center gap-2 text-[#7E22CE] font-black uppercase tracking-wide hover:underline"
        >
          <MaterialIcon icon="arrow_back" />
          Back to Moments
        </Link>
      </div>
    </main>
  );
}
