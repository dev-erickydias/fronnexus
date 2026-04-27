/** @type {import('next').NextConfig} */

// ────────────────────────────────────────────────────────────────
// Security Headers — Defense in depth
//
// Strategy:
// 1. CSP locks the document to known origins for every fetch type
// 2. HSTS forces HTTPS (with includeSubDomains + preload eligibility)
// 3. COOP/CORP isolate the browsing context from cross-origin attacks
// 4. Permissions-Policy denies all browser features we don't use
// 5. X-Frame-Options + frame-ancestors block clickjacking
//
// Notes on the trade-offs we accept (and document so the next dev
// knows why):
// - script-src includes 'unsafe-inline' because Next.js bootstraps
//   inline runtime scripts. Strictly correct fix is the middleware
//   nonce pattern; deferred to v3.1 when we have spare cycles
// - style-src allows 'unsafe-inline' for styled-jsx + Tailwind JIT
//   inline style elements. Style-XSS impact is much lower than
//   script-XSS, so we accept this for now
// ────────────────────────────────────────────────────────────────

const ContentSecurityPolicy = [
  "default-src 'self'",
  // Scripts: same-origin + Vercel insights + Vercel speed insights
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live",
  // Styles: same-origin + inline (Next.js requirement) + Google Fonts
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Fonts from Google + data URIs
  "font-src 'self' data: https://fonts.gstatic.com",
  // Images: same-origin + data + blob (form previews) + Unsplash + GitHub
  "img-src 'self' data: blob: https://images.unsplash.com https://avatars.githubusercontent.com https://opengraph.githubassets.com https://raw.githubusercontent.com",
  // XHR/Fetch: same-origin + GitHub + Resend + Supabase + Vercel
  "connect-src 'self' https://api.github.com https://api.resend.com https://*.supabase.co wss://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  // Block all forms of plugin embedding
  "object-src 'none'",
  // Only this site can embed the page in an iframe
  "frame-ancestors 'self'",
  // Form posts only to same-origin (extra CSRF defense)
  "form-action 'self'",
  // Base URL anchored to same-origin
  "base-uri 'self'",
  // Treat all http: requests as https:
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
  // 1 year HSTS, includeSubDomains so fronnexus.org subdomains are
  // also locked, preload eligible (submit at hstspreload.org once
  // the cert is stable for >1 month)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  // Block MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Defense in depth alongside frame-ancestors
  { key: 'X-Frame-Options', value: 'DENY' },
  // Don't leak full URL on cross-origin navigation
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Deny every browser feature we don't actively use; opt in later
  // by changing the empty parens to a list of allowed origins
  {
    key: 'Permissions-Policy',
    value: [
      'accelerometer=()',
      'autoplay=()',
      'browsing-topics=()',
      'camera=()',
      'cross-origin-isolated=()',
      'display-capture=()',
      'document-domain=()',
      'encrypted-media=()',
      'fullscreen=(self)',
      'geolocation=()',
      'gyroscope=()',
      'hid=()',
      'idle-detection=()',
      'interest-cohort=()',
      'magnetometer=()',
      'microphone=()',
      'midi=()',
      'payment=()',
      'picture-in-picture=()',
      'publickey-credentials-get=()',
      'screen-wake-lock=()',
      'serial=()',
      'sync-xhr=()',
      'usb=()',
      'web-share=(self)',
      'xr-spatial-tracking=()',
    ].join(', '),
  },
  // Cross-Origin-Opener-Policy isolates the browsing context so
  // popups/iframes from other origins can't share globals with us
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // Cross-Origin-Resource-Policy prevents other origins from
  // embedding our resources via <img>, <script>, etc.
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  // Speeds up subdomain DNS lookups (used by next/image, fonts)
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Server fingerprint reduction
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
];

const nextConfig = {
  poweredByHeader: false, // strip X-Powered-By: Next.js

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'opengraph.githubassets.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    dangerouslyAllowSVG: false,
  },

  // Apex domain redirect — fronnexus.website → fronnexus.org so SEO
  // doesn't get split between two URLs and clients always land on
  // the canonical brand. 308 = permanent + preserves method/body.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'fronnexus.website',
          },
        ],
        destination: 'https://fronnexus.org/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.fronnexus.website',
          },
        ],
        destination: 'https://fronnexus.org/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.fronnexus.org',
          },
        ],
        destination: 'https://fronnexus.org/:path*',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // Static assets get long-term caching
      {
        source: '/(.*).(woff2|woff|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*).(jpg|jpeg|png|webp|avif|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
