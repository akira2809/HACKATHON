'use client';

import { useTranslations } from 'next-intl';

interface BlogArticleProps {
    title: string;
    category: string;
    author: {
        name: string;
        avatar: string;
        role: string;
    };
    publishedDate: string;
    readTime: string;
    featuredImage: string;
    content: string; // HTML content
}

export function BlogArticle({ title, category, author, publishedDate, readTime, featuredImage, content }: BlogArticleProps) {
    const t = useTranslations('blogDetail');

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Category Badge */}
            <div className="mb-6">
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                    {category}
                </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                {title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-gray-200"
                        style={{ backgroundImage: `url('${author.avatar}')` }}
                    ></div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">{author.name}</p>
                        <p className="text-xs text-gray-500">{author.role}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        {publishedDate}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {readTime}
                    </span>
                </div>
            </div>

            {/* Featured Image */}
            <div className="mb-10 sm:mb-12 rounded-2xl overflow-hidden shadow-xl">
                <div
                    className="w-full h-[300px] sm:h-[400px] md:h-[500px] bg-cover bg-center"
                    style={{ backgroundImage: `url('${featuredImage}')` }}
                ></div>
            </div>

            {/* Article Content */}
            <div
                className="prose prose-slate max-w-none
                    prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
                    prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-12 prose-h2:mb-6
                    prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-base prose-p:sm:text-lg prose-p:leading-relaxed prose-p:text-slate-900 prose-p:mb-6
                    prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-slate-900 prose-strong:font-bold
                    prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                    prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                    prose-li:text-slate-900 prose-li:mb-2
                    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-900
                    prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                    prose-code:text-primary prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-slate-900 prose-pre:text-white prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-8"
                dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm font-bold text-slate-900 mb-4">{t('share')}</p>
                <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary hover:text-white text-slate-700 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-lg">share</span>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary hover:text-white text-slate-700 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-lg">bookmark</span>
                    </button>
                </div>
            </div>
        </article>
    );
}
