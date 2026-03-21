import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'vi'],

    // Used when no locale matches
    defaultLocale: 'vi',

    // Locale prefix strategy
    // 'as-needed': Default locale (en) won't have prefix (/about instead of /en/about)
    // 'always': All locales will have prefix (/en/about, /vi/gioi-thieu)
    localePrefix: 'as-needed',

    // The `pathnames` object holds pairs of internal and
    // external paths. Based on the external path, the
    // correct internal pathname will be returned.
    pathnames: {
        '/': '/',
        '/programs': {
            en: '/programs',
            vi: '/chuong-trinh'
        },
        '/blog': {
            en: '/blog',
            vi: '/tin-tuc'
        },
        '/booking': {
            en: '/booking',
            vi: '/dat-lich'
        },
        '/about': {
            en: '/about',
            vi: '/gioi-thieu'
        }
    }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
