'use client';

import { MultiStepLoader } from '@/components/loading/multi-step-loader';
import { useGlobalLoadingState } from '@/state/global-loading-state';

export function GlobalLoadingOverlay() {
    const activeRequestId = useGlobalLoadingState((state) => state.activeRequestId);
    const duration = useGlobalLoadingState((state) => state.duration);
    const helperText = useGlobalLoadingState((state) => state.helperText);
    const isLoading = useGlobalLoadingState((state) => state.isLoading);
    const loadingStates = useGlobalLoadingState((state) => state.loadingStates);
    const loop = useGlobalLoadingState((state) => state.loop);

    return (
        <MultiStepLoader
            duration={duration}
            helperText={helperText}
            key={activeRequestId ?? 'idle'}
            loading={isLoading}
            loadingStates={loadingStates}
            loop={loop}
        />
    );
}
