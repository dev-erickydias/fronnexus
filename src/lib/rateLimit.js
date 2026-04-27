// ────────────────────────────────────────────────────────────────
// In-memory token bucket rate limiter.
//
// Notes:
// - Vercel functions can be cold-started across regions, so the
//   limit is per-instance, not global. For an MVP that's fine —
//   an attacker spreading load across ten cold starts to bypass us
//   is a sophistication we don't need to defend against yet
// - When we move to higher traffic / paid tier, swap the Map
//   backing store for Vercel KV or Upstash Redis (`@upstash/ratelimit`)
//   without changing the call sites
// ────────────────────────────────────────────────────────────────

const buckets = new Map();

/**
 * Check whether the given key is allowed to perform an action.
 * @param {string} key  Identifier (e.g. "contact:1.2.3.4")
 * @param {number} max  Max requests per window
 * @param {number} windowMs  Window length in ms
 * @returns {{ ok: boolean, remaining: number, retryAfterSeconds: number }}
 */
export function takeToken(key, max, windowMs) {
  const now = Date.now();
  const bucket = buckets.get(key);

  // Lazy GC — every 1 in 50 calls clean up expired buckets
  if (Math.random() < 0.02) {
    for (const [k, b] of buckets) {
      if (b.resetAt < now) buckets.delete(k);
    }
  }

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, retryAfterSeconds: 0 };
  }

  if (bucket.count >= max) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return {
    ok: true,
    remaining: max - bucket.count,
    retryAfterSeconds: 0,
  };
}

/**
 * Best-effort client IP extraction.
 *
 * Vercel's edge prepends the true edge IP to x-forwarded-for AFTER
 * any client-supplied chain — so we MUST read the TRAILING entry,
 * not the leading one. Naive `split(',')[0]` reads the client's
 * claim, letting attackers rotate fake `X-Forwarded-For: 1.2.3.4`
 * values to bypass per-IP buckets. (QA finding 2026-04, hardening.)
 *
 * Order of preference:
 *   1. x-vercel-forwarded-for / x-real-ip — already cleansed by edge
 *   2. trailing entry of x-forwarded-for chain
 *   3. literal "unknown" (rate-bucketed together — fail-closed)
 */
export function clientIp(req) {
  const headers = req.headers;
  if (!headers || typeof headers.get !== 'function') return 'unknown';

  // Vercel-specific headers — most trusted, set by the edge after
  // stripping any client-supplied X-Forwarded-For values.
  const vercelXff =
    headers.get('x-vercel-forwarded-for') || headers.get('x-real-ip') || '';
  if (vercelXff) {
    const first = vercelXff.split(',')[0]?.trim();
    if (first) return first;
  }

  // Fallback: x-forwarded-for chain. Read TRAILING entry (the closest
  // proxy = the edge), never the leading one (the client's claim).
  const forwarded = headers.get('x-forwarded-for') || '';
  const chain = forwarded
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return chain[chain.length - 1] || 'unknown';
}
