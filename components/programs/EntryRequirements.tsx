'use client';

interface EntryRequirementsProps {
    requirements: Array<{
        icon: string;
        category: string;
        title: string;
        description: string;
        badges?: string[];
    }>;
}

export function EntryRequirements({ requirements }: EntryRequirementsProps) {
    return (
        <section className="py-16 sm:py-24 bg-slate-900 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                        Entry Requirements
                    </h2>
                    <p className="text-gray-400">Standard criteria for admission into the Bachelor program.</p>
                </div>
                <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-12">
                    <div className="divide-y divide-gray-100">
                        {requirements.map((req, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6 sm:py-8 first:pt-0 last:pb-0">
                                <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-xs md:col-span-1">
                                    <span className="material-symbols-outlined text-lg">{req.icon}</span>
                                    {req.category}
                                </div>
                                <div className="md:col-span-3">
                                    <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-1">{req.title}</h4>
                                    <p className="text-sm text-gray-600 mb-4">{req.description}</p>
                                    {req.badges && req.badges.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {req.badges.map((badge, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded border border-gray-200"
                                                >
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-sm text-gray-500 italic">Do you need a preliminary assessment?</p>
                        <button className="px-6 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded flex items-center gap-2 transition-colors whitespace-nowrap">
                            Contact Admissions Team <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
