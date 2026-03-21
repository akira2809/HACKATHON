'use client';

import { useTranslations } from 'next-intl';

export function ProcessTimeline() {
    const t = useTranslations('processTimeline');

    const steps = [
        { key: 'step1', icon: 'person_search' },
        { key: 'step2', icon: 'school' },
        { key: 'step3', icon: 'airplane_ticket' },
        { key: 'step4', icon: 'workspace_premium' }
    ];

    const services = [
        { key: 'visa', icon: 'airplane_ticket' },
        { key: 'university', icon: 'school' },
        { key: 'career', icon: 'work_history', colSpan: 'md:col-span-2' }
    ];

    return (
        <section className="py-16 sm:py-24 bg-background-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left: Timeline */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                {t('title')} <br />
                                <span className="text-primary">{t('titleHighlight')}</span>
                            </h2>
                            <div className="h-1.5 w-20 bg-primary mt-4 rounded-full"></div>
                        </div>

                        <div className="relative pl-6 sm:pl-8 border-l border-gray-200 space-y-8 sm:space-y-12">
                            {steps.map((step, index) => (
                                <div key={step.key} className="relative group">
                                    <div className={`absolute -left-[29px] sm:-left-[37px] top-1.5 h-3 w-3 sm:h-4 sm:w-4 rounded-full border-4 border-white ${index === 0 ? 'bg-primary' : 'bg-gray-300 group-hover:bg-primary'
                                        } transition-colors`}></div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                                            {t(`${step.key}.label`)}
                                        </span>
                                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                                            {t(`${step.key}.title`)}
                                        </h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {t(`${step.key}.description`)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Services */}
                    <div className="lg:col-span-7 lg:pl-12">
                        <div className="flex justify-between items-end mb-6 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t('servicesTitle')}</h2>
                            <a className="text-sm font-bold text-primary hover:text-primary-dark transition-colors" href="#">
                                {t('viewAll')}
                            </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {services.map((service) => (
                                <div
                                    key={service.key}
                                    className={`${service.colSpan || ''} bg-white p-6 sm:p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group`}
                                >
                                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-primary mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-2xl">{service.icon}</span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                                        {t(`services.${service.key}.title`)}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-4 sm:mb-6">
                                        {t(`services.${service.key}.description`)}
                                    </p>
                                    <a className="inline-flex items-center text-sm font-bold text-primary hover:gap-2 transition-all group-hover:text-primary-dark" href="#">
                                        {t('learnMore')} <span className="material-symbols-outlined text-base ml-1">arrow_forward</span>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
