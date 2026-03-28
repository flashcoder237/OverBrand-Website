import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Strip locale prefix to check the real path
  const pathnameWithoutLocale = pathname.replace(/^\/(fr|en)/, '') || '/'

  const isProtected =
    pathnameWithoutLocale.startsWith('/dashboard') ||
    pathnameWithoutLocale.startsWith('/admin')
  const isAuth = pathnameWithoutLocale.startsWith('/auth')

  if (isProtected || isAuth) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const localeMatch = pathname.match(/^\/(fr|en)/)
    const locale = localeMatch ? localeMatch[1] : 'fr'

    if (isProtected && !user) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/auth/login`
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    if (isAuth && user) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/dashboard`
      return NextResponse.redirect(url)
    }

    // If path has no locale prefix, redirect to locale-prefixed version
    if (!localeMatch) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}${pathname}`
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\..*).*)',
  ],
}
