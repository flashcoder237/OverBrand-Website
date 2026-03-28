'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { ColorPicker } from '@/components/theme/color-picker'

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'À propos', href: '#about' },
  { label: 'Processus', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: 'var(--primary)' }}
            >
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span style={{ color: 'var(--text)' }}>Over</span>
              <span className="text-gradient">Brand</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: 'var(--text-muted)' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <ColorPicker />
              <ThemeToggle />
            </div>
            <Link href="/auth/login">
              <button
                className="hidden md:block text-sm font-medium px-4 py-2 rounded-full transition-all hover:opacity-80"
                style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              >
                Connexion
              </button>
            </Link>
            <Link href="#contact">
              <button className="btn-primary text-sm px-5 py-2.5 rounded-full hidden md:block" style={{}}>
                Devis gratuit
              </button>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl"
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
          className="md:hidden px-4 pb-4 pt-2 space-y-2"
          style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(20px)' }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2.5 px-4 rounded-xl text-sm font-medium"
              style={{ color: 'var(--text)', background: 'var(--surface)' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <ColorPicker />
            <ThemeToggle />
            <Link href="/auth/login" className="flex-1">
              <button
                className="w-full py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'var(--surface)', color: 'var(--text)' }}
              >
                Connexion
              </button>
            </Link>
          </div>
          <a href="#contact">
            <button className="btn-primary w-full text-sm py-3 rounded-xl">
              Devis gratuit
            </button>
          </a>
        </div>
      )}
    </nav>
  )
}
