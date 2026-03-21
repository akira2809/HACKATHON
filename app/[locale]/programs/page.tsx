import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProgramsHero } from '@/components/programs/ProgramsHero';
import { ProgramCard } from '@/components/common/ProgramCard';
import { WhyStudyAbroad } from '@/components/programs/WhyStudyAbroad';
import { ProgramsCTA } from '@/components/programs/ProgramsCTA';
import { FloatingAdvisor } from '@/components/home/FloatingAdvisor';
import { useTranslations } from 'next-intl';

export default function ProgramsPage() {
    const t = useTranslations('programs');

    const featuredPrograms = [
        {
            slug: 'bachelor-hospitality-management-bhms',
            school: 'BHMS',
            location: 'Lucerne, Switzerland',
            title: 'Bachelor in Global Hospitality Management',
            description: 'Combine Swiss hospitality excellence with international business acumen in this comprehensive 3-year program.',
            duration: '3 Years',
            tuition: 'CHF 32,000/year',
            degreeType: 'Bachelor',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGA3zk9brp_nqiWFbuLOwDoOTTjtoooTzx53WgmksGqKCdHFP_rUpdOeYqeqYPVbyYa3XY5Q1d0pe_Znpf3Q1UZGVYj8PFhDejA1IyIIg75Bf8n-B-YoZZ6ouDVj5kggzJ8yiEuOQOCgoz008-4IaY--KtaCcz6pBT4o1Y6mJ81xTAN9KV1oraXOzZMqfru5N-P5gp9CD8DFH0B9Ps2MuyZhGiIZ7s-JJVkzr4lVK2Pe_od8s3MSSyqK1lFa7WCJReadU0roFjEt5U'
        },
        {
            slug: 'bachelor-culinary-arts-lcb',
            school: 'LCB',
            location: 'Paris, France',
            title: 'Bachelor in Culinary Arts & Business',
            description: 'Master French culinary techniques while developing entrepreneurial skills at the world\'s most prestigious culinary school.',
            duration: '3 Years',
            tuition: '€28,500/year',
            degreeType: 'Bachelor',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRg3DdJ-yXuEVzsx2EJAtn7lFhNHSw9SDxQGvkKUJg7BwcZ7O-Ppo4GpHi3Gf37wsdyz2KYVpQip1UbtH9XQzZXx27seoOO0FSDUrguE4_hDfcnvGZGSqZKUzpXqzP_dz3edgK62pS7r7ObkuIAsEpoqTLdyuwCQK6gX2E-A_MFGmhFf9_uhvU6eJbICCmMoPz8__wVNvFv6Ane2NpK9rsz2SPTl4ZeHTrlRALpuObvrx2tzttPIH0BK9Dfp6FbivvZpDlg5r20fkh'
        },
        {
            slug: 'bachelor-hospitality-management-ehl',
            school: 'EHL',
            location: 'Lausanne, Switzerland',
            title: 'Bachelor in International Hospitality Management',
            description: 'Study at the world\'s #1 hospitality school with guaranteed internships in luxury hotels worldwide.',
            duration: '3.5 Years',
            tuition: 'CHF 35,000/year',
            degreeType: 'Bachelor',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsdQbiZObxkZ9LhZkeYcQMQn8qvaJIh3yuB8CqpNov2OAqwgn4FwAtxi1v6GcjsZqnYR7qDpVVHI-iTFNoDPTFUGsBm253K-EvWqf_IRk_H7IqRVidkkxaID8woQ7jSB3R7L5ubFzwLtKXzkagFwq5CSH_RrBox9IeNkIGBsBwrkeLJ_4Haaky6PCCdIWwXBy7cJq_J519cBOtLRrFR9T01sTD-saU34cQVCkoD022PoWDyXQrcvUBkFnJmcrOxozGtGxe585cxEZK'
        },
        {
            slug: 'bachelor-culinary-management-alma',
            school: 'ALMA',
            location: 'Parma, Italy',
            title: 'Bachelor in Italian Culinary Excellence',
            description: 'Immerse yourself in authentic Italian cuisine and wine culture with hands-on training in Michelin-starred kitchens.',
            duration: '3 Years',
            tuition: '€24,000/year',
            degreeType: 'Bachelor',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5_7fiuTa_Z9i0pAVhI8vigmJy1uKH7l2GQdfzgNzM6ZfBC7QJs-Zb41lOcDwOG-XUKgDBf9u9O2oBXrQjYic_pGj-fBquoOVzOW527EeT0gjSzGidts4H83oTYVtPUQiHsvw9Z1gg5Sst6Sw660qQr6513IgFofup386WCXAXfXC9UEKdHcjziUIa0qZaolJPJ-XLmXEEOuyVKj_Ke7Pt7GSiOqTZzmiGARTwqI0MWV2F-zPY6XMCKPSxMCjFwxelQ0_zUj4vRUWx'
        },
        {
            slug: 'associate-culinary-arts-cia',
            school: 'CIA',
            location: 'New York, USA',
            title: 'Associate in Culinary Arts',
            description: 'Fast-track your culinary career with intensive training at America\'s premier culinary institute.',
            duration: '2 Years',
            tuition: '$32,000/year',
            degreeType: 'Associate',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRg3DdJ-yXuEVzsx2EJAtn7lFhNHSw9SDxQGvkKUJg7BwcZ7O-Ppo4GpHi3Gf37wsdyz2KYVpQip1UbtH9XQzZXx27seoOO0FSDUrguE4_hDfcnvGZGSqZKUzpXqzP_dz3edgK62pS7r7ObkuIAsEpoqTLdyuwCQK6gX2E-A_MFGmhFf9_uhvU6eJbICCmMoPz8__wVNvFv6Ane2NpK9rsz2SPTl4ZeHTrlRALpuObvrx2tzttPIH0BK9Dfp6FbivvZpDlg5r20fkh'
        },
        {
            slug: 'bachelor-hotel-management-ritz',
            school: 'RITZ',
            location: 'Paris, France',
            title: 'Bachelor in Luxury Hotel Management',
            description: 'Learn the art of luxury hospitality at the legendary Ritz Paris with exclusive industry connections.',
            duration: '3 Years',
            tuition: '€30,000/year',
            degreeType: 'Bachelor',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3ieFc8icNGGPIHFjmZ9weS-H4-kZaj6cNSr5K1BZBhJ-Fnokvv1G8Muu9LAo7lvmBGeHPMwqUUhUw2i1Jf_iEPPqXwL_iwF22NIMK1ew2yhKatn0IigUzbAIe6ds-g4qe_UOSW8JZlJIZlsTjqDN2rcBXebi_2ry_-RzX-Db_elgmrX352OVLUdyJMraiNIC59DJK2BR0CPv8HdsHySUkaYg6szfcvQv7tspx1MOgFSDaioHlOa34Y_kWcL8S9JNdPVx7uIn1o43k'
        }
    ];

    return (
        <>
            <Navbar />
            <main className="bg-background-light">
                <ProgramsHero />

                {/* Programs Grid */}
                <section className="py-12 sm:py-16 bg-background-light -mt-12 relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                {t('featured.title')}
                            </h2>
                            <div className="text-sm text-gray-500">
                                {t('featured.showing')} <span className="font-bold text-slate-900">6</span> {t('featured.of')} 24 {t('featured.results')}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {featuredPrograms.map((program, index) => (
                                <ProgramCard key={index} {...program} />
                            ))}
                        </div>

                        <div className="mt-8 sm:mt-12 text-center">
                            <button className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-900 font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-sm sm:text-base">
                                {t('featured.loadMore')}
                                <span className="material-symbols-outlined">expand_more</span>
                            </button>
                        </div>
                    </div>
                </section>

                <WhyStudyAbroad />
                <ProgramsCTA />
            </main>
            <Footer />
            <FloatingAdvisor />
        </>
    );
}
