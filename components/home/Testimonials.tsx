'use client';

import { useTranslations } from 'next-intl';

export function Testimonials() {
    const t = useTranslations('testimonials');

    const stats = [
        { value: '95%', label: t('stats.placementRate') },
        { value: '50+', label: t('stats.globalPartners') },
        { value: '10+', label: t('stats.yearsExperience') },
        { value: '2k+', label: t('stats.alumniNetwork') }
    ];

    const testimonials = [
        {
            quote: t('quote1'),
            name: t('student1'),
            program: t('program1'),
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHp3V7DncjNBHsqRUyIrHRICODiJd_NFnI1J612KVjOhotObObF5egygTv-XL3fEmRgnilKbU8uo29VWbCQLGjfSfhZcUlWu5nmvqKm0TzzsT5iNKNtgCL1ysKOMgC9UM_b1UnSUOrFzzJieVmmKsQuhV4MkGAOpjTaIHPix2_Mvgfsq5MGyZH5uSj7B5ZGgxi_PJRXnq-sFz6Hc4yp22ptnDvAIkvBbzmLy0MelVOLyRSVFsTJNhVaysdKKNcbnCU6fBiY1h4Q0nr'
        },
        {
            quote: t('quote2'),
            name: t('student2'),
            program: t('program2'),
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3ieFc8icNGGPIHFjmZ9weS-H4-kZaj6cNSr5K1BZBhJ-Fnokvv1G8Muu9LAo7lvmBGeHPMwqUUhUw2i1Jf_iEPPqXwL_iwF22NIMK1ew2yhKatn0IigUzbAIe6ds-g4qe_UOSW8JZlJIZlsTjqDN2rcBXebi_2ry_-RzX-Db_elgmrX352OVLUdyJMraiNIC59DJK2BR0CPv8HdsHySUkaYg6szfcvQv7tspx1MOgFSDaioHlOa34Y_kWcL8S9JNdPVx7uIn1o43k'
        },
        {
            quote: t('quote3'),
            name: t('student3'),
            program: t('program3'),
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRg3DdJ-yXuEVzsx2EJAtn7lFhNHSw9SDxQGvkKUJg7BwcZ7O-Ppo4GpHi3Gf37wsdyz2KYVpQip1UbtH9XQzZXx27seoOO0FSDUrguE4_hDfcnvGZGSqZKUzpXqzP_dz3edgK62pS7r7ObkuIAsEpoqTLdyuwCQK6gX2E-A_MFGmhFf9_uhvU6eJbICCmMoPz8__wVNvFv6Ane2NpK9rsz2SPTl4ZeHTrlRALpuObvrx2tzttPIH0BK9Dfp6FbivvZpDlg5r20fkh'
        }
    ];

    return (
        <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                        {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
                        {t('description')}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-16 sm:mb-20 border-b border-gray-100 pb-8 sm:pb-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">
                                {stat.value}
                            </div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Testimonials */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-slate-50 p-6 sm:p-8 rounded-2xl relative">
                            <span className="material-symbols-outlined text-5xl sm:text-6xl text-gray-200 absolute top-4 right-4">
                                format_quote
                            </span>
                            <p className="text-slate-700 mb-6 relative z-10 italic text-sm sm:text-base">
                                {testimonial.quote}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                                    <img
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                        src={testimonial.image}
                                    />
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-900 text-sm">
                                        {testimonial.name}
                                    </h5>
                                    <span className="text-xs text-primary font-medium">
                                        {testimonial.program}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
