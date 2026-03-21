'use client';

type PlayLenaVoiceInput = {
    modelId?: string;
    text: string;
    voiceId?: string;
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
        const data = await response.json().catch(() => null);

        if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') {
            return data.error;
        }
    }

    const text = await response.text().catch(() => '');

    return text || 'Voice playback request failed.';
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
        throw new Error(await readVoiceError(response));
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
