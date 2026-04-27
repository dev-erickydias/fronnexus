'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import MobileMenu from '../modals/MobileMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from '../../i18n/I18nContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = useMemo(
    () => [
      { name: t('nav.home'), href: '/' },
      { name: t('nav.about'), href: '/about' },
      { name: t('nav.services'), href: '/#services' },
      { name: t('nav.projects'), href: '/projects' },
      { name: t('nav.contact'), href: '/contact', isCta: true },
    ],
    [t],
  );

  const links = navItems.filter((i) => !i.isCta);
  const cta = navItems.find((i) => i.isCta);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false; // anchor links never light up
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full"
      style={{ pointerEvents: 'none' }}
    >
      <nav
        role="navigation"
        aria-label="Primary"
        className="mx-auto max-w-5xl"
        style={{ pointerEvents: 'auto' }}
      >
        <div
          className={`relative flex items-center gap-3 px-4 sm:px-6 py-2.5 rounded-2xl transition-all duration-300 ${
            scrolled
              ? 'border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
              : 'border border-transparent bg-transparent'
          }`}
        >
          {/* Brand wordmark — pure type, no SVG dependency */}
          <Link
            href="/"
            className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal-500)] rounded-lg px-1"
            aria-label="Fronnexus — home"
          >
            <span className="font-display text-[19px] font-semibold tracking-tight text-[var(--mist-50)]">
              Fronnexus<span className="text-[var(--teal-500)]">.</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1 ml-auto">
            {links.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    active
                      ? 'text-[var(--teal-500)] font-medium'
                      : 'text-[var(--mist-200)] hover:text-[var(--mist-50)]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.name}
                  {active && (
                    <span className="absolute bottom-1 left-3 right-3 h-px bg-[var(--teal-500)]" />
                  )}
                </Link>
              );
            })}

            <LanguageSwitcher />

            {cta && (
              <Link
                href={cta.href}
                className="ml-3 inline-flex items-center text-sm font-medium px-5 py-2 rounded-full text-[var(--night-950)] transition-all duration-300"
                style={{
                  background: 'var(--gradient-bridge)',
                  boxShadow: '0 6px 20px rgba(94,234,212,0.25)',
                }}
              >
                {cta.name}
              </Link>
            )}
          </div>

          {/* Mobile language + toggle */}
          <div className="lg:hidden ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              className="p-2 rounded-xl text-[var(--mist-50)] hover:bg-[var(--surface)] transition-colors"
              onClick={() => setMobileMenuOpen((p) => !p)}
              aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <IoCloseOutline size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
      />
    </header>
  );
}
