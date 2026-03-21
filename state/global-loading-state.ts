import { create } from 'zustand';

export type LoadingStep = {
    text: string;
};

type StartGlobalLoadingInput = {
    loadingStates?: LoadingStep[];
    duration?: number;
    loop?: boolean;
    helperText?: string;
};

type GlobalLoadingState = {
    activeRequestId: number | null;
    duration: number;
    helperText: string;
    isLoading: boolean;
    loadingStates: LoadingStep[];
    loop: boolean;
    requestSequence: number;
    startLoading: (input?: StartGlobalLoadingInput) => number;
    stopLoading: (requestId?: number) => void;
};

const defaultLoadingStates: LoadingStep[] = [
    { text: 'Preparing the next homestead step' },
];

const defaultDuration = 1800;
const defaultHelperText = 'Please wait while the homestead board updates.';

export const useGlobalLoadingState = create<GlobalLoadingState>((set, get) => ({
    activeRequestId: null,
    duration: defaultDuration,
    helperText: defaultHelperText,
    isLoading: false,
    loadingStates: defaultLoadingStates,
    loop: true,
    requestSequence: 0,
    startLoading: (input) => {
        const nextRequestId = get().requestSequence + 1;

        set({
            activeRequestId: nextRequestId,
            duration: input?.duration ?? defaultDuration,
            helperText: input?.helperText ?? defaultHelperText,
            isLoading: true,
            loadingStates: input?.loadingStates?.length ? input.loadingStates : defaultLoadingStates,
            loop: input?.loop ?? true,
            requestSequence: nextRequestId,
        });

        return nextRequestId;
    },
    stopLoading: (requestId) => {
        const { activeRequestId, requestSequence } = get();

        if (requestId && activeRequestId !== requestId) {
            return;
        }

        set({
            activeRequestId: null,
            duration: defaultDuration,
            helperText: defaultHelperText,
            isLoading: false,
            loadingStates: defaultLoadingStates,
            loop: true,
            requestSequence,
        });
    },
}));
