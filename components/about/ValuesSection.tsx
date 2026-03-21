'use client';

interface Value {
    icon: string;
    title: string;
    description: string;
}

interface ValuesSectionProps {
    title: string;
    titleHighlight: string;
    description: string;
    values: Value[];
}

export function ValuesSection({ title, titleHighlight, description, values }: ValuesSectionProps) {
    return (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        {title} <span className="text-primary">{titleHighlight}</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer"
                        >
                            {/* Icon */}
                            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-white text-4xl">
                                    {value.icon}
                                </span>
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-bold text-white mb-4">
                                {value.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
