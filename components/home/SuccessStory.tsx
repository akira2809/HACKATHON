'use client';

import { useTranslations } from 'next-intl';

export function SuccessStory() {
    const t = useTranslations('successStory');

    return (
        <section className="py-16 sm:py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6">
                        {t('title')} <br />
                        <span className="text-primary">{t('titleHighlight')}</span>
                    </h2>
                    <div className="h-1 w-24 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-[400px] sm:h-[500px] shadow-2xl group">
                    {/* Background */}
                    <div className="absolute inset-0 z-0">
                        <div
                            className="w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-1000"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3ieFc8icNGGPIHFjmZ9weS-H4-kZaj6cNSr5K1BZBhJ-Fnokvv1G8Muu9LAo7lvmBGeHPMwqUUhUw2i1Jf_iEPPqXwL_iwF22NIMK1ew2yhKatn0IigUzbAIe6ds-g4qe_UOSW8JZlJIZlsTjqDN2rcBXebi_2ry_-RzX-Db_elgmrX352OVLUdyJMraiNIC59DJK2BR0CPv8HdsHySUkaYg6szfcvQv7tspx1MOgFSDaioHlOa34Y_kWcL8S9JNdPVx7uIn1o43k')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-8 md:px-16 max-w-2xl">
                        <div className="inline-flex items-center gap-2 mb-4 sm:mb-6">
                            <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                {t('badge')}
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
                            {t('quote')}
                        </h2>
                        <p className="text-base sm:text-lg text-gray-200 mb-6 sm:mb-8 font-light">
                            {t('description')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                                {t('getConsultation')}
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                                {t('viewPrograms')}
                            </button>
                        </div>
                    </div>

                    {/* Play Button */}
                    <button className="absolute top-1/2 right-4 sm:right-8 md:right-20 transform -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 hover:bg-primary backdrop-blur-md rounded-full flex items-center justify-center transition-all group-hover:scale-110 border border-white/40">
                        <span className="material-symbols-outlined text-white text-4xl sm:text-5xl md:text-6xl pl-2">play_arrow</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
