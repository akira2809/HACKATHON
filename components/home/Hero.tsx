'use client';

import { useTranslations } from 'next-intl';

export function Hero() {
    const t = useTranslations('hero');

    return (
        <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat transform scale-105"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRg3DdJ-yXuEVzsx2EJAtn7lFhNHSw9SDxQGvkKUJg7BwcZ7O-Ppo4GpHi3Gf37wsdyz2KYVpQip1UbtH9XQzZXx27seoOO0FSDUrguE4_hDfcnvGZGSqZKUzpXqzP_dz3edgK62pS7r7ObkuIAsEpoqTLdyuwCQK6gX2E-A_MFGmhFf9_uhvU6eJbICCmMoPz8__wVNvFv6Ane2NpK9rsz2SPTl4ZeHTrlRALpuObvrx2tzttPIH0BK9Dfp6FbivvZpDlg5r20fkh')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest rounded mb-2">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                        {t('badge')}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
                        {t('title')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                            {t('titleHighlight')}
                        </span> <br />
                        {t('titleEnd')}
                    </h1>

                    {/* Description */}
                    <p className="text-base sm:text-lg md:text-xl text-gray-200 font-light max-w-xl leading-relaxed">
                        {t('description')}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button className="px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary-dark text-white text-sm sm:text-base font-bold rounded flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/20">
                            {t('startJourney')}
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                        <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm sm:text-base font-bold rounded flex items-center justify-center gap-2 transition-all">
                            <span className="material-symbols-outlined">play_circle</span>
                            {t('watchShowreel')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce hidden sm:flex">
                <span className="text-xs uppercase tracking-widest">{t('scroll')}</span>
                <span className="material-symbols-outlined">keyboard_arrow_down</span>
            </div>
        </section>
    );
}
