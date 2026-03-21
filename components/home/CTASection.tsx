'use client';

import { useTranslations } from 'next-intl';

export function CTASection() {
    const t = useTranslations('cta');

    return (
        <section className="relative py-24 sm:py-32 flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center transform scale-105"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBGA3zk9brp_nqiWFbuLOwDoOTTjtoooTzx53WgmksGqKCdHFP_rUpdOeYqeqYPVbyYa3XY5Q1d0pe_Znpf3Q1UZGVYj8PFhDejA1IyIIg75Bf8n-B-YoZZ6ouDVj5kggzJ8yiEuOQOCgoz008-4IaY--KtaCcz6pBT4o1Y6mJ81xTAN9KV1oraXOjZMqfru5N-P5gp9CD8DFH0B9Ps2MuyZhGiIZ7s-JJVkzr4lVK2Pe_od8s3MSSyqK1lFa7WCJReadU0roFjEt5U')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-primary/80 opacity-90"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight tracking-tight drop-shadow-xl">
                    {t('title')}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 sm:mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                    {t('description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center">
                    <button className="px-8 sm:px-10 py-4 sm:py-5 bg-primary hover:bg-primary-dark text-white text-sm sm:text-base font-bold rounded shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 border border-primary-dark">
                        {t('applyNow')}
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                    <button className="px-8 sm:px-10 py-4 sm:py-5 bg-transparent hover:bg-white/10 text-white text-sm sm:text-base font-bold rounded border-2 border-white backdrop-blur-sm transition-all flex items-center justify-center gap-2">
                        {t('downloadProspectus')}
                        <span className="material-symbols-outlined">download</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
