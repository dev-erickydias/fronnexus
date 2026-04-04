'use client';

import { FiMonitor, FiPenTool, FiDatabase, FiCheckCircle } from 'react-icons/fi';
import ScrollReveal from '../utils/ScrollReveal';
import { useI18n } from '../../i18n/I18nContext';

const SERVICE_ICONS = [
  <FiMonitor size={28} />,
  <FiPenTool size={28} />,
  <FiDatabase size={28} />,
  <FiCheckCircle size={28} />,
];

const SERVICE_KEYS = ['frontEnd', 'webDesign', 'dataAnalysis', 'qa'];

export default function ServicesSection() {
  const { t } = useI18n();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.08)] text-[#a78bfa] mb-4">
              {t('services.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
              {t('services.title')}
            </h2>
            <p className="mt-4 text-primary-70 max-w-2xl mx-auto text-base leading-relaxed">
              {t('services.description')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_KEYS.map((key, index) => (
            <ScrollReveal key={key} delay={index * 100}>
              <div className="glass-card group rounded-2xl p-6 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-[rgba(139,92,246,0.1)] flex items-center justify-center text-[#8b5cf6] mb-4 transition-colors group-hover:bg-[rgba(139,92,246,0.15)]">
                  {SERVICE_ICONS[index]}
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {t(`services.${key}.title`)}
                </h3>
                <p className="text-sm text-primary-70 leading-relaxed flex-1">
                  {t(`services.${key}.description`)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
