'use client';

interface AboutHeroProps {
    title: string;
    titleHighlight: string;
    titleEnd: string;
    description: string;
    badge: string;
    backgroundImage: string;
}

export function AboutHero({ title, titleHighlight, titleEnd, description, badge, backgroundImage }: AboutHeroProps) {
    return (
        <section className="relative h-[60vh] min-h-[400px] sm:h-[70vh] sm:min-h-[500px] w-full overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat transform scale-105"
                    style={{ backgroundImage: `url('${backgroundImage}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 sm:via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-4xl space-y-4 sm:space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest rounded mb-1 sm:mb-2">
                        {badge}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                        {title} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                            {titleHighlight}
                        </span> <br />
                        {titleEnd}
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 font-light max-w-2xl leading-relaxed border-l-2 sm:border-l-4 border-primary pl-3 sm:pl-6">
                        {description}
                    </p>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="hidden sm:flex absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex-col items-center gap-1 sm:gap-2 text-white/50 animate-bounce">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest">Discover Our History</span>
                <span className="material-symbols-outlined text-lg sm:text-2xl">keyboard_arrow_down</span>
            </div>
        </section>
    );
}
