/**
 * Academia "soft launch": while false, the academy works by direct URL but is
 * not linked from the header, not listed in the sitemap and marked noindex.
 * Turn it on by setting NEXT_PUBLIC_ACADEMY_PUBLIC="true" at build time.
 */
export const ACADEMY_PUBLIC = process.env.NEXT_PUBLIC_ACADEMY_PUBLIC === "true";
