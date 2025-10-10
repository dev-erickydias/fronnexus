// app/layout.js
import Header from '../components/Header/Header';
import Footer from '../components/footer/Footer';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata = {
  title: 'FRONNEXUS - Digital Presence Solutions',
  description: 'We craft seamless web experiences that merge creativity, technology, and strategy.',
  keywords: ['web development', 'digital solutions', 'web design', 'technology'],
  authors: [{ name: 'FRONNEXUS' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'FRONNEXUS',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} font-sans`}>
      <body className="antialiased">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
