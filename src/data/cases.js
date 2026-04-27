// ────────────────────────────────────────────────────────────────
// Curated case studies — each entry maps to /cases/[slug] and is
// also surfaced on the homepage if `featured: true`.
//
// Keep the slugs URL-friendly. Each case is locale-aware: PT and EN
// strings sit side-by-side on the same record (no separate JSON).
// Add new cases by appending objects to this array.
// ────────────────────────────────────────────────────────────────

export const CASES = [
  {
    slug: 'horse-hotel-ams',
    featured: true,
    client: 'Horse Hotel Amsterdam',
    industry: { pt: 'Hospitalidade equestre', en: 'Equestrian hospitality' },
    location: 'Amsterdam, NL',
    year: '2025',
    cover:
      'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=80',
    deliverables: ['web', 'analysis'],
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Vercel'],
    homepage: 'https://horse-hotel-ams.vercel.app',
    repo: 'https://github.com/dev-erickydias/horse-hotel-ams',
    title: {
      pt: 'Sistema completo para um hotel de cavalos em Amsterdam',
      en: 'Full management system for a horse hotel in Amsterdam',
    },
    summary: {
      pt: 'Hotel boutique de cavalos precisava sair de planilha e WhatsApp para uma plataforma com agendamento, controle de hospedagem e dashboard financeiro.',
      en: 'A boutique horse hotel needed to move off spreadsheets and WhatsApp into a platform with booking, lodging control, and a financial dashboard.',
    },
    problem: {
      pt: 'A operação rodava em quatro lugares: WhatsApp para reservas, planilha para hospedagem, papel para alimentação, recibos manuais para pagamento. Erros de overbooking aconteciam toda semana e o dono não conseguia dizer quanto faturou no mês sem somar nota por nota.',
      en: 'Operations ran in four places: WhatsApp for bookings, spreadsheet for lodging, paper for feeding, manual receipts for payment. Overbooking errors happened weekly and the owner couldn\'t tell monthly revenue without adding receipts one by one.',
    },
    approach: {
      pt: 'Discovery de duas semanas mapeando o fluxo real (não o "ideal"). Decidimos manter o WhatsApp como canal de entrada — mas com um link curto para o cliente preencher a reserva direto. Banco em Postgres via Supabase, RLS por dono, dashboard com métricas semanais que o dono quer ver: ocupação, ticket médio, alimentação por cavalo.',
      en: 'Two-week discovery mapping the real flow (not the "ideal" one). We kept WhatsApp as the entry channel — but with a short link for clients to fill in the booking directly. Postgres via Supabase, owner-scoped RLS, weekly dashboard with the metrics that actually matter: occupancy, average ticket, feeding per horse.',
    },
    outcome: [
      {
        metric: '0',
        label: { pt: 'Erros de overbooking em 60 dias', en: 'Overbooking errors in 60 days' },
        tone: 'teal',
      },
      {
        metric: '6h →30min',
        label: { pt: 'Tempo de fechamento mensal', en: 'Monthly close time' },
        tone: 'coral',
      },
      {
        metric: '+22%',
        label: { pt: 'Ticket médio (upsell de alimentação)', en: 'Avg ticket (feeding upsell)' },
        tone: 'bridge',
      },
    ],
    quote: {
      pt: 'Não é só um sistema bonito — eu finalmente sei o que está acontecendo na operação.',
      en: 'It\'s not just a pretty system — I finally know what\'s happening in operations.',
      author: 'Dono — Horse Hotel Amsterdam',
    },
  },
];

export function findCase(slug) {
  return CASES.find((c) => c.slug === slug) || null;
}
