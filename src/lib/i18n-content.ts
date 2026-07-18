import { routing, type Locale } from '@/i18n/routing'

/**
 * Copy written once per locale, stored next to the structure it describes.
 *
 * Editorial content (case studies, the service catalogue) lives in typed data
 * files rather than `messages/*.json`: those objects carry nested structure —
 * phases, metrics, palettes, stacks — and keeping three parallel JSON trees in
 * sync with it is what drifts. Structural values (slugs, hex codes, URLs,
 * image paths, tech names) stay single and are never localized.
 *
 * Page-level copy stays in `messages/*.json`, where next-intl belongs.
 */
export type Localized<T> = Record<Locale, T>

/** Resolve a localized value, falling back to the default locale. */
export function pick<T>(value: Localized<T>, locale: string): T {
  return value[locale as Locale] ?? value[routing.defaultLocale]
}

/**
 * Map a record's `Localized` fields down to one locale, leaving every other
 * field untouched. Lets a page consume plain strings instead of threading the
 * locale through every property access.
 */
export type Resolved<T> = {
  [K in keyof T]: T[K] extends Localized<infer U> ? U : T[K]
}
