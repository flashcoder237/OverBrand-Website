'use client'

import { Fragment, useState, useEffect } from 'react'
import { LayoutDashboard, X, Menu, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const NAV_LINKS = [
    { label: t('services'), href: '/services' },
    { label: t('projects'), href: '/projets' },
    { label: t('about'),    href: '/a-propos' },
    { label: t('process'),  href: '/processus' },
    { label: t('insights'), href: '/insights' },
    { label: t('contact'),  href: '/contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* ── Editorial navbar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 lg:pl-16"
        style={{
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
        }}
      >
        <div className="px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Wordmark */}
            <Link href="/" className="flex items-center group">
              <span
                className="font-display text-2xl md:text-3xl uppercase tracking-tight leading-none"
                style={{ color: 'var(--text)' }}
              >
                OverBrand<span style={{ color: 'var(--accent-warm)' }}>.</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-300"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-warm)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="btn-ghost"
                >
                  <LayoutDashboard size={14} />
                  {t('dashboard')}
                </Link>
              ) : (
                <Link href="/auth/login" className="btn-ghost">
                  {t('login')}
                </Link>
              )}
              <Link
                href="/contact"
                className="btn-ink"
                data-magnetic
                data-magnetic-strength="0.3"
              >
                {t('quote')}
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Mobile */}
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

      {/* ── Full-screen overlay menu (mobile) ── */}
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
            <div className="relative flex items-center justify-between px-6 sm:px-10 py-5 flex-shrink-0">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                <span
                  className="font-display text-2xl uppercase tracking-tight leading-none"
                  style={{ color: 'var(--text)' }}
                >
                  OverBrand<span style={{ color: 'var(--accent-warm)' }}>.</span>
                </span>
              </Link>
              <button
                className="w-11 h-11 flex items-center justify-center transition-opacity hover:opacity-60"
                style={{
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                }}
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-shrink-0 mx-6 sm:mx-10" style={{ height: '1px', background: 'var(--line)' }} />

            <nav className="flex-1 flex flex-col justify-center px-6 sm:px-10 gap-1 overflow-hidden">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    className="block font-display leading-none"
                    style={{
                      fontSize: 'clamp(2.6rem, 8vw, 6rem)',
                      color: 'var(--text)',
                      paddingBlock: '0.15em',
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span
                      className="text-sm mr-3 align-middle font-sans"
                      style={{ color: 'var(--text-subtle)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="flex-shrink-0 mx-6 sm:mx-10" style={{ height: '1px', background: 'var(--line)' }} />

            <div className="relative flex-shrink-0 flex items-center justify-between px-6 sm:px-10 py-6">
              <div className="space-y-1">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>contact@overbrand.net</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>+237 652 761 931</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
                  {routing.locales.map((l, i) => (
                    <Fragment key={l}>
                      {i > 0 && <span style={{ color: 'var(--border)' }}>|</span>}
                      <Link
                        href={pathname}
                        locale={l}
                        onClick={() => setMenuOpen(false)}
                        className="px-2 py-1 transition-opacity"
                        style={{
                          color: locale === l ? 'var(--accent-warm)' : 'var(--text-subtle)',
                          borderBottom:
                            locale === l
                              ? '1.5px solid var(--accent-warm)'
                              : '1.5px solid transparent',
                        }}
                      >
                        {l.toUpperCase()}
                      </Link>
                    </Fragment>
                  ))}
                </div>
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="btn-ghost text-xs"
                  >
                    <LayoutDashboard size={13} />
                    {t('dashboard')}
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="btn-ghost text-xs"
                  >
                    {t('login')}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
