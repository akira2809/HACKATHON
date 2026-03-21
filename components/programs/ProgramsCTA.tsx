'use client';

import { useTranslations } from 'next-intl';

export function ProgramsCTA() {
    const t = useTranslations('programs.cta');

    return (
        <section className="py-16 sm:py-20 bg-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <span className="material-symbols-outlined text-5xl sm:text-6xl text-primary mb-4 sm:mb-6">compare_arrows</span>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 sm:mb-6">
                    {t('title')}
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-10 font-light max-w-2xl mx-auto">
                    {t('description')}
                </p>
                <button className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-slate-900 hover:bg-gray-100 text-sm sm:text-base font-bold rounded-full shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto">
                    {t('button')}
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        </section>
    );
}
