'use client';

import { useTranslations } from 'next-intl';

export function NewsSection() {
    const t = useTranslations('news');

    return (
        <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            {t('title')} <br />
                            <span className="text-primary">{t('titleHighlight')}</span>
                        </h2>
                        <div className="h-1 w-20 bg-primary mt-3 rounded-full"></div>
                    </div>
                    <a className="text-sm font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-2 group" href="#">
                        {t('viewAll')}
                        <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </a>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 h-auto lg:h-[550px]">
                    {/* Featured Article */}
                    <div className="lg:col-span-2 relative rounded-2xl sm:rounded-3xl overflow-hidden group shadow-xl">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3ieFc8icNGGPIHFjmZ9weS-H4-kZaj6cNSr5K1BZBhJ-Fnokvv1G8Muu9LAo7lvmBGeHPMwqUUhUw2i1Jf_iEPPqXwL_iwF22NIMK1ew2yhKatn0IigUzbAIe6ds-g4qe_UOSW8JZlJIZlsTjqDN2rcBXebi_2ry_-RzX-Db_elgmrX352OVLUdyJMraiNIC59DJK2BR0CPv8HdsHySUkaYg6szfcvQv7tspx1MOgFSDaioHlOa34Y_kWcL8S9JNdPVx7uIn1o43k')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="relative h-full flex flex-col justify-end p-6 sm:p-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                                    {t('featured.badge')}
                                </span>
                                <span className="text-sm text-gray-300">{t('featured.date')}</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                {t('featured.title')}
                            </h3>
                            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl line-clamp-2">
                                {t('featured.description')}
                            </p>
                        </div>
                    </div>

                    {/* Side Articles */}
                    <div className="flex flex-col gap-6 sm:gap-8">
                        {/* Article 1 */}
                        <div className="flex-1 relative rounded-2xl sm:rounded-3xl overflow-hidden group shadow-lg border border-gray-100">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRg3DdJ-yXuEVzsx2EJAtn7lFhNHSw9SDxQGvkKUJg7BwcZ7O-Ppo4GpHi3Gf37wsdyz2KYVpQip1UbtH9XQzZXx27seoOO0FSDUrguE4_hDfcnvGZGSqZKUzpXqzP_dz3edgK62pS7r7ObkuIAsEpoqTLdyuwCQK6gX2E-A_MFGmhFf9_uhvU6eJbICCmMoPz8__wVNvFv6Ane2NpK9rsz2SPTl4ZeHTrlRALpuObvrx2tzttPIH0BK9Dfp6FbivvZpDlg5r20fkh')" }}
                            ></div>
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors"></div>
                            <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 min-h-[200px] sm:min-h-0">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                                    {t('article1.badge')}
                                </span>
                                <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
                                    {t('article1.title')}
                                </h4>
                            </div>
                        </div>

                        {/* Article 2 */}
                        <div className="flex-1 relative rounded-2xl sm:rounded-3xl overflow-hidden group shadow-lg border border-gray-100 bg-surface-light">
                            <div className="p-6 sm:p-8 h-full flex flex-col justify-center min-h-[200px] sm:min-h-0">
                                <div className="flex justify-between items-start mb-4 sm:mb-6">
                                    <div className="size-10 sm:size-12 rounded-full bg-red-100 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl sm:text-2xl">event</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-mono">{t('article2.date')}</span>
                                </div>
                                <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                                    {t('article2.title')}
                                </h4>
                                <a className="text-sm font-bold text-primary mt-4 flex items-center gap-1 group-hover:gap-2 transition-all" href="#">
                                    {t('article2.cta')} <span className="material-symbols-outlined text-base">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
