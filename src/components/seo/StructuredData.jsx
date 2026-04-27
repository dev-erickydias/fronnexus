// ────────────────────────────────────────────────────────────────
// JSON-LD structured data — emitted as a server <script> tag in
// <head>. Renders three schema graphs:
//   - Organization     (the entity)
//   - WebSite          (search-action ready, sitelinks-friendly)
//   - ProfessionalService  (Google's chosen schema for boutique
//                           agencies — better than generic Organization)
//
// Why this matters for SEO + Lighthouse:
//   - Lighthouse SEO score reads og + twitter + structured data
//   - Google rich results trigger off ProfessionalService.aggregateRating
//     (we don't have ratings yet — when first review comes in, add)
//   - Sitelinks search box needs the WebSite + SearchAction graph
// ────────────────────────────────────────────────────────────────

const SITE_URL = 'https://fronnexus.org';
const SITE_NAME = 'Fronnexus';
const FOUNDER = 'Ericky Dias';

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${SITE_URL}#organization`,
  name: SITE_NAME,
  alternateName: 'Fronnexus Boutique Digital',
  url: SITE_URL,
  logo: `${SITE_URL}/icons/logo-512.png`,
  founder: { '@type': 'Person', name: FOUNDER },
  sameAs: [
    'https://www.linkedin.com/company/fronnexus',
    'https://www.instagram.com/fronnexus',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      email: 'contato@fronnexus.org',
      contactType: 'sales',
      areaServed: ['BR', 'PT', 'NL', 'US'],
      availableLanguage: ['Portuguese', 'English'],
    },
  ],
};

const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description:
    'Boutique digital — desenvolvimento web, marketing digital e consultoria de crescimento.',
  publisher: { '@id': `${SITE_URL}#organization` },
  inLanguage: ['pt-BR', 'en'],
};

const SERVICE = {
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}#service`,
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/icons/logo-512.png`,
  description:
    'Sites, web apps, marketing digital, consultoria de crescimento e análise de dados para PMEs e profissionais.',
  priceRange: 'R$$',
  areaServed: ['BR', 'PT', 'NL'],
  serviceType: [
    'Web Development',
    'Digital Marketing',
    'Growth Consulting',
    'Data Analytics',
  ],
  provider: { '@id': `${SITE_URL}#organization` },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Desenvolvimento web',
          description:
            'Sites institucionais, landings e web apps em Next.js / React / Tailwind.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Marketing digital',
          description:
            'Estratégia de presença online focada no funil real de aquisição → receita.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Consultoria de crescimento',
          description:
            'Diagnóstico estratégico e roadmap de crescimento para PMEs.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Análise & dados',
          description:
            'Setup de analytics, dashboards customizados e leitura honesta dos dados.',
        },
      },
    ],
  },
};

export default function StructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [ORGANIZATION, WEBSITE, SERVICE],
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify is safe — Schema.org only consumes JSON-LD,
      // and we generate the entire object server-side from constants.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
