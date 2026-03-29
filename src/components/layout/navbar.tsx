'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { useTheme } from 'next-themes'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: string) {
    // Replace /fr/ or /en/ at start of path
    const newPath = pathname.replace(/^\/(fr|en)/, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
      <button
        onClick={() => switchLocale('fr')}
        className="px-2 py-1 transition-opacity"
        style={{
          color: locale === 'fr' ? 'var(--primary)' : 'var(--text-subtle)',
          opacity: locale === 'fr' ? 1 : 0.5,
          borderBottom: locale === 'fr' ? '1.5px solid var(--primary)' : '1.5px solid transparent',
        }}
      >
        FR
      </button>
      <span style={{ color: 'var(--border)' }}>|</span>
      <button
        onClick={() => switchLocale('en')}
        className="px-2 py-1 transition-opacity"
        style={{
          color: locale === 'en' ? 'var(--primary)' : 'var(--text-subtle)',
          opacity: locale === 'en' ? 1 : 0.5,
          borderBottom: locale === 'en' ? '1.5px solid var(--primary)' : '1.5px solid transparent',
        }}
      >
        EN
      </button>
    </div>
  )
}

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  const NAV_LINKS = [
    { label: t('services'), href: '#services' },
    { label: t('projects'), href: '#projects' },
    { label: t('about'), href: '#about' },
    { label: t('process'), href: '#process' },
    { label: t('contact'), href: '#contact' },
  ]

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const logoSrc = mounted && resolvedTheme === 'dark' ? '/logo-bg.png' : '/logo.png'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 transition-transform group-hover:scale-105">
              <Image
                src={logoSrc}
                alt="OverBrand Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span
              className="text-xl font-black tracking-tight hidden sm:block"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--text)' }}
            >
              Over<span style={{ color: 'var(--primary)' }}>Brand</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-bold uppercase tracking-widest transition-colors hover:opacity-100"
                style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            {isLoggedIn ? (
              <Link href={`/${locale}/dashboard`} className="hidden md:block">
                <button className="btn-outline text-xs px-5 py-2.5 flex items-center gap-2">
                  <LayoutDashboard size={14} />
                  {t('dashboard')}
                </button>
              </Link>
            ) : (
              <Link href={`/${locale}/auth/login`} className="hidden md:block">
                <button className="btn-outline text-xs px-5 py-2.5">
                  {t('login')}
                </button>
              </Link>
            )}
            <a href="#contact" data-magnetic data-magnetic-strength="0.3">
              <button className="btn-primary text-xs px-5 py-2.5 hidden md:flex items-center gap-2">
                {t('quote')}
              </button>
            </a>

            {/* Mobile menu button */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center"
              style={{ background: 'var(--surface)', color: 'var(--text)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-4 pb-6 pt-2 space-y-1"
          style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)' }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 px-4 text-xs font-bold uppercase tracking-widest"
              style={{ color: 'var(--text)', background: 'var(--surface)', letterSpacing: '0.1em' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-2 pt-3">
            <LanguageSwitcher />
            <ThemeToggle />
            {isLoggedIn ? (
              <Link href={`/${locale}/dashboard`} className="flex-1">
                <button
                  className="w-full py-2.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  style={{ background: 'var(--primary-glow)', color: 'var(--primary)', border: '1px solid var(--primary)' }}
                >
                  <LayoutDashboard size={13} />
                  {t('dashboard')}
                </button>
              </Link>
            ) : (
              <Link href={`/${locale}/auth/login`} className="flex-1">
                <button
                  className="w-full py-2.5 text-xs font-bold uppercase tracking-widest"
                  style={{ background: 'var(--surface)', color: 'var(--text)' }}
                >
                  {t('login')}
                </button>
              </Link>
            )}
          </div>
          <a href="#contact">
            <button className="btn-primary w-full text-xs py-3 mt-2">
              {t('quote')}
            </button>
          </a>
        </div>
      )}
    </nav>
  )
}
