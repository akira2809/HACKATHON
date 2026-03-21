import { NextResponse } from 'next/server';
import { generateDailyQuests } from '@/lib/openai';

type GenerateQuestsRequest = {
    childName?: string;
    age?: number;
    categories?: string[];
    goalTitle?: string | null;
    householdName?: string;
    tone?: string;
};

export async function POST(request: Request) {
    try {
        const body = await request.json() as GenerateQuestsRequest;

        if (!body.childName || typeof body.age !== 'number') {
            return NextResponse.json(
                { error: 'childName and age are required.' },
                { status: 400 },
            );
        }

        const quests = await generateDailyQuests({
            childName: body.childName,
            age: body.age,
            categories: body.categories ?? ['learning', 'exercise', 'responsibility'],
            goalTitle: body.goalTitle,
            householdName: body.householdName,
            tone: body.tone,
        });

        return NextResponse.json({ quests });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Quest generation failed.';

        return NextResponse.json(
            { error: message },
            { status: 500 },
        );
    }
}
