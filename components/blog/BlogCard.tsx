'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface BlogCardProps {
    slug: string;
    category: string;
    date: string;
    readTime: string;
    title: string;
    excerpt: string;
    authorName: string;
    authorImage: string;
    imageUrl: string;
}

export function BlogCard({
    slug,
    category,
    date,
    readTime,
    title,
    excerpt,
    authorName,
    authorImage,
    imageUrl
}: BlogCardProps) {
    const t = useTranslations('blog.card');

    return (
        <Link href={`/blog/${slug}`} className="block h-full">
            <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-500 flex flex-col h-full cursor-pointer">
                {/* Image */}
                <div className="relative h-56 sm:h-64 overflow-hidden">
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${imageUrl}')` }}
                    ></div>
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur text-slate-900 text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded shadow-sm">
                        {category}
                    </span>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <span>{date}</span>
                        <span>•</span>
                        <span>{readTime}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 sm:mb-8 line-clamp-3 font-light flex-grow">
                        {excerpt}
                    </p>

                    {/* Author & Read More */}
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-full bg-cover bg-center border border-gray-100"
                                style={{ backgroundImage: `url('${authorImage}')` }}
                            ></div>
                            <span className="text-xs font-bold text-slate-900">{authorName}</span>
                        </div>
                        <div className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-1 group/link">
                            {t('readMore')}
                            <span className="material-symbols-outlined text-base transition-transform group-hover/link:translate-x-1">
                                chevron_right
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
