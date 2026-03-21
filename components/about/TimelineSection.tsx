'use client';

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    isHighlighted?: boolean;
}

interface TimelineSectionProps {
    title: string;
    titleHighlight: string;
    description: string;
    stats: {
        years: string;
        yearsLabel: string;
        careers: string;
        careersLabel: string;
    };
    events: TimelineEvent[];
    downloadButtonText: string;
}

export function TimelineSection({
    title,
    titleHighlight,
    description,
    stats,
    events,
    downloadButtonText
}: TimelineSectionProps) {
    return (
        <section className="py-24 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Sticky Sidebar */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                                {title} <br />
                                <span className="text-primary">{titleHighlight}</span>
                            </h2>
                            <div className="h-1.5 w-20 bg-primary mb-8 rounded-full" />

                            <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                {description}
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h4 className="text-3xl font-black text-slate-900">{stats.years}</h4>
                                    <p className="text-xs uppercase tracking-wider text-slate-500">{stats.yearsLabel}</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black text-slate-900">{stats.careers}</h4>
                                    <p className="text-xs uppercase tracking-wider text-slate-500">{stats.careersLabel}</p>
                                </div>
                            </div>

                            <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded hover:bg-primary hover:text-white transition-all shadow-lg">
                                {downloadButtonText}
                            </button>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="lg:col-span-7">
                        <div className="relative pl-8 border-l-2 border-slate-200 space-y-16 py-4">
                            {events.map((event, index) => (
                                <div key={index} className="relative group">
                                    {/* Timeline Dot */}
                                    <div className={`absolute -left-[41px] top-1.5 flex items-center justify-center w-5 h-5 border-4 rounded-full z-10 transition-colors ${event.isHighlighted
                                            ? 'bg-white border-primary'
                                            : 'bg-slate-200 border-white group-hover:bg-primary'
                                        }`} />

                                    {/* Content */}
                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                        <div className="w-full md:w-1/3">
                                            <span className="text-5xl font-black text-slate-200 leading-none">
                                                {event.year}
                                            </span>
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
