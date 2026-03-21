'use client';

import { useTranslations } from 'next-intl';

interface FeaturedArticleProps {
    category: string;
    readTime: string;
    title: string;
    description: string;
    imageUrl: string;
}

export function FeaturedArticle({
    category,
    readTime,
    title,
    description,
    imageUrl
}: FeaturedArticleProps) {
    const t = useTranslations('blog.featured');

    return (
        <section className="pb-12 sm:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="group bg-white rounded-3xl sm:rounded-[2rem] overflow-hidden shadow-premium border border-gray-50 flex flex-col lg:flex-row h-auto lg:min-h-[500px] transition-all duration-500 hover:shadow-2xl cursor-pointer">
                    {/* Image */}
                    <div className="lg:w-1/2 relative min-h-[300px] sm:min-h-[350px] overflow-hidden">
                        <div
                            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                            style={{ backgroundImage: `url('${imageUrl}')` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-r"></div>
                    </div>

                    {/* Content */}
                    <div className="lg:w-1/2 p-8 sm:p-10 lg:p-16 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded">
                                {t('badge')}
                            </span>
                            <span className="text-xs text-slate-400 font-bold uppercase">
                                • {readTime}
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight">
                            {title}
                        </h2>
                        <p className="text-base sm:text-lg text-slate-500 mb-6 sm:mb-8 leading-relaxed font-light">
                            {description}
                        </p>
                        <button className="w-max px-8 sm:px-10 py-3 sm:py-4 bg-primary hover:bg-primary-dark text-white text-sm font-black uppercase tracking-widest rounded flex items-center gap-2 transition-all shadow-xl shadow-primary/20">
                            {t('readButton')}
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
