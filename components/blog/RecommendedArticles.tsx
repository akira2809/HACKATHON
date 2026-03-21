'use client';

import { useTranslations } from 'next-intl';
import { BlogCard } from './BlogCard';

interface RecommendedArticle {
    slug: string;
    category: string;
    title: string;
    excerpt: string;
    author: {
        name: string;
        avatar: string;
    };
    publishedDate: string;
    readTime: string;
    imageUrl: string;
}

interface RecommendedArticlesProps {
    articles: RecommendedArticle[];
}

export function RecommendedArticles({ articles }: RecommendedArticlesProps) {
    const t = useTranslations('blogDetail');

    return (
        <section className="py-16 sm:py-20 bg-background-light border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3">
                        {t('recommended.title')}
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                        {t('recommended.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {articles.map((article) => (
                        <BlogCard
                            key={article.slug}
                            slug={article.slug}
                            category={article.category}
                            title={article.title}
                            excerpt={article.excerpt}
                            authorName={article.author.name}
                            authorImage={article.author.avatar}
                            date={article.publishedDate}
                            readTime={article.readTime}
                            imageUrl={article.imageUrl}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
