'use client';

interface Office {
    name: string;
    position: { top: string; left: string };
    size: 'small' | 'medium' | 'large';
    isHQ?: boolean;
}

interface Region {
    name: string;
    countries: string[];
    isHighlighted?: boolean;
}

interface GlobalReachProps {
    title: string;
    titleHighlight: string;
    description: string;
    stats: {
        schools: string;
        countries: string;
    };
    offices: Office[];
    regions: Region[];
}

export function GlobalReach({ title, titleHighlight, description, stats, offices, regions }: GlobalReachProps) {
    const getSizeClasses = (size: string, isHQ: boolean = false) => {
        if (isHQ) return 'w-6 h-6 border-4';
        switch (size) {
            case 'large': return 'w-4 h-4 border-2';
            case 'medium': return 'w-4 h-4 border-2';
            case 'small': return 'w-3 h-3';
            default: return 'w-3 h-3';
        }
    };

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                            {title} <br />
                            <span className="text-primary">{titleHighlight}</span>
                        </h2>
                        <div className="h-1.5 w-20 bg-primary rounded-full" />
                        <p className="text-slate-600 mt-6 text-lg">
                            {description}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4">
                        <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-700 border border-slate-200">
                            {stats.schools}
                        </div>
                        <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-700 border border-slate-200">
                            {stats.countries}
                        </div>
                    </div>
                </div>

                {/* World Map */}
                <div className="relative w-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-inner p-8 min-h-[500px] flex items-center justify-center">
                    {/* Map Background */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-contain bg-center bg-no-repeat" />

                    {/* Office Markers */}
                    {offices.map((office, index) => (
                        <div
                            key={index}
                            className="absolute group cursor-pointer z-10"
                            style={{ top: office.position.top, left: office.position.left }}
                        >
                            <div className="relative flex items-center justify-center">
                                {/* Ping Animation for HQ */}
                                {office.isHQ && (
                                    <div className="w-6 h-6 bg-primary rounded-full animate-ping absolute opacity-50" />
                                )}

                                {/* Marker Dot */}
                                <div className={`${getSizeClasses(office.size, office.isHQ)} ${office.isHQ
                                        ? 'bg-primary border-white shadow-lg'
                                        : office.size === 'large'
                                            ? 'bg-primary border-white'
                                            : 'bg-slate-400 hover:bg-primary transition-colors'
                                    } rounded-full relative z-10`} />

                                {/* Tooltip */}
                                <div className={`absolute ${office.isHQ ? 'bottom-8 opacity-100' : 'bottom-6 opacity-0 group-hover:opacity-100'
                                    } left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold transition-opacity whitespace-nowrap shadow-xl`}>
                                    {office.name}
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Connection Lines (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M48 28 Q 35 25 22 30" fill="none" stroke="#F2994A" strokeWidth="0.2" />
                        <path d="M48 28 Q 65 35 78 45" fill="none" stroke="#F2994A" strokeWidth="0.2" />
                    </svg>
                </div>

                {/* Regions List */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {regions.map((region, index) => (
                        <div
                            key={index}
                            className={`border-l-2 pl-4 transition-colors ${region.isHighlighted
                                    ? 'border-primary'
                                    : 'border-slate-200 hover:border-primary'
                                }`}
                        >
                            <h4 className="font-bold text-slate-900">{region.name}</h4>
                            <ul className="mt-2 space-y-1 text-sm text-slate-500">
                                {region.countries.map((country, idx) => (
                                    <li key={idx}>{country}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
