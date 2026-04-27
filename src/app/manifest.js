// PWA manifest — installable, theme-aware, app-shell ready.
// Lighthouse PWA score reads from this file via the .well-known
// path Next 16 generates automatically.
export default function manifest() {
  return {
    name: 'Fronnexus — Boutique Digital',
    short_name: 'Fronnexus',
    description:
      'Sites, marketing e consultoria de crescimento — feitos com cuidado.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0e14',
    theme_color: '#0a0e14',
    orientation: 'portrait-primary',
    lang: 'pt-BR',
    dir: 'ltr',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/icon-mask.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['business', 'productivity', 'utilities'],
  };
}
