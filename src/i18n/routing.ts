import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // German is here because two founding members relay the agency's
  // communication from Germany and France.
  locales: ['fr', 'en', 'de'],
  defaultLocale: 'fr',
})

export type Locale = (typeof routing.locales)[number]

export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value)
}
