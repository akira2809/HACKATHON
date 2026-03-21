'use client';

interface CourseProgressionProps {
    years: Array<{
        year: number;
        title: string;
        semesters: Array<{
            type: 'study' | 'work';
            duration: string;
            title: string;
            description: string;
        }>;
    }>;
}

export function CourseProgression({ years }: CourseProgressionProps) {
    return (
        <section className="py-16 sm:py-24 bg-background-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        COURSE <span className="text-primary">PROGRESSION</span>
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg max-w-3xl mx-auto">
                        Our unique "Study & Work" system allows you to gain 1.5 years of work experience during your 3-year bachelor degree.
                    </p>
                </div>
                <div className="space-y-8">
                    {years.map((year) => (
                        <div key={year.year} className="overflow-hidden rounded-xl shadow-lg border border-gray-200">
                            <div className="bg-slate-900 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-white gap-2">
                                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider">Year {year.year}</h3>
                                <span className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-widest">{year.title}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                {year.semesters.map((semester, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-6 sm:p-8 ${semester.type === 'study'
                                                ? 'bg-white border-r border-gray-100'
                                                : 'bg-slate-800'
                                            }`}
                                    >
                                        <span className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest mb-3 ${semester.type === 'study' ? 'text-primary' : 'text-white/60'
                                            }`}>
                                            <span className="material-symbols-outlined text-base">
                                                {semester.type === 'study' ? 'school' : 'work'}
                                            </span>
                                            {semester.duration}
                                        </span>
                                        <h4 className={`text-base sm:text-lg font-bold mb-2 ${semester.type === 'study' ? 'text-slate-900' : 'text-white'
                                            }`}>
                                            {semester.title}
                                        </h4>
                                        <p className={`text-sm leading-relaxed ${semester.type === 'study' ? 'text-gray-600' : 'text-gray-400'
                                            }`}>
                                            {semester.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
