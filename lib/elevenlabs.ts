import 'server-only';

export type SynthesizeVoiceInput = {
    text: string;
    voiceId?: string;
    modelId?: string;
};

export class ElevenLabsError extends Error {
    code: string | null;
    status: number;

    constructor(message: string, options: { code?: string | null; status: number }) {
        super(message);
        this.name = 'ElevenLabsError';
        this.code = options.code ?? null;
        this.status = options.status;
    }
}

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

function getElevenLabsApiKey() {
    const apiKey = process.env.ELEVENLABS_API_KEY ?? process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    if (!apiKey) {
        throw new Error(
            'ElevenLabs API key is missing. Add ELEVENLABS_API_KEY to .env.local before using voice playback.',
        );
    }

    return apiKey;
}

function getVoiceId(voiceId?: string) {
    const resolvedVoiceId = voiceId
        ?? process.env.ELEVENLABS_VOICE_ID
        ?? process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID;

    if (!resolvedVoiceId) {
        throw new Error(
            'ElevenLabs voice ID is missing. Add ELEVENLABS_VOICE_ID to .env.local before using voice playback.',
        );
    }

    return resolvedVoiceId;
}

function getModelId(modelId?: string) {
    return modelId
        ?? process.env.ELEVENLABS_MODEL_ID
        ?? process.env.NEXT_PUBLIC_ELEVENLABS_MODEL_ID
        ?? 'eleven_multilingual_v2';
}

export async function synthesizeLenaVoice({
    text,
    voiceId,
    modelId,
}: SynthesizeVoiceInput) {
    const response = await fetch(
        `${ELEVENLABS_API_URL}/${getVoiceId(voiceId)}?output_format=mp3_44100_128`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': getElevenLabsApiKey(),
            },
            body: JSON.stringify({
                text,
                model_id: getModelId(modelId),
                voice_settings: {
                    stability: 0.45,
                    similarity_boost: 0.72,
                    style: 0.18,
                    use_speaker_boost: true,
                },
            }),
            cache: 'no-store',
        },
    );

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        let errorCode: string | null = null;
        let message = 'ElevenLabs request failed.';

        if (errorText) {
            try {
                const parsed = JSON.parse(errorText) as {
                    detail?: {
                        message?: string;
                        status?: string;
                    };
                };

                errorCode = parsed.detail?.status ?? null;
                message = parsed.detail?.message ?? errorText;
            } catch {
                message = errorText;
            }
        }

        throw new ElevenLabsError(message, {
            code: errorCode,
            status: response.status,
        });
    }

    return response.arrayBuffer();
}
