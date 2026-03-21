'use client';

import { useTranslations } from 'next-intl';

export function NewsletterCTA() {
    const t = useTranslations('blog.newsletter');

    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-2xl sm:rounded-3xl bg-primary text-white p-8 sm:p-12 md:p-24 relative overflow-hidden shadow-2xl">
                    {/* Background Decoration */}
                    <div className="absolute right-0 top-0 w-64 sm:w-96 h-64 sm:h-96 bg-black/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>

                    {/* Content */}
                    <div className="relative z-10 max-w-3xl">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 leading-tight">
                            {t('title')}
                        </h2>
                        <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 font-light leading-relaxed">
                            {t('description')}
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 max-w-xl">
                            <input
                                className="flex-grow px-6 sm:px-8 py-4 sm:py-5 rounded-lg text-slate-900 border-none focus:ring-4 focus:ring-black/20 outline-none placeholder:text-gray-400 text-base sm:text-lg bg-white"
                                placeholder={t('placeholder')}
                                required
                                type="email"
                            />
                            <button
                                className="px-8 sm:px-10 py-4 sm:py-5 bg-black text-white font-black uppercase tracking-widest rounded-lg hover:bg-black transition-all shadow-xl whitespace-nowrap"
                                type="submit"
                            >
                                {t('button')}
                            </button>
                        </form>
                    </div>

                    {/* Icon Decoration */}
                    <span className="absolute right-6 sm:right-12 bottom-6 sm:bottom-12 material-symbols-outlined text-white/10 text-[8rem] sm:text-[12rem] pointer-events-none hidden sm:block">
                        restaurant
                    </span>
                </div>
            </div>
        </section>
    );
}
