/**
 * useProximity.ts
 * Real-time GPS tracking for child movement.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface Coordinates {
  lat: number;
  lng: number;
}

export type ProximityStatus =
  | 'idle'
  | 'tracking'
  | 'confirmed'
  | 'far'
  | 'denied'
  | 'error'
  | 'unavailable';

export interface ProximityState {
  status: ProximityStatus;
  error?: string;
  userCoords?: Coordinates;
  targetCoords: Coordinates;
  distance?: number;
  distanceM?: number;
  thresholdKm: number;
  speed?: number;
  heading?: number;
  trail: Coordinates[];
}

export interface UseProximityOptions {
  targetCoords: Coordinates;
  thresholdKm?: number;
  enableTrail?: boolean;
}

function haversineKm(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sLat1 = Math.sin(dLat / 2);
  const sLat2 = Math.sin(dLng / 2);
  const inside =
    sLat1 * sLat1 +
    sLat2 * sLat2 * Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180);
  return R * 2 * Math.atan2(Math.sqrt(inside), Math.sqrt(1 - inside));
}

const WATCH_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

export function useProximity({
  targetCoords,
  thresholdKm = 0.05,
  enableTrail = true,
}: UseProximityOptions) {
  const watchIdRef = useRef<number | null>(null);

  const [state, setState] = useState<ProximityState>({
    status: 'idle',
    targetCoords,
    thresholdKm,
    trail: [],
  });

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        status: 'unavailable',
        error: 'Browser does not support GPS',
      }));
      return;
    }

    if (watchIdRef.current !== null) return;

    setState((s) => ({
      ...s,
      status: 'tracking',
      trail: [],
      error: undefined,
    }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const userCoords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const distance = haversineKm(userCoords, targetCoords);
        const distanceM = Math.round(distance * 1000);
        const isConfirmed = distance <= thresholdKm;

        setState((s) => ({
          ...s,
          status: isConfirmed ? 'confirmed' : 'far',
          userCoords,
          distance,
          distanceM,
          speed: position.coords.speed ?? undefined,
          heading: position.coords.heading ?? undefined,
          trail: enableTrail ? [...s.trail.slice(-9), userCoords] : s.trail,
        }));
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setState((s) => ({
            ...s,
            status: 'denied',
            error: 'Location permission denied',
          }));
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setState((s) => ({
            ...s,
            status: 'unavailable',
            error: 'GPS unavailable. Try going outside.',
          }));
        } else {
          setState((s) => ({
            ...s,
            status: 'error',
            error: 'GPS error',
          }));
        }
      },
      WATCH_OPTIONS
    );
  }, [targetCoords, thresholdKm, enableTrail]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState((s) => ({ ...s, status: 'idle' }));
  }, []);

  return {
    ...state,
    startTracking,
    stopTracking,
  };
}

export function formatDistance(meters?: number): string {
  if (meters === undefined) return '—';
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function isGeolocationSupported(): boolean {
  return !!navigator.geolocation;
}
