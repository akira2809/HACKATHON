import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { FloatingAdvisor } from '@/components/home/FloatingAdvisor';
import { CourseProgression } from '@/components/programs/CourseProgression';
import { LearningObjectives } from '@/components/programs/LearningObjectives';
import { CareerOpportunities } from '@/components/programs/CareerOpportunities';
import { EntryRequirements } from '@/components/programs/EntryRequirements';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface ProgramDetailPageProps {
    params: {
        locale: string;
        slug: string;
    };
}

export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
    const { slug } = params;
    const t = useTranslations('programDetail');

    // Static data for now - will be dynamic later
    const programData = {
        badge: 'Undergraduate Program',
        title: 'BACHELOR IN',
        titleHighlight: 'CULINARY ARTS',
        description: 'Master the fundamental techniques of international cuisine while developing the managerial acumen required for leadership roles. This program combines intensive practical training in Michelin-standard kitchens with advanced business theory.',
        heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRg3DdJ-yXuEVzsx2EJAtn7lFhNHSw9SDxQGvkKUJg7BwcZ7O-Ppo4GpHi3Gf37wsdyz2KYVpQip1UbtH9XQzZXx27seoOO0FSDUrguE4_hDfcnvGZGSqZKUzpXqzP_dz3edgK62pS7r7ObkuIAsEpoqTLdyuwCQK6gX2E-A_MFGmhFf9_uhvU6eJbICCmMoPz8__wVNvFv6Ane2NpK9rsz2SPTl4ZeHTrlRALpuObvrx2tzttPIH0BK9Dfp6FbivvZpDlg5r20fkh',
        quickInfo: {
            duration: {
                title: '3 Years (Full-time)',
                subtitle: '18 months study + 18 months work'
            },
            intakes: {
                title: 'Feb, Aug, Nov',
                subtitle: 'Rolling admissions available'
            },
            location: {
                title: 'Lucerne, Switzerland',
                subtitle: 'City Center Campus'
            }
        },
        courseProgression: [
            {
                year: 1,
                title: 'Diploma in Culinary Arts',
                semesters: [
                    {
                        type: 'study' as const,
                        duration: 'Semester 1 (6 Months)',
                        title: 'Academic Study & Practical Training',
                        description: 'Fundamentals of cooking, food safety, nutrition, and kitchen operations. Introduction to industry standards and basic culinary skills.'
                    },
                    {
                        type: 'work' as const,
                        duration: 'Semester 2 (4-6 Months)',
                        title: 'Paid Internship',
                        description: 'Industry placement in Switzerland or worldwide. Practical application of skills in a real-world environment.'
                    }
                ]
            },
            {
                year: 2,
                title: 'Higher Diploma in Culinary Arts',
                semesters: [
                    {
                        type: 'study' as const,
                        duration: 'Semester 3 (6 Months)',
                        title: 'Advanced Culinary Techniques',
                        description: 'Advanced European cuisine, garde manger, baking & pastry arts, and menu design concepts. Focus on creativity and precision.'
                    },
                    {
                        type: 'work' as const,
                        duration: 'Semester 4 (4-6 Months)',
                        title: 'Paid Internship',
                        description: 'Advanced placement with opportunities for supervisory experience in the hospitality sector.'
                    }
                ]
            },
            {
                year: 3,
                title: 'Bachelor Degree in Culinary Arts',
                semesters: [
                    {
                        type: 'study' as const,
                        duration: 'Semester 5 (6 Months)',
                        title: 'Culinary Management',
                        description: 'Food service management, entrepreneurship, strategic management, and leadership in culinary business.'
                    },
                    {
                        type: 'work' as const,
                        duration: 'Semester 6 (4-6 Months)',
                        title: 'Internship or Thesis',
                        description: 'Final industry placement or academic research project to complete degree requirements.'
                    }
                ]
            }
        ],
        learningObjectives: [
            'Mastery of classical and modern European cooking methods.',
            'Comprehensive understanding of food safety and hygiene (HACCP).',
            'Menu planning, costing, and nutritional analysis for profitability.',
            'Kitchen leadership and team management skills.'
        ],
        careers: [
            { title: 'Executive Chef', description: 'Lead high-volume kitchens', featured: true },
            { title: 'F&B Manager', description: 'Oversee dining operations', featured: false },
            { title: 'Private Chef', description: 'Exclusive client service', featured: false },
            { title: 'Entrepreneur', description: 'Launch your own concept', featured: true }
        ],
        entryRequirements: [
            {
                icon: 'person',
                category: 'Age',
                title: 'Minimum 17 years old',
                description: 'Candidates must be at least 17 years of age at the start of the program.'
            },
            {
                icon: 'school',
                category: 'Education',
                title: 'Secondary Education',
                description: 'Completed High School Diploma or equivalent (e.g., IB, A-Levels, Abitur) with good academic standing.'
            },
            {
                icon: 'translate',
                category: 'Language',
                title: 'English Proficiency',
                description: 'Students whose mother tongue is not English must provide one of the following:',
                badges: ['IELTS 5.0', 'TOEFL iBT 60', 'PTE 42']
            }
        ],
        featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGA3zk9brp_nqiWFbuLOwDoOTTjtoooTzx53WgmksGqKCdHFP_rUpdOeYqeqYPVbyYa3XY5Q1d0pe_Znpf3Q1UZGVYj8PFhDejA1IyIIg75Bf8n-B-YoZZ6ouDVj5kggzJ8yiEuOQOCgoz008-4IaY--KtaCcz6pBT4o1Y6mJ81xTAN9KV1oraXOjZMqfru5N-P5gp9CD8DFH0B9Ps2MuyZhGiIZ7s-JJVkzr4lVK2Pe_od8s3MSSyqK1lFa7WCJReadU0roFjEt5U'
    };

    return (
        <>
            <Navbar />
            <main className="bg-background-light">
                {/* Hero Section */}
                <section className="relative h-[65vh] min-h-[550px] w-full overflow-hidden flex items-center justify-center bg-slate-900">
                    <div className="absolute inset-0 z-0">
                        <div
                            className="w-full h-full bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url('${programData.heroImage}')` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30"></div>
                    </div>
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="max-w-4xl">
                            <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded mb-6 border border-white/20">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                {programData.badge}
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
                                {programData.title} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-400">
                                    {programData.titleHighlight}
                                </span>
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-gray-300 font-light max-w-2xl leading-relaxed mb-10">
                                {programData.description}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold uppercase tracking-widest rounded shadow-xl shadow-primary/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                    {t('hero.downloadBrochure')} <span className="material-symbols-outlined text-lg">download</span>
                                </button>
                                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-gray-100 text-slate-900 text-sm font-bold uppercase tracking-widest rounded shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                    {t('hero.bookVisit')} <span className="material-symbols-outlined text-lg">calendar_month</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Info Cards */}
                <div className="relative z-20 -mt-10 mb-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 lg:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                <div className="flex flex-col items-center text-center p-6">
                                    <div className="w-14 h-14 rounded-full bg-red-50 text-primary flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-2xl">schedule</span>
                                    </div>
                                    <h4 className="font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">{t('quickInfo.duration')}</h4>
                                    <p className="text-xl font-bold text-slate-900 mb-1">{programData.quickInfo.duration.title}</p>
                                    <p className="text-xs text-gray-400">{programData.quickInfo.duration.subtitle}</p>
                                </div>
                                <div className="flex flex-col items-center text-center p-6">
                                    <div className="w-14 h-14 rounded-full bg-red-50 text-primary flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-2xl">calendar_month</span>
                                    </div>
                                    <h4 className="font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">{t('quickInfo.intakes')}</h4>
                                    <p className="text-xl font-bold text-slate-900 mb-1">{programData.quickInfo.intakes.title}</p>
                                    <p className="text-xs text-gray-400">{programData.quickInfo.intakes.subtitle}</p>
                                </div>
                                <div className="flex flex-col items-center text-center p-6">
                                    <div className="w-14 h-14 rounded-full bg-red-50 text-primary flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-2xl">location_on</span>
                                    </div>
                                    <h4 className="font-bold text-xs text-gray-500 uppercase tracking-widest mb-2">{t('quickInfo.location')}</h4>
                                    <p className="text-xl font-bold text-slate-900 mb-1">{programData.quickInfo.location.title}</p>
                                    <p className="text-xs text-gray-400">{programData.quickInfo.location.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Progression */}
                <CourseProgression years={programData.courseProgression} />

                {/* Learning Objectives */}
                <LearningObjectives
                    objectives={programData.learningObjectives}
                    imageUrl={programData.featuredImage}
                />

                {/* Career Opportunities */}
                <CareerOpportunities
                    careers={programData.careers}
                    imageUrl={programData.featuredImage}
                />

                {/* Entry Requirements */}
                <EntryRequirements requirements={programData.entryRequirements} />

                {/* CTA Section */}
                <section className="relative py-24 sm:py-32 flex items-center justify-center overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 z-0">
                        <div className="w-full h-full bg-cover bg-center transform scale-105" style={{ backgroundImage: `url('${programData.heroImage}')` }}></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-primary/80 opacity-90"></div>
                    </div>
                    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-xl">
                            {t('cta.title')}
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                            {t('cta.description')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                            <button className="px-8 sm:px-10 py-4 sm:py-5 bg-primary hover:bg-primary-dark text-white text-base font-bold rounded shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 border border-primary-dark">
                                {t('cta.applyButton')}
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                            <button className="px-8 sm:px-10 py-4 sm:py-5 bg-transparent hover:bg-white/10 text-white text-base font-bold rounded border-2 border-white backdrop-blur-sm transition-all flex items-center justify-center gap-2">
                                {t('cta.downloadButton')}
                                <span className="material-symbols-outlined">download</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <FloatingAdvisor />
        </>
    );
}
