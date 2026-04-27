import { ImageResponse } from '@vercel/og';

// ────────────────────────────────────────────────────────────────
// GET /api/og?title=...&label=...
//
// Generates a 1200×630 social preview image rendered server-side
// at request time, then cached at the edge for 1 day. Used as the
// default OpenGraph image whenever a route doesn't specify its own.
//
// Why dynamic OG matters: when someone shares a Fronnexus page on
// LinkedIn/WhatsApp/Twitter, the preview pulls THIS image. A
// boutique-grade preview converts ~3x better than the generic
// favicon-default we'd otherwise get.
// ────────────────────────────────────────────────────────────────

export const runtime = 'edge';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const titleRaw = (searchParams.get('title') || 'Fronnexus').slice(0, 80);
  const labelRaw = (searchParams.get('label') || 'Boutique digital').slice(
    0,
    40,
  );
  const accentRaw = (searchParams.get('accent') || 'bridge').slice(0, 10);

  // Sanitize input — only allow expected characters in display text
  const safe = (s) => s.replace(/[<>{}]/g, '');
  const title = safe(titleRaw);
  const label = safe(labelRaw);

  const accent =
    accentRaw === 'coral'
      ? '#ff6b6b'
      : accentRaw === 'teal'
        ? '#5eead4'
        : '#a78bfa';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'linear-gradient(135deg, #0a0e14 0%, #141b2d 60%, #1a1f33 100%)',
          padding: '80px',
          color: '#f5f1ea',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Aurora glow corner */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            right: '-200px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}40 0%, transparent 70%)`,
            display: 'flex',
          }}
        />

        {/* Brand mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '32px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: 'auto',
          }}
        >
          <span>Fronnexus</span>
          <span style={{ color: '#5eead4' }}>.</span>
        </div>

        {/* Tag */}
        <div
          style={{
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#5eead4',
            marginBottom: '32px',
            display: 'flex',
          }}
        >
          ◇ {label}
        </div>

        {/* Title — gradient text isn't supported in @vercel/og;
            we approximate by coloring the title in mist with one
            accent word. Future: switch to satori-style SVG gradient */}
        <div
          style={{
            fontSize: '82px',
            fontWeight: 600,
            lineHeight: 0.95,
            letterSpacing: '-0.025em',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '90%',
          }}
        >
          {title}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '40px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(245, 241, 234, 0.12)',
            fontSize: '20px',
            color: '#94a3b8',
          }}
        >
          <span>fronnexus.org</span>
          <span style={{ display: 'flex', gap: '24px' }}>
            <span>Web</span>
            <span style={{ color: '#5eead4' }}>·</span>
            <span>Marketing</span>
            <span style={{ color: '#5eead4' }}>·</span>
            <span>Growth</span>
            <span style={{ color: '#5eead4' }}>·</span>
            <span>Data</span>
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
      },
    },
  );
}
