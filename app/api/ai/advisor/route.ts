import { NextResponse } from 'next/server';
import { generateAdvisorSuggestion } from '@/lib/openai';

type AdvisorRequest = {
    childName?: string;
    age?: number;
    preferences?: string[];
    durationMinutes?: number;
    theme?: string;
    householdName?: string;
};

export async function POST(request: Request) {
    try {
        const body = await request.json() as AdvisorRequest;

        if (!body.childName || typeof body.age !== 'number') {
            return NextResponse.json(
                { error: 'childName and age are required.' },
                { status: 400 },
            );
        }

        const suggestion = await generateAdvisorSuggestion({
            childName: body.childName,
            age: body.age,
            preferences: body.preferences ?? [],
            durationMinutes: body.durationMinutes ?? 20,
            theme: body.theme,
            householdName: body.householdName,
        });

        return NextResponse.json({ suggestion });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Advisor generation failed.';

        return NextResponse.json(
            { error: message },
            { status: 500 },
        );
    }
}
