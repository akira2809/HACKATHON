import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ContactSection } from '@/components/common/ContactSection';
import { FloatingAdvisor } from '@/components/home/FloatingAdvisor';

export default function BookingPage() {
    return (
        <>
            <Navbar />
            <main className="bg-background-light min-h-screen">
                <ContactSection />
            </main>
            <Footer />
            <FloatingAdvisor />
        </>
    );
}
