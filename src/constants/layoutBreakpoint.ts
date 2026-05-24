/**
 * Tailwind `lg` ile hizalı: bu genişliğin altında daha “snappy” UX (tam genişlikte native scroll ile tutarlı).
 */
export const LAYOUT_DESKTOP_MIN_PX = 1024 as const;

/** `(max-width: 1023px)` — tablet / telefon. */
export const MEDIA_MAX_NARROW = `(max-width: ${LAYOUT_DESKTOP_MIN_PX - 1}px)` as const;

/** `(min-width: 1024px)` — geniş masaüstü. */
export const MEDIA_MIN_DESKTOP = `(min-width: ${LAYOUT_DESKTOP_MIN_PX}px)` as const;
