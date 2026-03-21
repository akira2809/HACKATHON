'use client';

import { useTranslations } from 'next-intl';

export function WhyStudyAbroad() {
    const t = useTranslations('programs.whyStudy');

    const benefits = [
        { icon: 'language', key: 'cultural' },
        { icon: 'network_node', key: 'network' },
        { icon: 'stars', key: 'internships' }
    ];

    return (
        <section className="py-16 sm:py-24 bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Image */}
                    <div className="order-2 lg:order-1 relative">
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <div
                                className="aspect-[4/5] w-full bg-cover bg-center"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3ieFc8icNGGPIHFjmZ9weS-H4-kZaj6cNSr5K1BZBhJ-Fnokvv1G8Muu9LAo7lvmBGeHPMwqUUhUw2i1Jf_iEPPqXwL_iwF22NIMK1ew2yhKatn0IigUzbAIe6ds-g4qe_UOSW8JZlJIZlsTjqDN2rcBXebi_2ry_-RzX-Db_elgmrX352OVLUdyJMraiNIC59DJK2BR0CPv8HdsHySUkaYg6szfcvQv7tspx1MOgFSDaioHlOa34Y_kWcL8S9JNdPVx7uIn1o43k')" }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 sm:p-8">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-6 rounded-xl">
                                    <div className="flex items-center gap-4 mb-3">
                                        <span className="text-3xl sm:text-4xl font-black text-white">95%</span>
                                        <div className="h-8 w-px bg-white/40"></div>
                                        <p className="text-white text-xs sm:text-sm font-medium">
                                            {t('stat')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded mb-4 sm:mb-6">
                            {t('badge')}
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight">
                            {t('title')} <br />
                            <span className="text-primary">{t('titleHighlight')}</span>
                        </h2>
                        <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                            {t('description')}
                        </p>

                        <div className="space-y-4 sm:space-y-6">
                            {benefits.map((benefit) => (
                                <div key={benefit.key} className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-full flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-lg sm:text-xl">{benefit.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                                            {t(`${benefit.key}.title`)}
                                        </h4>
                                        <p className="text-sm text-slate-500">
                                            {t(`${benefit.key}.description`)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
