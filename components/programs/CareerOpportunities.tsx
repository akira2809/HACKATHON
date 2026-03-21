'use client';

interface CareerOpportunitiesProps {
    careers: Array<{
        title: string;
        description: string;
        featured?: boolean;
    }>;
    imageUrl: string;
}

export function CareerOpportunities({ careers, imageUrl }: CareerOpportunitiesProps) {
    return (
        <section className="py-16 sm:py-24 bg-background-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="order-2 lg:order-1 relative group rounded-2xl overflow-hidden shadow-2xl">
                        <div
                            className="w-full h-[500px] sm:h-[600px] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('${imageUrl}')` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-8 left-8">
                            <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded mb-3 inline-block">
                                Success
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white">Global Placement</h3>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">
                            Career Opportunities
                        </h2>
                        <p className="text-slate-600 mb-10 leading-relaxed">
                            Graduates of our Bachelor in Culinary Arts are highly sought after by luxury hotels, fine dining restaurants, and catering companies worldwide. The integrated internships provide a significant advantage in the job market, often leading to direct employment offers upon graduation.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {careers.map((career, index) => (
                                <div
                                    key={index}
                                    className={`bg-white p-6 rounded-lg shadow-sm ${career.featured
                                            ? 'border-l-4 border-primary'
                                            : 'border-l-4 border-slate-300'
                                        }`}
                                >
                                    <h4 className="font-bold text-slate-900 mb-1">{career.title}</h4>
                                    <p className="text-xs text-gray-500">{career.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
