'use client';

import { useTranslations } from 'next-intl';

interface ProgramsHeroProps {
    onSearch?: (filters: {
        region: string;
        specialization: string;
        degreeType: string;
    }) => void;
}

export function ProgramsHero({ onSearch }: ProgramsHeroProps) {
    const t = useTranslations('programs');

    return (
        <section className="relative bg-slate-900 pt-16 pb-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center opacity-30"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRg3DdJ-yXuEVzsx2EJAtn7lFhNHSw9SDxQGvkKUJg7BwcZ7O-Ppo4GpHi3Gf37wsdyz2KYVpQip1UbtH9XQzZXx27seoOO0FSDUrguE4_hDfcnvGZGSqZKUzpXqzP_dz3edgK62pS7r7ObkuIAsEpoqTLdyuwCQK6gX2E-A_MFGmhFf9_uhvU6eJbICCmMoPz8__wVNvFv6Ane2NpK9rsz2SPTl4ZeHTrlRALpuObvrx2tzttPIH0BK9Dfp6FbivvZpDlg5r20fkh')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/90 to-background-light"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6 tracking-tight">
                        {t('hero.title')} <br />
                        <span className="text-primary">{t('hero.titleHighlight')}</span>
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg">
                        {t('hero.description')}
                    </p>
                </div>

                {/* Search Filters */}
                <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 max-w-5xl mx-auto border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        {/* Region */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                {t('hero.filters.region')}
                            </label>
                            <div className="relative">
                                <select className="w-full bg-slate-50 border-transparent focus:border-primary focus:ring-0 rounded-lg py-3 pl-4 pr-10 text-slate-700 font-medium appearance-none text-sm">
                                    <option>{t('hero.filters.allRegions')}</option>
                                    <option>{t('hero.filters.switzerland')}</option>
                                    <option>{t('hero.filters.france')}</option>
                                    <option>{t('hero.filters.uk')}</option>
                                    <option>{t('hero.filters.australia')}</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none text-lg">expand_more</span>
                            </div>
                        </div>

                        {/* Specialization */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                {t('hero.filters.specialization')}
                            </label>
                            <div className="relative">
                                <select className="w-full bg-slate-50 border-transparent focus:border-primary focus:ring-0 rounded-lg py-3 pl-4 pr-10 text-slate-700 font-medium appearance-none text-sm">
                                    <option>{t('hero.filters.anySpecialization')}</option>
                                    <option>{t('hero.filters.culinaryArts')}</option>
                                    <option>{t('hero.filters.pastry')}</option>
                                    <option>{t('hero.filters.hospitality')}</option>
                                    <option>{t('hero.filters.wine')}</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none text-lg">expand_more</span>
                            </div>
                        </div>

                        {/* Degree Type */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                {t('hero.filters.degreeType')}
                            </label>
                            <div className="relative">
                                <select className="w-full bg-slate-50 border-transparent focus:border-primary focus:ring-0 rounded-lg py-3 pl-4 pr-10 text-slate-700 font-medium appearance-none text-sm">
                                    <option>{t('hero.filters.allDegrees')}</option>
                                    <option>{t('hero.filters.diploma')}</option>
                                    <option>{t('hero.filters.bachelor')}</option>
                                    <option>{t('hero.filters.master')}</option>
                                    <option>{t('hero.filters.shortCourse')}</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none text-lg">expand_more</span>
                            </div>
                        </div>

                        {/* Search Button */}
                        <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20 h-[48px]">
                            <span className="material-symbols-outlined text-lg">search</span>
                            <span className="hidden sm:inline">{t('hero.searchButton')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
