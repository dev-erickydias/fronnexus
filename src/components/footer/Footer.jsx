'use client';
import Link from 'next/link';
import { useI18n } from '../../i18n/I18nContext';

// GitHub é mostrado dentro de /projects (showcase técnico) — não
// como rede social no footer. Aqui ficam só as redes voltadas pra
// cliente final (institucional).
const SOCIAL = [
  {
    name: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/fronnexus',
  },
  {
    name: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/fronnexus',
  },
];

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.projects'), href: '/projects' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const serviceLinks = (t('services.items') || [])
    .filter((i) => typeof i === 'object' && i.title)
    .map((i) => ({ name: i.title, href: '/#services' }));

  return (
    <footer
      className="relative mt-20 border-t"
      style={{ borderColor: 'var(--border-soft)' }}
    >
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" aria-label="Fronnexus — home" className="inline-block">
              <span className="font-display text-2xl font-semibold tracking-tight">
                Fronnexus<span className="text-[var(--teal-500)]">.</span>
              </span>
            </Link>
            <p className="mt-4 text-[var(--mist-300)] text-sm leading-relaxed max-w-sm text-pretty">
              {t('footer.tagline')}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-xs uppercase tracking-[0.22em] px-3 py-1.5 rounded-full border transition-all duration-300"
                  style={{
                    color: 'var(--mist-300)',
                    borderColor: 'var(--border-soft)',
                    background: 'rgba(20, 27, 45, 0.4)',
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[var(--teal-500)] mb-4">
              {t('footer.navTitle')}
            </p>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--mist-200)] hover:text-[var(--teal-500)] transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[var(--coral-500)] mb-4">
              {t('footer.servicesTitle')}
            </p>
            <ul className="space-y-2.5">
              {serviceLinks.map((s) => (
                <li key={s.name}>
                  <Link
                    href={s.href}
                    className="text-sm text-[var(--mist-200)] hover:text-[var(--coral-500)] transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'var(--border-soft)' }}
        >
          <p className="text-xs text-[var(--mist-400)]">
            © {year} Fronnexus. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/terms/use"
              className="text-xs text-[var(--mist-400)] hover:text-[var(--mist-100)] transition-colors"
            >
              {t('footer.terms')}
            </Link>
            <span className="text-xs text-[var(--mist-500)]">·</span>
            <Link
              href="/terms/privacy"
              className="text-xs text-[var(--mist-400)] hover:text-[var(--mist-100)] transition-colors"
            >
              {t('footer.privacy')}
            </Link>
            <span className="text-xs text-[var(--mist-500)]">·</span>
            <Link
              href="/terms/cookies"
              className="text-xs text-[var(--mist-400)] hover:text-[var(--mist-100)] transition-colors"
            >
              Cookies
            </Link>
            <span className="text-xs text-[var(--mist-500)]">·</span>
            <span className="text-xs text-[var(--mist-400)]">
              {t('footer.made')} <span className="text-coral">Brasil</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
