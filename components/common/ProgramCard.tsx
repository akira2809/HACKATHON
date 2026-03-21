'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface ProgramCardProps {
    slug: string;
    school: string;
    location: string;
    title: string;
    description: string;
    duration: string;
    tuition: string;
    degreeType: string;
    imageUrl: string;
}

export function ProgramCard({
    slug,
    school,
    location,
    title,
    description,
    duration,
    tuition,
    degreeType,
    imageUrl
}: ProgramCardProps) {
    const t = useTranslations('programs');

    return (
        <Link href={`/programs/${slug}`} className="block h-full">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col h-full border border-gray-100 cursor-pointer">
                {/* Image */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${imageUrl}')` }}
                    ></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {degreeType}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-800 font-serif font-bold text-xs border border-gray-200">
                            {school}
                        </div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{location}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                        {description}
                    </p>

                    {/* Meta */}
                    <div className="mt-auto pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                        <div>
                            <span className="block text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                                {t('card.duration')}
                            </span>
                            <span className="text-sm font-semibold text-slate-700">{duration}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                                {t('card.tuition')}
                            </span>
                            <span className="text-sm font-semibold text-slate-700">{tuition}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
