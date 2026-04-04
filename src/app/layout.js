import Header from '../components/Header/Header';
import Footer from '../components/footer/Footer';
import Providers from '../components/providers/Providers';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  metadataBase: new URL('https://fronnexus.vercel.app'),
  title: {
    default: 'Fronnexus — Digital Agency',
    template: '%s | Fronnexus',
  },
  description:
    'Fronnexus crafts seamless digital experiences with precision and creativity. Front-end development, web design, data analysis, and QA.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Fronnexus',
    title: 'Fronnexus — Digital Agency',
    description: 'We design, build & scale your digital presence. Front-end development, web design, data analysis, and quality assurance.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fronnexus — Digital Agency',
    description: 'We design, build & scale your digital presence.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="antialiased bg-background text-primary">
        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
