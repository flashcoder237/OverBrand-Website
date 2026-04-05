'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { LayoutDashboard, X, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { useTheme } from 'next-themes'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  const NAV_LINKS = [
    { label: t('services'), href: '#services' },
    { label: t('projects'), href: '#projects' },
    { label: t('about'),    href: '#about' },
    { label: t('process'),  href: '#process' },
    { label: t('contact'),  href: '#contact' },
  ]

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const logoSrc = mounted && resolvedTheme === 'dark' ? '/logo-bg.png' : '/logo.png'

  return (
    <>
      {/* ── Navbar bar ── */}
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
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 transition-transform group-hover:scale-105">
                <Image src={logoSrc} alt="OverBrand Logo" fill className="object-contain" priority />
              </div>
              <span
                className="text-xl font-black tracking-tight hidden sm:block"
                style={{ fontFamily: 'var(--font-sans)', color: 'var(--text)' }}
              >
                Over<span style={{ color: 'var(--primary)' }}>Brand</span>
              </span>
            </Link>

            {/* Desktop nav links (md+) */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-60"
                  style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop actions (md+) */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <button className="btn-outline text-xs px-5 py-2.5 flex items-center gap-2">
                    <LayoutDashboard size={14} />
                    {t('dashboard')}
                  </button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <button className="btn-outline text-xs px-5 py-2.5">
                    {t('login')}
                  </button>
                </Link>
              )}
              <a href="#contact" data-magnetic data-magnetic-strength="0.3">
                <button className="btn-primary text-xs px-5 py-2.5">
                  {t('quote')}
                </button>
              </a>
            </div>

            {/* Mobile: theme toggle + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <button
                className="w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-60"
                style={{ color: 'var(--text)' }}
                onClick={() => setMenuOpen(true)}
                aria-label="Ouvrir le menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Full-screen overlay menu (mobile only) ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[9998] flex flex-col md:hidden"
            style={{ background: 'var(--bg)' }}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Grain texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: '180px 180px',
              }}
            />

            {/* Top bar */}
            <div className="relative flex items-center justify-between px-6 sm:px-10 py-5 flex-shrink-0">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                <span
                  className="text-xl font-black tracking-tight"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--text)' }}
                >
                  Over<span style={{ color: 'var(--primary)' }}>Brand</span>
                </span>
              </Link>
              <button
                className="w-11 h-11 flex items-center justify-center transition-opacity hover:opacity-60"
                style={{
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                }}
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-shrink-0 mx-6 sm:mx-10" style={{ height: '1px', background: 'var(--border)' }} />

            {/* Nav links */}
            <nav className="flex-1 flex flex-col justify-center px-6 sm:px-10 gap-1 overflow-hidden">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="block font-display leading-none group relative overflow-hidden"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.8rem, 8vw, 7rem)',
                    color: 'var(--text)',
                    paddingBlock: '0.15em',
                  }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setMenuOpen(false)}
                  whileHover={{ x: 16, color: 'var(--primary)' }}
                >
                  <span
                    className="text-sm font-sans mr-3 align-middle"
                    style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-sans)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="flex-shrink-0 mx-6 sm:mx-10" style={{ height: '1px', background: 'var(--border)' }} />

            {/* Bottom bar */}
            <div className="relative flex-shrink-0 flex items-center justify-between px-6 sm:px-10 py-6">
              <div className="space-y-0.5">
                <motion.p
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.55 }}
                >
                  contact@overbrand.net
                </motion.p>
                <motion.p
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.62 }}
                >
                  +237 652 761 931
                </motion.p>
              </div>
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                {/* Language switcher in mobile overlay */}
                <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
                  <Link
                    href={pathname}
                    locale="fr"
                    onClick={() => setMenuOpen(false)}
                    className="px-2 py-1 transition-opacity"
                    style={{
                      color: locale === 'fr' ? 'var(--primary)' : 'var(--text-subtle)',
                      opacity: locale === 'fr' ? 1 : 0.5,
                      borderBottom: locale === 'fr' ? '1.5px solid var(--primary)' : '1.5px solid transparent',
                    }}
                  >
                    FR
                  </Link>
                  <span style={{ color: 'var(--border)' }}>|</span>
                  <Link
                    href={pathname}
                    locale="en"
                    onClick={() => setMenuOpen(false)}
                    className="px-2 py-1 transition-opacity"
                    style={{
                      color: locale === 'en' ? 'var(--primary)' : 'var(--text-subtle)',
                      opacity: locale === 'en' ? 1 : 0.5,
                      borderBottom: locale === 'en' ? '1.5px solid var(--primary)' : '1.5px solid transparent',
                    }}
                  >
                    EN
                  </Link>
                </div>
                {isLoggedIn ? (
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                    <button className="btn-outline text-xs px-4 py-2 flex items-center gap-1.5">
                      <LayoutDashboard size={13} />
                      {t('dashboard')}
                    </button>
                  </Link>
                ) : (
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                    <button className="btn-outline text-xs px-4 py-2">
                      {t('login')}
                    </button>
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
