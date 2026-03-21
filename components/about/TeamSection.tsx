'use client';

interface TeamMember {
    name: string;
    role: string;
    badge: string;
    description: string;
    image: string;
}

interface TeamSectionProps {
    title: string;
    titleHighlight: string;
    description: string;
    members: TeamMember[];
}

export function TeamSection({ title, titleHighlight, description, members }: TeamSectionProps) {
    return (
        <section className="py-24 bg-background-light border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-slate-900 mb-6">
                        {title} <span className="text-primary">{titleHighlight}</span>
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        {description}
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {members.map((member, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                        >
                            {/* Image */}
                            <div className="h-80 overflow-hidden relative">
                                <div
                                    className="w-full h-full bg-cover bg-top transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url('${member.image}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                {/* Badge */}
                                <div className="absolute bottom-4 left-4">
                                    <span className={`px-2 py-1 text-white text-[10px] font-bold uppercase tracking-wider rounded ${index === 0 ? 'bg-primary' : 'bg-slate-800'
                                        }`}>
                                        {member.badge}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-primary font-bold uppercase tracking-wider mb-4">
                                    {member.role}
                                </p>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    {member.description}
                                </p>

                                {/* Social Links */}
                                <div className="flex gap-4 border-t border-gray-100 pt-6">
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined">social_leaderboard</span>
                                    </a>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined">mail</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
