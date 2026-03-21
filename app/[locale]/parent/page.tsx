import { ParentDashboardScreen } from '@/components/parent/ParentDashboardScreen';

type ParentPageProps = {
    searchParams: Promise<{
        tab?: string | string[];
        demo?: string | string[];
    }>;
};

export default async function ParentPage({
    searchParams,
}: ParentPageProps) {
    const resolvedSearchParams = await searchParams;
    const initialTab = Array.isArray(resolvedSearchParams.tab)
        ? resolvedSearchParams.tab[0]
        : resolvedSearchParams.tab;
    const demoState = Array.isArray(resolvedSearchParams.demo)
        ? resolvedSearchParams.demo[0]
        : resolvedSearchParams.demo;

    return <ParentDashboardScreen demoState={demoState} initialTab={initialTab} />;
}
