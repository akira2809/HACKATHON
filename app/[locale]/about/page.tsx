import { useTranslations } from 'next-intl';
import { AboutHero } from '@/components/about/AboutHero';
import { TimelineSection } from '@/components/about/TimelineSection';
import { TeamSection } from '@/components/about/TeamSection';
import { ValuesSection } from '@/components/about/ValuesSection';
import { GlobalReach } from '@/components/about/GlobalReach';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { FloatingAdvisor } from '@/components/home/FloatingAdvisor';

export default function AboutPage() {
    const t = useTranslations('about');

    // Timeline events data
    const timelineEvents = [
        {
            year: '2012',
            title: t('timeline.event1.title'),
            description: t('timeline.event1.description'),
            isHighlighted: true
        },
        {
            year: '2015',
            title: t('timeline.event2.title'),
            description: t('timeline.event2.description')
        },
        {
            year: '2018',
            title: t('timeline.event3.title'),
            description: t('timeline.event3.description')
        },
        {
            year: '2023',
            title: t('timeline.event4.title'),
            description: t('timeline.event4.description')
        }
    ];

    // Team members data
    const teamMembers = [
        {
            name: t('team.member1.name'),
            role: t('team.member1.role'),
            badge: t('team.member1.badge'),
            description: t('team.member1.description'),
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRg3DdJ-yXuEVzsx2EJAtn7lFhNHSw9SDxQGvkKUJg7BwcZ7O-Ppo4GpHi3Gf37wsdyz2KYVpQip1UbtH9XQzZXx27seoOO0FSDUrguE4_hDfcnvGZGSqZKUzpXqzP_dz3edgK62pS7r7ObkuIAsEpoqTLdyuwCQK6gX2E-A_MFGmhFf9_uhvU6eJbICCmMoPz8__wVNvFv6Ane2NpK9rsz2SPTl4ZeHTrlRALpuObvrx2tzttPIH0BK9Dfp6FbivvZpDlg5r20fkh'
        },
        {
            name: t('team.member2.name'),
            role: t('team.member2.role'),
            badge: t('team.member2.badge'),
            description: t('team.member2.description'),
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHp3V7DncjNBHsqRUyIrHRICODiJd_NFnI1J612KVjOhotObObF5egygTv-XL3fEmRgnilKbU8uo29VWbCQLGjfSfhZcUlWu5nmvqKm0TzzsT5iNKNtgCL1ysKOMgC9UM_b1UnSUOrFzzJieVmmKsQuhV4MkGAOpjTaIHPix2_Mvgfsq5MGyZH5uSj7B5ZGgxi_PJRXnq-sFz6Hc4yp22ptnDvAIkvBbzmLy0MelVOLyRSVFsTJNhVaysdKKNcbnCU6fBiY1h4Q0nr'
        },
        {
            name: t('team.member3.name'),
            role: t('team.member3.role'),
            badge: t('team.member3.badge'),
            description: t('team.member3.description'),
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRg3DdJ-yXuEVzsx2EJAtn7lFhNHSw9SDxQGvkKUJg7BwcZ7O-Ppo4GpHi3Gf37wsdyz2KYVpQip1UbtH9XQzZXx27seoOO0FSDUrguE4_hDfcnvGZGSqZKUzpXqzP_dz3edgK62pS7r7ObkuIAsEpoqTLdyuwCQK6gX2E-A_MFGmhFf9_uhvU6eJbICCmMoPz8__wVNvFv6Ane2NpK9rsz2SPTl4ZeHTrlRALpuObvrx2tzttPIH0BK9Dfp6FbivvZpDlg5r20fkh'
        }
    ];

    // Values data
    const values = [
        {
            icon: 'verified',
            title: t('values.value1.title'),
            description: t('values.value1.description')
        },
        {
            icon: 'public',
            title: t('values.value2.title'),
            description: t('values.value2.description')
        },
        {
            icon: 'handshake',
            title: t('values.value3.title'),
            description: t('values.value3.description')
        }
    ];

    // Global offices data
    const offices = [
        { name: 'New York Office', position: { top: '30%', left: '22%' }, size: 'large' as const },
        { name: 'Zurich HQ', position: { top: '28%', left: '48%' }, size: 'large' as const, isHQ: true },
        { name: 'Dubai Partner', position: { top: '32%', left: '52%' }, size: 'small' as const },
        { name: 'Singapore Hub', position: { top: '45%', left: '78%' }, size: 'large' as const },
        { name: 'Sydney Partner', position: { top: '65%', left: '85%' }, size: 'small' as const },
        { name: 'Vancouver Partner', position: { top: '25%', left: '15%' }, size: 'small' as const }
    ];

    // Regions data
    const regions = [
        {
            name: t('global.regions.europe.name'),
            countries: ['Switzerland', 'France', 'UK', 'Spain'],
            isHighlighted: true
        },
        {
            name: t('global.regions.americas.name'),
            countries: ['USA', 'Canada', 'Brazil', 'Mexico']
        },
        {
            name: t('global.regions.asiaPacific.name'),
            countries: ['Singapore', 'Japan', 'Australia', 'Thailand']
        },
        {
            name: t('global.regions.middleEast.name'),
            countries: ['UAE', 'Qatar', 'Saudi Arabia']
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Hero Section */}
            <AboutHero
                badge={t('hero.badge')}
                title={t('hero.title')}
                titleHighlight={t('hero.titleHighlight')}
                titleEnd={t('hero.titleEnd')}
                description={t('hero.description')}
                backgroundImage="https://lh3.googleusercontent.com/aida-public/AB6AXuB3ieFc8icNGGPIHFjmZ9weS-H4-kZaj6cNSr5K1BZBhJ-Fnokvv1G8Muu9LAo7lvmBGeHPMwqUUhUw2i1Jf_iEPPqXwL_iwF22NIMK1ew2yhKatn0IigUzbAIe6ds-g4qe_UOSW8JZlJIZlsTjqDN2rcBXebi_2ry_-RzX-Db_elgmrX352OVLUdyJMraiNIC59DJK2BR0CPv8HdsHySUkaYg6szfcvQv7tspx1MOgFSDaioHlOa34Y_kWcL8S9JNdPVx7uIn1o43k"
            />

            {/* Timeline Section */}
            <TimelineSection
                title={t('timeline.title')}
                titleHighlight={t('timeline.titleHighlight')}
                description={t('timeline.description')}
                stats={{
                    years: t('timeline.stats.years'),
                    yearsLabel: t('timeline.stats.yearsLabel'),
                    careers: t('timeline.stats.careers'),
                    careersLabel: t('timeline.stats.careersLabel')
                }}
                events={timelineEvents}
                downloadButtonText={t('timeline.downloadButton')}
            />

            {/* Team Section */}
            <TeamSection
                title={t('team.title')}
                titleHighlight={t('team.titleHighlight')}
                description={t('team.description')}
                members={teamMembers}
            />

            {/* Values Section */}
            <ValuesSection
                title={t('values.title')}
                titleHighlight={t('values.titleHighlight')}
                description={t('values.description')}
                values={values}
            />

            {/* Global Reach Section */}
            <GlobalReach
                title={t('global.title')}
                titleHighlight={t('global.titleHighlight')}
                description={t('global.description')}
                stats={{
                    schools: t('global.stats.schools'),
                    countries: t('global.stats.countries')
                }}
                offices={offices}
                regions={regions}
            />
            <Footer />
            <FloatingAdvisor />
        </div>
    );
}
