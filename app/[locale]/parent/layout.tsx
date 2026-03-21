import { Fraunces, IBM_Plex_Sans, Manrope } from 'next/font/google';

const fraunces = Fraunces({
    subsets: ['latin'],
    variable: '--font-hearth-heading',
    weight: ['500', '600', '700'],
});

const manrope = Manrope({
    subsets: ['latin'],
    variable: '--font-hearth-body',
    weight: ['400', '500', '600', '700', '800'],
});

const ibmPlexSans = IBM_Plex_Sans({
    subsets: ['latin'],
    variable: '--font-hearth-number',
    weight: ['500', '600', '700'],
});

export default function ParentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${fraunces.variable} ${manrope.variable} ${ibmPlexSans.variable}`}>
            {children}
        </div>
    );
}
