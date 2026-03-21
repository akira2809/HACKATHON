'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const currentLocale = params.locale as string;

    const handleLocaleChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className="flex gap-1 sm:gap-2 rounded-full bg-white/10 backdrop-blur-md p-0.5 sm:p-1 border border-white/20">
            <button
                onClick={() => handleLocaleChange('en')}
                className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${currentLocale === 'en'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/20'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => handleLocaleChange('vi')}
                className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${currentLocale === 'vi'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/20'
                    }`}
            >
                VI
            </button>
        </div>
    );
}
