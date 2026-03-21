'use client';

import { useTranslations } from 'next-intl';

export function Programs() {
    const t = useTranslations('homePrograms');

    const programs = [
        {
            key: 'culinaryArts',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOl4FE9ar07GLyOAlUkiweKDoMO29Qp80A9BhiYqiAeB2F393UVTOQSlV9dGo98BdaNSszIMkryMM0yxsDmyPFVxEd6B4O2R7nv-kHraqBc-g0q1vz-lOtATBsxoyQf3_BJUXjtQv7kSleTVX9yuBDuHuQVLygh9nzKejTae4RtjjRc-wnRgvuDe1fHC6aLB3YdpRGbrC9iyii66TYU0K0hSlMqXvUVtoO36nxW1bfriUaN5HTBtHF2OeWn6p-LirgXmMDAjEnqsAg',
            colSpan: 'lg:col-span-2'
        },
        {
            key: 'pastryArts',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUYAbsucmAFzw6-9QWyZ-F8qYlVfYhFj1zK-MGKMiGLCndzU-O7PPpDnLwJ07Dj6Er1B9C4Gfpz7oeIi6khevCx-FwewRqLQBWFpgstR457u2yiILXVq1YzIZjdr5BhBIKYXmhtY9OLclstSzfH5bXnYVJ1Cuw2APfOpDn8zzU4YXwWCJMxNcNA7FE5RwNlECHhHLy6Pq9p9bMhsJnYJHa-dLVIVrt20umOn3U4WJPaZsnTZ7-HOGIpCZUdusnhLTX3oHeioQVDhuB',
            colSpan: 'lg:col-span-2'
        },
        {
            key: 'foodBusiness',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5_7fiuTa_Z9i0pAVhI8vigmJy1uKH7l2GQdfzgNzM6ZfBC7QJs-Zb41lOcDwOG-XUKgDBf9u9O2oBXrQjYic_pGj-fBquoOVzOW527EeT0gjSzGidts4H83oTYVtPUQiHsvw9Z1gg5Sst6Sw660qQr6513IgFofup386WCXAXfXC9UEKdHcjziUIa0qZaolJPJ-XLmXEEOuyVKj_Ke7Pt7GSiOqTZzmiGARTwqI0MWV2F-zPY6XMCKPSxMCjFwxelQ0_zUj4vRUWx',
            colSpan: 'lg:col-span-2'
        },
        {
            key: 'culinaryScience',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr50tvQEc99TL-XcUCQXOvvFFKwuA_c0_TiKikuIF9x9ZOyA9PfiT-W8PWKORfkIa2iwGwnbanrUJtdBlMGz-xpW7TVzEoqnmxkcMhti77fEyVNDc-IKrv07q2GxmhMkFXYSadqZ90O-5NNbsbXFFpau3dp1iSNJMtXQmMxGbMzNXhpj6rYnaiSfm1M8332HzNcovBqriiqvxjTx-XXj-1hyVsPGstDrCLhO_GnZPdY0XsYCPhlh-dytQJqVAQonPEzEzuBTDX83N1',
            colSpan: 'lg:col-span-3'
        },
        {
            key: 'hospitality',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsdQbiZObxkZ9LhZkeYcQMQn8qvaJIh3yuB8CqpNov2OAqwgn4FwAtxi1v6GcjsZqnYR7qDpVVHI-iTFNoDPTFUGsBm253K-EvWqf_IRk_H7IqRVidkkxaID8woQ7jSB3R7L5ubFzwLtKXzkagFwq5CSH_RrBox9IeNkIGBsBwrkeLJ_4Haaky6PCCdIWwXBy7cJq_J519cBOtLRrFR9T01sTD-saU34cQVCkoD022PoWDyXQrcvUBkFnJmcrOxozGtGxe585cxEZK',
            colSpan: 'lg:col-span-3'
        }
    ];

    return (
        <section className="py-16 sm:py-24 bg-white border-b border-gray-200" id="programs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 sm:mb-16 text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight">
                        {t('title')} <br />
                        <span className="text-primary">{t('titleHighlight')}</span>
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                        {t('description')}
                    </p>
                </div>

                {/* Programs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
                    {programs.map((program) => (
                        <div
                            key={program.key}
                            className={`${program.colSpan} group relative h-[350px] sm:h-[450px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300`}
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110 group-hover:blur-sm"
                                style={{ backgroundImage: `url('${program.image}')` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-colors duration-500"></div>

                            {/* Content */}
                            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 drop-shadow-md">
                                    {t(`${program.key}.title`)}
                                </h3>
                                <div className="border-l-4 border-primary pl-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 h-0 group-hover:h-auto overflow-hidden">
                                    <p className="text-white/90 text-sm font-semibold tracking-wide uppercase mt-2">
                                        {t(`${program.key}.subtitle`)}
                                    </p>
                                    <p className="text-gray-300 text-xs mt-1">
                                        {t(`${program.key}.duration`)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
