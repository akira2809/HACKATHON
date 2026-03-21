'use client';

import { useTranslations } from 'next-intl';

export function BlogHero() {
    const t = useTranslations('blog.hero');

    return (
        <section className="pt-8 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-2">
                            {t('title')}
                        </h1>
                        <p className="text-base sm:text-lg text-slate-500 font-light">
                            {t('subtitle')}
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-slate-700 hover:border-primary transition-colors shadow-sm w-max">
                        <span className="material-symbols-outlined text-lg">sort</span>
                        {t('sortButton')}
                    </button>
                </div>
            </div>
        </section>
    );
}
