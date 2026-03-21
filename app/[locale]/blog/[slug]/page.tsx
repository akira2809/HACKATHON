import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { FloatingAdvisor } from '@/components/home/FloatingAdvisor';
import { BlogArticle } from '@/components/blog/BlogArticle';
import { RecommendedArticles } from '@/components/blog/RecommendedArticles';
import { notFound } from 'next/navigation';

interface BlogDetailPageProps {
    params: {
        locale: string;
        slug: string;
    };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { slug } = await params;

    // Static data for now - will be replaced with API call
    const articleData = {
        title: 'How to Choose the Right Culinary School: A Complete Guide for Aspiring Chefs',
        category: 'Study Abroad Guide',
        author: {
            name: 'Sarah Mitchell',
            avatar: 'https://i.pravatar.cc/150?img=5',
            role: 'Education Consultant'
        },
        publishedDate: 'Jan 28, 2024',
        readTime: '8 min read',
        featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRg3DdJ-yXuEVzsx2EJAtn7lFhNHSw9SDxQGvkKUJg7BwcZ7O-Ppo4GpHi3Gf37wsdyz2KYVpQip1UbtH9XQzZXx27seoOO0FSDUrguE4_hDfcnvGZGSqZKUzpXqzP_dz3edgK62pS7r7ObkuIAsEpoqTLdyuwCQK6gX2E-A_MFGmhFf9_uhvU6eJbICCmMoPz8__wVNvFv6Ane2NpK9rsz2SPTl4ZeHTrlRALpuObvrx2tzttPIH0BK9Dfp6FbivvZpDlg5r20fkh',
        content: `
            <p>Choosing the right culinary school is one of the most important decisions you'll make in your journey to becoming a professional chef. With hundreds of institutions worldwide offering culinary programs, it can be overwhelming to determine which one aligns best with your career goals, learning style, and budget.</p>

            <h2>Understanding Different Types of Culinary Programs</h2>
            <p>Before diving into specific schools, it's crucial to understand the various types of culinary programs available:</p>

            <h3>1. Certificate Programs (6-12 months)</h3>
            <p>These intensive programs focus on fundamental cooking techniques and are ideal for career changers or those seeking quick entry into the industry. They typically cover:</p>
            <ul>
                <li>Basic knife skills and kitchen safety</li>
                <li>Classical cooking methods</li>
                <li>Baking and pastry fundamentals</li>
                <li>Menu planning and food costing</li>
            </ul>

            <h3>2. Associate Degrees (18-24 months)</h3>
            <p>Associate degree programs provide a more comprehensive education, combining hands-on training with business and management courses. These programs often include:</p>
            <ul>
                <li>Advanced culinary techniques</li>
                <li>Restaurant management</li>
                <li>Food service operations</li>
                <li>Nutrition and dietary planning</li>
            </ul>

            <h3>3. Bachelor's Degrees (3-4 years)</h3>
            <p>Bachelor's programs offer the most extensive education, preparing students for leadership roles in the culinary industry. The curriculum typically includes:</p>
            <ul>
                <li>Culinary arts mastery</li>
                <li>Business administration</li>
                <li>Hospitality management</li>
                <li>Entrepreneurship</li>
            </ul>

            <h2>Key Factors to Consider</h2>

            <h3>Accreditation and Reputation</h3>
            <p>Always verify that your chosen school is accredited by recognized culinary education bodies. Research the school's reputation in the industry by:</p>
            <ul>
                <li>Reading reviews from alumni</li>
                <li>Checking employment rates of graduates</li>
                <li>Investigating partnerships with restaurants and hotels</li>
                <li>Looking at awards and recognitions</li>
            </ul>

            <blockquote>
                "The best culinary schools don't just teach you how to cook—they teach you how to think like a chef, manage a kitchen, and build a sustainable career in the food industry." - Chef Thomas Keller
            </blockquote>

            <h3>Location and Internship Opportunities</h3>
            <p>The location of your culinary school can significantly impact your learning experience and career opportunities. Consider:</p>
            <ul>
                <li><strong>Culinary capitals:</strong> Cities like Paris, New York, Tokyo, and Bangkok offer unparalleled exposure to diverse cuisines and networking opportunities</li>
                <li><strong>Internship programs:</strong> Schools with strong industry connections can provide access to prestigious restaurants and hotels</li>
                <li><strong>Cultural immersion:</strong> Studying abroad allows you to experience authentic culinary traditions firsthand</li>
            </ul>

            <h3>Cost and Financial Aid</h3>
            <p>Culinary education can be expensive, but various financial aid options are available:</p>
            <ul>
                <li>Scholarships based on merit or need</li>
                <li>Student loans and payment plans</li>
                <li>Work-study programs</li>
                <li>Grants from culinary organizations</li>
            </ul>

            <h2>Making Your Final Decision</h2>
            <p>After researching schools and narrowing down your options, take these final steps:</p>
            <ol>
                <li><strong>Visit campuses:</strong> If possible, tour the facilities and observe classes in session</li>
                <li><strong>Talk to current students and alumni:</strong> Get firsthand insights about the program</li>
                <li><strong>Review the curriculum:</strong> Ensure it aligns with your career goals</li>
                <li><strong>Consider the chef instructors:</strong> Research their backgrounds and industry experience</li>
                <li><strong>Evaluate job placement services:</strong> Strong career support can make a significant difference</li>
            </ol>

            <h2>Conclusion</h2>
            <p>Choosing the right culinary school requires careful research and self-reflection. Consider your career goals, learning preferences, budget, and desired location. Remember that the "best" school is the one that best fits your individual needs and aspirations. Take your time, ask questions, and trust your instincts—your culinary journey is just beginning!</p>

            <p>Ready to start your culinary education? <a href="/programs">Explore our curated list of top culinary schools worldwide</a> and find the perfect program for you.</p>
        `
    };

    const recommendedArticles = [
        {
            slug: 'top-10-culinary-schools-europe',
            category: 'Rankings',
            title: 'Top 10 Culinary Schools in Europe for 2024',
            excerpt: 'Discover the best culinary institutions across Europe, from Le Cordon Bleu Paris to Alma in Italy.',
            author: {
                name: 'Michael Chen',
                avatar: 'https://i.pravatar.cc/150?img=12'
            },
            publishedDate: 'Jan 25, 2024',
            readTime: '6 min read',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsdQbiZObxkZ9LhZkeYcQMQn8qvaJIh3yuB8CqpNov2OAqwgn4FwAtxi1v6GcjsZqnYR7qDpVVHI-iTFNoDPTFUGsBm253K-EvWqf_IRk_H7IqRVidkkxaID8woQ7jSB3R7L5ubFzwLtKXzkagFwq5CSH_RrBox9IeNkIGBsBwrkeLJ_4Haaky6PCCdIWwXBy7cJq_J519cBOtLRrFR9T01sTD-saU34cQVCkoD022PoWDyXQrcvUBkFnJmcrOxozGtGxe585cxEZK'
        },
        {
            slug: 'scholarship-guide-culinary-students',
            category: 'Financial Aid',
            title: 'Complete Scholarship Guide for Culinary Students',
            excerpt: 'Learn about available scholarships, grants, and financial aid options for aspiring chefs worldwide.',
            author: {
                name: 'Emma Rodriguez',
                avatar: 'https://i.pravatar.cc/150?img=9'
            },
            publishedDate: 'Jan 22, 2024',
            readTime: '10 min read',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5_7fiuTa_Z9i0pAVhI8vigmJy1uKH7l2GQdfzgNzM6ZfBC7QJs-Zb41lOcDwOG-XUKgDBf9u9O2oBXrQjYic_pGj-fBquoOVzOW527EeT0gjSzGidts4H83oTYVtPUQiHsvw9Z1gg5Sst6Sw660qQr6513IgFofup386WCXAXfXC9UEKdHcjziUIa0qZaolJPJ-XLmXEEOuyVKj_Ke7Pt7GSiOqTZzmiGARTwqI0MWV2F-zPY6XMCKPSxMCjFwxelQ0_zUj4vRUWx'
        },
        {
            slug: 'day-in-life-culinary-student',
            category: 'Student Life',
            title: 'A Day in the Life of a Culinary Student in Switzerland',
            excerpt: 'Follow a student through their daily routine at a prestigious Swiss culinary school.',
            author: {
                name: 'Lucas Weber',
                avatar: 'https://i.pravatar.cc/150?img=15'
            },
            publishedDate: 'Jan 20, 2024',
            readTime: '5 min read',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGA3zk9brp_nqiWFbuLOwDoOTTjtoooTzx53WgmksGqKCdHFP_rUpdOeYqeqYPVbyYa3XY5Q1d0pe_Znpf3Q1UZGVYj8PFhDejA1IyIIg75Bf8n-B-YoZZ6ouDVj5kggzJ8yiEuOQOCgoz008-4IaY--KtaCcz6pBT4o1Y6mJ81xTAN9KV1oraXOjZMqfru5N-P5gp9CD8DFH0B9Ps2MuyZhGiIZ7s-JJVkzr4lVK2Pe_od8s3MSSyqK1lFa7WCJReadU0roFjEt5U'
        }
    ];

    return (
        <>
            <Navbar />
            <main className="bg-white">
                <BlogArticle {...articleData} />
                <RecommendedArticles articles={recommendedArticles} />
            </main>
            <Footer />
            <FloatingAdvisor />
        </>
    );
}
