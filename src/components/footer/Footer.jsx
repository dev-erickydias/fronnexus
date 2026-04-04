'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '../../i18n/I18nContext';

function usePrefersDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDark(e.matches);
    setIsDark(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', handleChange);
    else mq.addListener(handleChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handleChange);
      else mq.removeListener(handleChange);
    };
  }, []);
  return isDark;
}

function iconPath(name, isDark) {
  return `/assets/icons/${name}${isDark ? 'Dark' : ''}.svg`;
}

const SOCIAL = [
  { name: 'github', label: 'GitHub', href: 'https://github.com/Fronnexu' },
  { name: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/fronnexus' },
  { name: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/fronnexus' },
];

export default function Footer() {
  const isDark = usePrefersDark();
  const { t } = useI18n();

  const footerLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.aboutUs'), href: '/about' },
    { name: t('nav.projects'), href: '/projects' },
    { name: t('nav.getInTouch'), href: '/contact' },
  ];

  return (
    <footer className="border-t border-[var(--stroke-container-divider)] bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Brand */}
          <div>
            <Image
              src="/assets/icons/logo.svg"
              alt="Fronnexus Logo"
              width={130}
              height={36}
              className="h-auto w-auto mb-4"
              priority
            />
            <p className="text-sm text-primary-70 max-w-xs leading-relaxed">
              {t('footer.brand')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-primary-70 mb-4 font-semibold">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary hover:text-[#8b5cf6] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-primary-70 mb-4 font-semibold">
              {t('footer.connectWithUs')}
            </h4>
            <div className="flex flex-wrap gap-3">
              {SOCIAL.map((s) => (
                <Link
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg border border-[var(--stroke-container-divider)] bg-[var(--surface-subtle)] flex items-center justify-center hover:border-[rgba(139,92,246,0.3)] hover:bg-[rgba(139,92,246,0.05)] transition-all"
                >
                  <Image
                    src={iconPath(s.name, isDark)}
                    alt={s.label}
                    width={18}
                    height={18}
                    className="size-[18px]"
                  />
                </Link>
              ))}
            </div>
            <p className="text-xs text-primary-70 mt-4 leading-relaxed">
              {t('footer.followUs')}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--stroke-container-divider)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary-70">
            &copy; {new Date().getFullYear()} Fronnexus. {t('footer.rights')}
          </p>
          <Link
            href="/terms/responsability"
            className="text-xs text-primary-70 hover:text-[#8b5cf6] transition-colors"
          >
            {t('footer.termsLink')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
