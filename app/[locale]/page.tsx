import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Hero } from '@/components/home/Hero';
import { TrustedPartners } from '@/components/home/TrustedPartners';
import { Programs } from '@/components/home/Programs';
import { SuccessStory } from '@/components/home/SuccessStory';
import { Testimonials } from '@/components/home/Testimonials';
import { ProcessTimeline } from '@/components/home/ProcessTimeline';
import { NewsSection } from '@/components/home/NewsSection';
import { ContactSection } from '@/components/common/ContactSection';
import { CTASection } from '@/components/home/CTASection';
import { FloatingAdvisor } from '@/components/home/FloatingAdvisor';

export default function Home() {
    return (
        <>
            <Navbar />
            <main className="bg-background-light">
                <Hero />
                <TrustedPartners />
                <Programs />
                <SuccessStory />
                <Testimonials />
                <ProcessTimeline />
                <NewsSection />
                <ContactSection />
                <CTASection />
            </main>
            <Footer />
            <FloatingAdvisor />

            {/* Google Fonts */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        </>
    );
}
