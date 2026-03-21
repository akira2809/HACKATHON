import 'server-only';

export type SynthesizeVoiceInput = {
    text: string;
    voiceId?: string;
    modelId?: string;
};

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
        const errorText = await response.text();

        throw new Error(errorText || 'ElevenLabs request failed.');
    }

    return response.arrayBuffer();
}
