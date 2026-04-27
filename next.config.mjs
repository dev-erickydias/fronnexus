/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization — Unsplash for stock + GitHub avatars for author
  // attribution on the showcase grid (we resolve repo.owner.avatar_url).
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'opengraph.githubassets.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'i.pinimg.com' }, // legacy: kept for old refs
    ],
    formats: ['image/avif', 'image/webp'],
  },
  poweredByHeader: false,

  // Security headers — kept from v2 baseline. CSP is intentionally absent
  // here because we ship it via vercel.json (so it can carry connect-src
  // hosts that next/config can't easily template).
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()',
          },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
};

export default nextConfig;
