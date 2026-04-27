import { ImageResponse } from '@vercel/og';

// Default OpenGraph image for the root URL. Next 16 conventionally
// reads opengraph-image.{js,png,jpg} and wires it as the default
// og:image for any page that doesn't explicitly set one.
export const runtime = 'edge';
export const alt = 'Fronnexus — Boutique digital';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            right: '-200px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
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
          ◇ Boutique digital
        </div>
        <div
          style={{
            fontSize: '88px',
            fontWeight: 600,
            lineHeight: 0.95,
            letterSpacing: '-0.025em',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '90%',
          }}
        >
          Conectamos código com gente real.
        </div>
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
    { ...size },
  );
}
