import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  // Extract locale from the URL path
  const pathname = new URL(request.url).pathname
  const localeMatch = pathname.match(LOCALE_PREFIX)
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
    }
  }

  return NextResponse.redirect(new URL(`/${locale}/auth/login?error=oauth`, request.url))
}
