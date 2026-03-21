'use client';

interface LearningObjectivesProps {
    objectives: string[];
    imageUrl: string;
}

export function LearningObjectives({ objectives, imageUrl }: LearningObjectivesProps) {
    return (
        <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">
                            Key Learning Objectives
                        </h2>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            Our program goes beyond recipes. We cultivate the discipline, creativity, and business acumen required to lead modern kitchens. Students master classical French techniques while embracing contemporary global trends in sustainability and farm-to-table concepts.
                        </p>
                        <ul className="space-y-4">
                            {objectives.map((objective, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-primary text-sm font-bold">check</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{objective}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative group rounded-2xl overflow-hidden shadow-2xl">
                        <div
                            className="w-full h-[400px] sm:h-[500px] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('${imageUrl}')` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-8 left-8">
                            <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded mb-3 inline-block">
                                Focus
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white">Technique & Precision</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
