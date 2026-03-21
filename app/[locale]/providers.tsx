// app/[locale]/providers.tsx
'use client'

import { HeroUIProvider } from '@heroui/react'
import { GlobalLoadingOverlay } from '@/components/loading/global-loading-overlay'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            {children}
            <GlobalLoadingOverlay />
        </HeroUIProvider>
    )
}
