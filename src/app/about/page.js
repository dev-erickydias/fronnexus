'use client';

import { Suspense } from 'react';
import Main from '../../components/about/Main';
import Skills from '../../components/about/Skills';
import HeaderBg from '../../components/Header/HeaderBg';
import SegundaCTA from '../../components/cta/segundacta/SegundaCTA';
import { useI18n } from '../../i18n/I18nContext';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <section className="bg-background text-primary">
      <Suspense fallback={null}>
        <HeaderBg
          title={t('hero.about.title')}
          highlight={t('hero.about.highlight')}
          subtitle={t('hero.about.subtitle')}
          description={t('hero.about.description')}
          buttonText={t('hero.about.buttonText')}
          buttonLink="/projects"
        />
      </Suspense>

      <Skills />

      <Main />

      <SegundaCTA
        title={t('cta.about.title')}
        subtitle={t('cta.about.subtitle')}
        buttonText={t('cta.about.buttonText')}
      />
    </section>
  );
}
