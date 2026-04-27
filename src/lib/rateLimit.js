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
 * Best-effort client IP extraction. Vercel's edge sets x-forwarded-for
 * and x-real-ip; we trust them only because we know we're behind
 * Vercel's edge proxy. Don't trust these on a self-hosted setup
 * without verifying the connecting IP first.
 */
export function clientIp(req) {
  const forwarded =
    req.headers.get?.('x-forwarded-for') ||
    req.headers.get?.('x-real-ip') ||
    '';
  const first = forwarded.split(',')[0]?.trim();
  return first || 'unknown';
}
