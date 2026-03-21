'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations('footer');

    return (
        <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white pt-20 pb-10 border-t-4 border-primary overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_rgba(0,0,0,0.8)_100%)] pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="size-9 bg-primary text-white flex items-center justify-center rounded shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined">restaurant</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight text-white leading-none">{t('programs')}</h1>
                                <span className="text-xs font-medium text-gray-400 tracking-[0.2em] uppercase">Consultancy</span>
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed font-light">
                            {t('description')}
                        </p>
                        <div className="flex gap-4">
                            <a className="text-gray-400 hover:text-white transition-colors" href="#">
                                <span className="material-symbols-outlined">social_leaderboard</span>
                            </a>
                            <a className="text-gray-400 hover:text-white transition-colors" href="#">
                                <span className="material-symbols-outlined">smart_display</span>
                            </a>
                            <a className="text-gray-400 hover:text-white transition-colors" href="#">
                                <span className="material-symbols-outlined">photo_camera</span>
                            </a>
                        </div>
                    </div>

                    {/* Programs */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-white border-b border-primary w-max pb-2">
                            {t('programs')}
                        </h4>
                        <ul className="space-y-4">
                            <li><a className="text-gray-300 hover:text-white text-sm transition-colors" href="#">{t('culinaryDiploma')}</a></li>
                            <li><a className="text-gray-300 hover:text-white text-sm transition-colors" href="#">{t('hospitalityBachelor')}</a></li>
                            <li><a className="text-gray-300 hover:text-white text-sm transition-colors" href="#">{t('pastryArts')}</a></li>
                            <li><a className="text-gray-300 hover:text-white text-sm transition-colors" href="#">{t('wine')}</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-white border-b border-primary w-max pb-2">
                            {t('contact')}
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-300 text-sm">
                                <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
                                <span>{t('address')}<br />{t('city')}</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                <span className="material-symbols-outlined text-primary text-lg">call</span>
                                <span>{t('phone')}</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                <span className="material-symbols-outlined text-primary text-lg">mail</span>
                                <span>{t('email')}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-white border-b border-primary w-max pb-2">
                            {t('newsletter')}
                        </h4>
                        <p className="text-gray-300 text-sm mb-4 font-light">{t('newsletterDescription')}</p>
                        <div className="flex flex-col gap-3">
                            <input
                                className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder-gray-500"
                                placeholder={t('emailPlaceholder')}
                                type="email"
                            />
                            <button className="w-full bg-primary hover:bg-primary-dark text-white text-sm font-bold py-3 rounded transition-colors shadow-lg shadow-primary/30">
                                {t('subscribe')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">{t('copyright')}</p>
                    <div className="flex gap-6">
                        <a className="text-gray-500 hover:text-white text-xs transition-colors" href="#">{t('privacy')}</a>
                        <a className="text-gray-500 hover:text-white text-xs transition-colors" href="#">{t('terms')}</a>
                        <a className="text-gray-500 hover:text-white text-xs transition-colors" href="#">{t('cookies')}</a>
                    </div>
                </div>
            </div>

            {/* Material Icons Font */}
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        </footer>
    );
}
