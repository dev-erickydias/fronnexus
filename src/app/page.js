'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import ClientHomeProjectInfo from '../components/client/ClientHomeProjectInfo';
import ClientSegundaCTA from '../components/client/ClientSegundaCTA';
import { useI18n } from '../i18n/I18nContext';

const HeaderBg = dynamic(() => import('../components/Header/HeaderBg'), {
  loading: () => null,
});
const ServicesSection = dynamic(
  () => import('../components/services/ServicesSection'),
  { loading: () => null },
);

export default function Home() {
  const { t } = useI18n();

  return (
    <>
      <Suspense fallback={null}>
        <HeaderBg
          title={t('hero.home.title')}
          highlight={t('hero.home.highlight')}
          subtitle={t('hero.home.subtitle')}
          description={t('hero.home.description')}
          buttonText={t('hero.home.buttonText')}
          buttonLink="/about"
        />
      </Suspense>

      <Suspense fallback={null}>
        <ServicesSection />
      </Suspense>

      <Suspense fallback={null}>
        <ClientSegundaCTA
          title={t('cta.home1.title')}
          subtitle={t('cta.home1.subtitle')}
          buttonText={t('cta.home1.buttonText')}
        />
      </Suspense>

      <ClientHomeProjectInfo />

      <Suspense fallback={null}>
        <ClientSegundaCTA
          title={t('cta.home2.title')}
          subtitle={t('cta.home2.subtitle')}
          buttonText={t('cta.home2.buttonText')}
        />
      </Suspense>
    </>
  );
}
