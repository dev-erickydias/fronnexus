import { Geist, Geist_Mono, Fraunces } from 'next/font/google';
import Header from '../components/Header/Header';
import Footer from '../components/footer/Footer';
import Providers from '../components/providers/Providers';
import './globals.css';

// ────────────────────────────────────────────────────────────────
// Fonts — Geist family (Vercel) + Fraunces variable for accents.
// All loaded with display:swap so first paint never stalls.
// ────────────────────────────────────────────────────────────────
const geist = Geist({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display',
});
const geistBody = Geist({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
});
const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});
const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-accent',
});

const SITE_URL = 'https://fronnexus.vercel.app';
const SITE_NAME = 'Fronnexus';
const SITE_DESCRIPTION =
  'Boutique digital — desenvolvimento web, marketing digital e consultoria de crescimento para empresas e profissionais que querem se expandir online.';
const SITE_DESCRIPTION_EN =
  'Boutique digital studio — web development, digital marketing, and growth consulting for businesses and individuals ready to scale online.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Boutique Digital`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'desenvolvimento web',
    'marketing digital',
    'consultoria de crescimento',
    'next.js',
    'agência digital',
    'web development Brazil',
    'boutique digital',
    'fronnexus',
  ],
  authors: [{ name: 'Ericky Dias', url: 'https://github.com/dev-erickydias' }],
  creator: 'Ericky Dias',
  publisher: 'Fronnexus',
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/',
      en: '/?lang=en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    alternateLocale: ['en_US'],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Boutique Digital`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Boutique Digital`,
    description: SITE_DESCRIPTION_EN,
    creator: '@dev_erickydias',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  themeColor: '#0a0e14',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geist.variable} ${geistBody.variable} ${geistMono.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased">
        <a href="#main" className="skip-nav">Pular para o conteúdo</a>
        <Providers>
          <Header />
          <main id="main" className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
