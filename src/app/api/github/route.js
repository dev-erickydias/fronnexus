// ────────────────────────────────────────────────────────────────
// GET /api/github
// Returns the curated showcase: ALL public repos owned by GITHUB_USER
// that carry the topic GITHUB_TOPIC (default: "fronnexus-showcase").
// Cached for 1h via ISR — no auth required for public repos.
//
// Env vars (all optional):
//   GITHUB_USER       default: "dev-erickydias"
//   GITHUB_TOPIC      default: "fronnexus-showcase"
//   GITHUB_TOKEN      optional — bumps rate limit from 60 to 5000/h
//   GITHUB_FALLBACK   optional — comma-separated repo slugs (owner/name)
//                                rendered when API fails
// ────────────────────────────────────────────────────────────────

const SHOWCASE_USER = process.env.GITHUB_USER || 'dev-erickydias';
const SHOWCASE_TOPIC = process.env.GITHUB_TOPIC || 'fronnexus-showcase';

// Re-validate at the route level so successive requests share the cache.
// Next.js requires this to be a static literal (1 hour = 3600s).
export const revalidate = 3600;
const REVALIDATE_SECONDS = 3600;

function buildHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'fronnexus-showcase',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

function shape(repo) {
  // Normalize to a small, stable shape — never expose the full GitHub
  // payload to the client. This keeps over-the-wire size small and lets
  // us swap providers later (GitLab, Codeberg) without a UI rewrite.
  return {
    id: repo.id,
    slug: repo.full_name,
    name: repo.name,
    description: repo.description || '',
    url: repo.html_url,
    homepage: repo.homepage || null,
    stars: repo.stargazers_count || 0,
    language: repo.language || null,
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    pushed_at: repo.pushed_at,
    updated_at: repo.updated_at,
    owner: {
      login: repo.owner?.login || null,
      avatar: repo.owner?.avatar_url || null,
    },
    // Categorization comes from secondary topics like:
    //   fronnexus-web | fronnexus-marketing | fronnexus-saas
    category: detectCategory(repo.topics || []),
  };
}

function detectCategory(topics) {
  const map = {
    'fronnexus-web': 'web',
    'fronnexus-marketing': 'marketing',
    'fronnexus-saas': 'saas',
    'fronnexus-app': 'web',
  };
  for (const t of topics) {
    if (map[t]) return map[t];
  }
  return 'web';
}

function readFallback() {
  const raw = process.env.GITHUB_FALLBACK || '';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((slug, i) => ({
      id: `fallback-${i}`,
      slug,
      name: slug.split('/')[1] || slug,
      description: '',
      url: `https://github.com/${slug}`,
      homepage: null,
      stars: 0,
      language: null,
      topics: [SHOWCASE_TOPIC],
      pushed_at: null,
      updated_at: null,
      owner: { login: slug.split('/')[0] || null, avatar: null },
      category: 'web',
      _fallback: true,
    }));
}

export async function GET() {
  const url = `https://api.github.com/search/repositories?q=user:${encodeURIComponent(
    SHOWCASE_USER,
  )}+topic:${encodeURIComponent(SHOWCASE_TOPIC)}&sort=updated&order=desc&per_page=30`;

  try {
    const res = await fetch(url, {
      headers: buildHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      const fallback = readFallback();
      if (fallback.length) {
        return Response.json(
          {
            source: 'fallback',
            count: fallback.length,
            items: fallback,
            warning: `GitHub responded ${res.status}`,
          },
          {
            status: 200,
            headers: {
              'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=300`,
            },
          },
        );
      }
      return Response.json(
        { source: 'error', error: `GitHub responded ${res.status}`, items: [] },
        { status: 502 },
      );
    }

    const data = await res.json();
    const items = (data.items || []).map(shape);

    return Response.json(
      {
        source: 'github',
        user: SHOWCASE_USER,
        topic: SHOWCASE_TOPIC,
        count: items.length,
        items,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=300`,
        },
      },
    );
  } catch (err) {
    const fallback = readFallback();
    return Response.json(
      {
        source: fallback.length ? 'fallback' : 'error',
        error: err?.message || 'fetch failed',
        items: fallback,
      },
      { status: fallback.length ? 200 : 502 },
    );
  }
}
