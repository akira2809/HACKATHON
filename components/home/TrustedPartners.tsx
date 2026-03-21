'use client';

import { useTranslations } from 'next-intl';

export function TrustedPartners() {
    const t = useTranslations('partners');

    const partners = ['MARRIOTT', 'Hilton', 'HYATT', 'FOUR SEASONS', 'Ritz-Carlton', 'ACCOR'];

    return (
        <section className="border-b border-gray-200 bg-white py-8 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                    {t('title')}
                </h4>
            </div>

            <div className="relative w-full overflow-hidden group">
                {/* Gradient Overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent"></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent"></div>

                {/* Scrolling Content */}
                <div className="flex gap-8 sm:gap-16 w-max animate-scroll items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500 group-hover:opacity-100">
                    <div className="flex items-center gap-8 sm:gap-16">
                        {[...partners, ...partners].map((partner, index) => (
                            <span
                                key={index}
                                className="text-xl sm:text-2xl font-bold text-slate-800 whitespace-nowrap"
                            >
                                {partner}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
            `}</style>
        </section>
    );
}
