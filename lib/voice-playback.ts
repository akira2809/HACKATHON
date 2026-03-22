'use client';

type PlayLenaVoiceInput = {
    modelId?: string;
    text: string;
    voiceId?: string;
};

type VoiceRouteError = {
    error: string;
    errorCode?: string | null;
};

type ActivePlayback = {
    audio: HTMLAudioElement;
    objectUrl: string;
    reject: (error: Error) => void;
};

let activePlayback: ActivePlayback | null = null;

function normalizePlaybackError(error: unknown, fallbackMessage: string) {
    return error instanceof Error ? error : new Error(fallbackMessage);
}

function stopActivePlayback(reason = 'Voice playback was interrupted.') {
    if (!activePlayback) {
        return;
    }

    const { audio, objectUrl, reject } = activePlayback;
    activePlayback = null;

    audio.pause();
    audio.src = '';
    URL.revokeObjectURL(objectUrl);
    reject(new Error(reason));
}

async function readVoiceError(response: Response) {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
        const data = await response.json().catch(() => null) as VoiceRouteError | null;

        if (data && typeof data === 'object' && typeof data.error === 'string') {
            return data;
        }
    }

    const text = await response.text().catch(() => '');

    return {
        error: text || 'Voice playback request failed.',
        errorCode: null,
    } satisfies VoiceRouteError;
}

function canUseBrowserVoice() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

function playBrowserVoice(text: string) {
    if (!canUseBrowserVoice()) {
        return Promise.reject(new Error('Browser voice playback is unavailable.'));
    }

    window.speechSynthesis.cancel();

    return new Promise<void>((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.96;
        utterance.pitch = 1.04;
        utterance.volume = 1;

        utterance.onend = () => resolve();
        utterance.onerror = () => reject(new Error('Browser voice playback failed.'));

        window.speechSynthesis.speak(utterance);
    });
}

export async function playLenaVoice({
    modelId,
    text,
    voiceId,
}: PlayLenaVoiceInput) {
    stopActivePlayback();

    const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            modelId,
            text,
            voiceId,
        }),
    });

    if (!response.ok) {
        const routeError = await readVoiceError(response);

        if (
            (routeError.errorCode === 'quota_exceeded' || response.status === 429)
            && canUseBrowserVoice()
        ) {
            await playBrowserVoice(text);
            return;
        }

        throw new Error(routeError.error);
    }

    const audioBlob = await response.blob();
    const objectUrl = URL.createObjectURL(audioBlob);

    return new Promise<void>((resolve, reject) => {
        const audio = new Audio(objectUrl);

        const cleanup = () => {
            audio.onended = null;
            audio.onerror = null;

            if (activePlayback?.audio === audio) {
                activePlayback = null;
            }

            URL.revokeObjectURL(objectUrl);
        };

        activePlayback = {
            audio,
            objectUrl,
            reject,
        };

        audio.onended = () => {
            cleanup();
            resolve();
        };

        audio.onerror = () => {
            cleanup();
            reject(new Error('Voice playback failed.'));
        };

        audio.play().catch((error: unknown) => {
            cleanup();
            reject(normalizePlaybackError(error, 'Voice playback failed.'));
        });
    });
}
