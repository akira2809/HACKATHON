import { ElevenLabsError, synthesizeLenaVoice } from '@/lib/elevenlabs';

type VoiceRequest = {
    text?: string;
    voiceId?: string;
    modelId?: string;
};

export async function POST(request: Request) {
    try {
        const body = await request.json() as VoiceRequest;

        if (!body.text) {
            return new Response(
                JSON.stringify({ error: 'text is required.' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }

        const audioBuffer = await synthesizeLenaVoice({
            text: body.text,
            voiceId: body.voiceId,
            modelId: body.modelId,
        });

        return new Response(audioBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Voice synthesis failed.';
        const errorCode = error instanceof ElevenLabsError ? error.code : null;
        const status = error instanceof ElevenLabsError ? error.status : 500;

        return new Response(
            JSON.stringify({
                error: message,
                errorCode,
            }),
            {
                status,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }
}
