import { findCase } from '../../../data/cases';

// generateMetadata — server-side per case so each /cases/<slug> URL
// gets unique <title>, OG image, and description for social previews.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = findCase(slug);
  if (!item) {
    return { title: 'Case not found' };
  }

  const title = item.title?.pt || item.title?.en || item.client;
  const summary = item.summary?.pt || item.summary?.en || '';

  return {
    title,
    description: summary.slice(0, 160),
    alternates: { canonical: `/cases/${item.slug}` },
    openGraph: {
      title: `${title} — Fronnexus`,
      description: summary.slice(0, 200),
      images: item.cover ? [{ url: item.cover, width: 1600, height: 1067 }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — Fronnexus`,
      description: summary.slice(0, 160),
    },
  };
}

export default function CaseLayout({ children }) {
  return children;
}
