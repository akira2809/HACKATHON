import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { FeaturedArticle } from '@/components/blog/FeaturedArticle';
import { BlogCard } from '@/components/blog/BlogCard';
import { NewsletterCTA } from '@/components/blog/NewsletterCTA';
import { FloatingAdvisor } from '@/components/home/FloatingAdvisor';
import { useTranslations } from 'next-intl';

export default function BlogPage() {
    const t = useTranslations('blog');

    const articles = [
        {
            slug: 'fb-management-trends-2024',
            category: 'Business',
            date: 'May 14, 2024',
            readTime: '8 min read',
            title: 'F&B Management Trends 2024: Recruiters Outlook',
            excerpt: 'Sustainability, AI-driven logistics, and the "experiential" dining wave are reshaping how management roles are filled this year.',
            authorName: 'Marc Chen',
            authorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHp3V7DncjNBHsqRUyIrHRICODiJd_NFnI1J612KVjOhotObObF5egygTv-XL3fEmRgnilKbU8uo29VWbCQLGjfSfhZcUlWu5nmvqKm0TzzsT5iNKNtgCL1ysKOMgC9UM_b1UnSUOrFzzJieVmmKsQuhV4MkGAOpjTaIHPix2_Mvgfsq5MGyZH5uSj7B5ZGgxi_PJRXnq-sFz6Hc4yp22ptnDvAIkvBbzmLy0MelVOLyRSVFsTJNhVaysdKKNcbnCU6fBiY1h4Q0nr',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5_7fiuTa_Z9i0pAVhI8vigmJy1uKH7l2GQdfzgNzM6ZfBC7QJs-Zb41lOcDwOG-XUKgDBf9u9O2oBXrQjYic_pGj-fBquoOVzOW527EeT0gjSzGidts4H83oTYVtPUQiHsvw9Z1gg5Sst6Sw660qQr6513IgFofup386WCXAXfXC9UEKdHcjziUIa0qZaolJPJ-XLmXEEOuyVKj_Ke7Pt7GSiOqTZzmiGARTwqI0MWV2F-zPY6XMCKPSxMCjFwxelQ0_zUj4vRUWx'
        },
        {
            slug: 'winning-the-plate-top-scholarship-tips',
            category: 'Scholarships',
            date: 'May 10, 2024',
            readTime: '6 min read',
            title: 'Winning the Plate: Top Scholarship Tips',
            excerpt: 'Funding your culinary education abroad doesn\'t have to be a dream. Learn how to craft a portfolio that gets noticed by top institutions.',
            authorName: 'Elena Rossi',
            authorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHp3V7DncjNBHsqRUyIrHRICODiJd_NFnI1J612KVjOhotObObF5egygTv-XL3fEmRgnilKbU8uo29VWbCQLGjfSfhZcUlWu5nmvqKm0TzzsT5iNKNtgCL1ysKOMgC9UM_b1UnSUOrFzzJieVmmKsQuhV4MkGAOpjTaIHPix2_Mvgfsq5MGyZH5uSj7B5ZGgxi_PJRXnq-sFz6Hc4yp22ptnDvAIkvBbzmLy0MelVOLyRSVFsTJNhVaysdKKNcbnCU6fBiY1h4Q0nr',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsdQbiZObxkZ9LhZkeYcQMQn8qvaJIh3yuB8CqpNov2OAqwgn4FwAtxi1v6GcjsZqnYR7qDpVVHI-iTFNoDPTFUGsBm253K-EvWqf_IRk_H7IqRVidkkxaID8woQ7jSB3R7L5ubFzwLtKXzkagFwq5CSH_RrBox9IeNkIGBsBwrkeLJ_4Haaky6PCCdIWwXBy7cJq_J519cBOtLRrFR9T01sTD-saU34cQVCkoD022PoWDyXQrcvUBkFnJmcrOxozGtGxe585cxEZK'
        },
        {
            slug: 'beyond-the-kitchen-finding-your-community',
            category: 'Student Life',
            date: 'May 05, 2024',
            readTime: '10 min read',
            title: 'Beyond the Kitchen: Finding Your Community',
            excerpt: 'Living in a new country can be daunting. We explore the best ways to network and build a support system while studying abroad.',
            authorName: 'Julian Vane',
            authorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3ieFc8icNGGPIHFjmZ9weS-H4-kZaj6cNSr5K1BZBhJ-Fnokvv1G8Muu9LAo7lvmBGeHPMwqUUhUw2i1Jf_iEPPqXwL_iwF22NIMK1ew2yhKatn0IigUzbAIe6ds-g4qe_UOSW8JZlJIZlsTjqDN2rcBXebi_2ry_-RzX-Db_elgmrX352OVLUdyJMraiNIC59DJK2BR0CPv8HdsHySUkaYg6szfcvQv7tspx1MOgFSDaioHlOa34Y_kWcL8S9JNdPVx7uIn1o43k',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRg3DdJ-yXuEVzsx2EJAtn7lFhNHSw9SDxQGvkKUJg7BwcZ7O-Ppo4GpHi3Gf37wsdyz2KYVpQip1UbtH9XQzZXx27seoOO0FSDUrguE4_hDfcnvGZGSqZKUzpXqzP_dz3edgK62pS7r7ObkuIAsEpoqTLdyuwCQK6gX2E-A_MFGmhFf9_uhvU6eJbICCmMoPz8__wVNvFv6Ane2NpK9rsz2SPTl4ZeHTrlRALpuObvrx2tzttPIH0BK9Dfp6FbivvZpDlg5r20fkh'
        }
    ];

    return (
        <>
            <Navbar />
            <main className="bg-white    min-h-screen">
                <BlogHero />
                <BlogSearch />

                <FeaturedArticle
                    category="Featured Story"
                    readTime="12 min read"
                    title="Life as a Culinary Student in Paris: A Local's Guide"
                    description="Discover the daily rhythm of training in the world's gastronomic capital, from morning market runs at Rungis to securing Michelin-star internships in the heart of the city."
                    imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuB3ieFc8icNGGPIHFjmZ9weS-H4-kZaj6cNSr5K1BZBhJ-Fnokvv1G8Muu9LAo7lvmBGeHPMwqUUhUw2i1Jf_iEPPqXwL_iwF22NIMK1ew2yhKatn0IigUzbAIe6ds-g4qe_UOSW8JZlJIZlsTjqDN2rcBXebi_2ry_-RzX-Db_elgmrX352OVLUdyJMraiNIC59DJK2BR0CPv8HdsHySUkaYg6szfcvQv7tspx1MOgFSDaioHlOa34Y_kWcL8S9JNdPVx7uIn1o43k"
                />

                {/* Latest Insights */}
                <section className="pb-16 sm:pb-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8 sm:mb-10">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-4">
                                <span className="w-8 sm:w-10 h-1 bg-primary"></span>
                                {t('latestInsights')}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                            {articles.map((article, index) => (
                                <BlogCard key={index} {...article} />
                            ))}
                        </div>
                    </div>
                </section>

                <NewsletterCTA />
            </main>
            <Footer />
            <FloatingAdvisor />
        </>
    );
}
