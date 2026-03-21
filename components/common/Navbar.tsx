'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useState } from 'react';

export function Navbar() {
    const t = useTranslations('nav');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-[70] w-full border-b border-white/10 bg-slate-900/80 backdrop-blur-md shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-800 to-slate-950 opacity-95 -z-10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/40 pointer-events-none -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex justify-between items-center h-24">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
                        <div className="size-9 bg-primary text-white flex items-center justify-center rounded shadow-lg shadow-primary/40 group-hover:shadow-primary/60 transition-all">
                            <span className="material-symbols-outlined">restaurant</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white leading-none drop-shadow-sm">
                                {t('brand')}
                            </h1>
                            <span className="text-xs font-medium text-gray-400 tracking-[0.2em] uppercase">
                                {t('subtitle')}
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-10">
                        <Link
                            href="/programs"
                            className="text-sm font-semibold text-gray-200 hover:text-white transition-colors tracking-wide"
                        >
                            {t('programs')}
                        </Link>
                        <Link
                            href="/booking"
                            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors tracking-wide"
                        >
                            {t('booking')}
                        </Link>
                        <Link
                            href="/blog"
                            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors tracking-wide"
                        >
                            {t('blog')}
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors tracking-wide"
                        >
                            {t('aboutUs')}
                        </Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <LanguageSwitcher />
                        </div>
                        <button className="hidden md:flex items-center justify-center px-7 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 border border-primary-dark">
                            {t('applyNow')}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <span className="material-symbols-outlined">
                                {isMobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="py-4 space-y-3 border-t border-white/10">
                        <Link
                            className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                            href="/programs"
                        >
                            {t('programs')}
                        </Link>
                        <Link
                            className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                            href="/booking"
                        >
                            {t('booking')}
                        </Link>
                        <Link
                            className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                            href="/blog"
                        >
                            {t('blog')}
                        </Link>
                        <Link
                            className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                            href="/about"
                        >
                            {t('aboutUs')}
                        </Link>
                        <div className="px-4 py-2 flex justify-start">
                            <LanguageSwitcher />
                        </div>
                        <button className="w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded shadow-lg shadow-primary/30 transition-all">
                            {t('applyNow')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Material Icons Font */}
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        </nav>
    );
}
