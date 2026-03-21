export function buildLocalizedHref(locale: string | string[] | undefined, pathname: string) {
    const normalizedLocale = Array.isArray(locale) ? locale[0] : locale;

    if (!normalizedLocale || normalizedLocale === 'vi') {
        return pathname;
    }

    return `/${normalizedLocale}${pathname}`;
}
