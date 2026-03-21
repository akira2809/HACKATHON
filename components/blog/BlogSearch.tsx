'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function BlogSearch() {
    const t = useTranslations('blog.search');
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', key: 'all' },
        { id: 'cooking', key: 'cooking' },
        { id: 'business', key: 'business' },
        { id: 'studentLife', key: 'studentLife' },
        { id: 'careerAdvice', key: 'careerAdvice' },
        { id: 'scholarships', key: 'scholarships' }
    ];

    return (
        <section className="pb-8 sm:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6">
                    {/* Search Bar */}
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400">search</span>
                        </div>
                        <input
                            className="block w-full pl-12 pr-4 py-4 border-gray-100 bg-white rounded-xl leading-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                            placeholder={t('placeholder')}
                            type="text"
                        />
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-3 items-center">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-black rounded uppercase tracking-wider transition-all ${activeCategory === category.id
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-white text-slate-600 border border-gray-100 hover:text-primary hover:border-primary'
                                    }`}
                            >
                                {t(`categories.${category.key}`)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
