'use client';
import dynamic from 'next/dynamic';
import Hero from '../components/hero/Hero';

// Below-the-fold sections lazy-loaded — keeps the hero LCP fast
// and defers Three.js + heavy components until needed.
const ServicesSection = dynamic(
  () => import('../components/services/ServicesSection'),
  { loading: () => null },
);
const ShowcaseSection = dynamic(
  () => import('../components/projects/ShowcaseSection'),
  { loading: () => null },
);
const ProcessSection = dynamic(
  () => import('../components/process/ProcessSection'),
  { loading: () => null },
);
const CtaPrimary = dynamic(() => import('../components/cta/CtaPrimary'), {
  loading: () => null,
});
const CtaSecondary = dynamic(() => import('../components/cta/CtaSecondary'), {
  loading: () => null,
});

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <CtaPrimary />
      <ShowcaseSection />
      <ProcessSection />
      <CtaSecondary />
    </>
  );
}
