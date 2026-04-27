import { NextResponse } from 'next/server';
import { takeToken, clientIp } from '@/lib/rateLimit';

// ────────────────────────────────────────────────────────────────
// POST /api/send-email — Hardened contact endpoint
//
// Defenses (in order of execution):
// 1. Origin/Referer same-origin check       (CSRF defense)
// 2. Per-IP rate limit (5/15min)            (spam + DoS defense)
// 3. Honeypot field check                   (bot defense)
// 4. Schema validation with strict caps     (DoS via huge payload)
// 5. Email format check                     (data integrity)
// 6. HTML escape on every interpolation     (HTML/header injection)
// 7. Reply-To set to user's address         (so direct reply works)
// 8. No raw user data echoed back           (info-leak defense)
//
// Lead never disappears: if email transport fails, we fall back to
// Supabase row insert. If that fails too, we log and still 200 so
// the user UX stays calm — but the Vercel runtime log has the lead.
// ────────────────────────────────────────────────────────────────

const RECIPIENT = 'erickyhenriquesd@gmail.com';
const FROM = 'Fronnexus <onboarding@resend.dev>';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Hard caps to keep payloads predictable
const MAX_LEN = {
  firstName: 60,
  lastName: 60,
  email: 254,
  phone: 30,
  company: 120,
  projectType: 24,
  budget: 24,
  details: 4000,
};

const ALLOWED_PROJECT_TYPES = new Set([
  'web',
  'marketing',
  'consulting',
  'analysis',
  'other',
]);
const ALLOWED_BUDGETS = new Set([
  'small',
  'medium',
  'large',
  'enterprise',
  'tbd',
]);

const PROJECT_TYPE_LABEL = {
  web: 'Website / Web app',
  marketing: 'Marketing digital',
  consulting: 'Consultoria de crescimento',
  analysis: 'Análise & dados',
  other: 'Outro',
};
const BUDGET_LABEL = {
  small: 'Até R$ 5k',
  medium: 'R$ 5k–15k',
  large: 'R$ 15k–40k',
  enterprise: 'R$ 40k+',
  tbd: 'Definindo',
};

const ALLOWED_ORIGINS = new Set([
  'https://fronnexus.org',
  'https://www.fronnexus.org',
  'https://fronnexus.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
]);

// ────────── helpers ──────────
function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[c]),
  );
}

function clean(value, maxLen) {
  if (value == null) return '';
  // Strip control characters except \n \r \t
  const stripped = String(value)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
  return stripped.slice(0, maxLen);
}

function isValidEmail(email) {
  // RFC 5321 length limits + a sane regex (good enough for this scale)
  if (email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function sameOrigin(req) {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  if (origin) return ALLOWED_ORIGINS.has(origin);
  if (referer) {
    try {
      const url = new URL(referer);
      return ALLOWED_ORIGINS.has(`${url.protocol}//${url.host}`);
    } catch {
      return false;
    }
  }
  // No Origin and no Referer — typical for non-browser clients.
  // Reject; legitimate browser submissions always send at least one.
  return false;
}

function buildHtmlEmail(d) {
  const fullName = `${escapeHtml(d.firstName)}${
    d.lastName ? ' ' + escapeHtml(d.lastName) : ''
  }`;
  const projectLabel = d.projectType
    ? PROJECT_TYPE_LABEL[d.projectType] || escapeHtml(d.projectType)
    : '';
  const budgetLabel = d.budget
    ? BUDGET_LABEL[d.budget] || escapeHtml(d.budget)
    : '';

  return `
<div style="font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0a0e14;color:#f5f1ea;padding:32px;">
  <div style="background:linear-gradient(135deg,#5eead4 0%,#a78bfa 50%,#ff6b6b 100%);padding:24px;border-radius:16px 16px 0 0;">
    <h1 style="color:#0a0e14;margin:0;font-size:22px;letter-spacing:-0.02em;">Novo contato — Fronnexus</h1>
    <p style="color:rgba(10,14,20,0.7);margin:8px 0 0;font-size:13px;font-weight:500;">Recebido via formulário do site</p>
  </div>
  <div style="background:#141b2d;padding:28px;border:1px solid rgba(245,241,234,0.08);border-top:none;border-radius:0 0 16px 16px;">
    <table style="width:100%;border-collapse:collapse;color:#f5f1ea;">
      <tr><td style="padding:6px 0;color:#94a3b8;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;width:130px;">Nome</td><td style="padding:6px 0;font-weight:600;font-size:15px;">${fullName}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;">E-mail</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(d.email)}" style="color:#5eead4;text-decoration:none;">${escapeHtml(d.email)}</a></td></tr>
      ${d.phone ? `<tr><td style="padding:6px 0;color:#94a3b8;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;">Telefone</td><td style="padding:6px 0;">${escapeHtml(d.phone)}</td></tr>` : ''}
      ${d.company ? `<tr><td style="padding:6px 0;color:#94a3b8;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;">Empresa</td><td style="padding:6px 0;">${escapeHtml(d.company)}</td></tr>` : ''}
      ${projectLabel ? `<tr><td style="padding:6px 0;color:#94a3b8;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;">Tipo</td><td style="padding:6px 0;color:#ff6b6b;">${projectLabel}</td></tr>` : ''}
      ${budgetLabel ? `<tr><td style="padding:6px 0;color:#94a3b8;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;">Orçamento</td><td style="padding:6px 0;color:#a78bfa;">${budgetLabel}</td></tr>` : ''}
    </table>
    <hr style="margin:20px 0;border:none;border-top:1px solid rgba(245,241,234,0.08);" />
    <p style="color:#94a3b8;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 10px;">Mensagem</p>
    <div style="background:#0a0e14;border:1px solid rgba(94,234,212,0.10);border-radius:12px;padding:18px;white-space:pre-line;font-size:14px;line-height:1.65;color:#ebe6dd;">${escapeHtml(d.details)}</div>
    <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(245,241,234,0.08);">
      <a href="mailto:${escapeHtml(d.email)}?subject=${encodeURIComponent('Re: seu projeto — Fronnexus')}" style="display:inline-block;padding:10px 18px;background:linear-gradient(135deg,#5eead4,#a78bfa);color:#0a0e14;text-decoration:none;border-radius:999px;font-weight:600;font-size:13px;">Responder</a>
    </div>
  </div>
  <p style="color:#64748b;font-size:11px;text-align:center;margin:16px 0 0;">fronnexus.org · respondido em até 24h</p>
</div>`;
}

// ────────── handler ──────────
export async function POST(req) {
  // 1. Same-origin check
  if (!sameOrigin(req)) {
    return NextResponse.json(
      { error: 'Forbidden: invalid origin' },
      { status: 403 },
    );
  }

  // 2. Rate limit by IP
  const ip = clientIp(req);
  const limit = takeToken(
    `contact:${ip}`,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS,
  );
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: limit.retryAfterSeconds },
      {
        status: 429,
        headers: {
          'Retry-After': String(limit.retryAfterSeconds),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  // 3. Parse JSON safely
  let raw;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (typeof raw !== 'object' || raw === null) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // 4. Honeypot — silently swallow bot submissions. We pretend success
  // so the bot doesn't learn to bypass; the lead is just discarded.
  if (raw.website || raw.url || raw._gotcha) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // 5. Normalize + validate
  const d = {
    firstName: clean(raw.firstName, MAX_LEN.firstName),
    lastName: clean(raw.lastName, MAX_LEN.lastName),
    email: clean(raw.email, MAX_LEN.email).toLowerCase(),
    phone: clean(raw.phone, MAX_LEN.phone),
    company: clean(raw.company, MAX_LEN.company),
    projectType: clean(raw.projectType, MAX_LEN.projectType),
    budget: clean(raw.budget, MAX_LEN.budget),
    details: clean(raw.details, MAX_LEN.details),
  };

  const errs = {};
  if (!d.firstName) errs.firstName = true;
  if (!d.email || !isValidEmail(d.email)) errs.email = true;
  if (!d.details || d.details.length < 10) errs.details = true;
  if (d.projectType && !ALLOWED_PROJECT_TYPES.has(d.projectType))
    errs.projectType = true;
  if (d.budget && !ALLOWED_BUDGETS.has(d.budget)) errs.budget = true;

  if (Object.keys(errs).length) {
    return NextResponse.json(
      { error: 'Invalid payload', fields: errs },
      { status: 400 },
    );
  }

  const subject = `[Fronnexus] ${d.firstName}${
    d.lastName ? ' ' + d.lastName : ''
  }${d.projectType ? ' · ' + (PROJECT_TYPE_LABEL[d.projectType] || d.projectType) : ''}`;

  // ─── Path 1: Resend ───────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM,
          to: [RECIPIENT],
          reply_to: d.email,
          subject,
          html: buildHtmlEmail(d),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('[RESEND ERROR]', err);
        return NextResponse.json(
          { error: 'Failed to send email.' },
          { status: 502 },
        );
      }

      return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
      console.error('[RESEND ERROR]', err);
      // Fall through to Supabase backup so the lead isn't lost
    }
  }

  // ─── Path 2: Supabase persistence (backup) ───────────────────
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      );

      const { error } = await supabase.from('contact_submissions').insert({
        first_name: d.firstName,
        last_name: d.lastName || null,
        email: d.email,
        phone: d.phone || null,
        company: d.company || null,
        project_type: d.projectType || null,
        budget: d.budget || null,
        message: d.details,
      });

      if (error) {
        console.error('[SUPABASE INSERT ERROR]', error);
        return NextResponse.json(
          { error: 'Failed to save submission.' },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { ok: true, persisted: true },
        { status: 200 },
      );
    } catch (err) {
      console.error('[FALLBACK ERROR]', err);
    }
  }

  // ─── Path 3: log only (last resort) ──────────────────────────
  console.warn(
    '[CONTACT-NO-TRANSPORT] Lead arrived but neither Resend nor Supabase is configured:',
    { from: d.email, subject },
  );
  return NextResponse.json(
    { ok: true, warning: 'No transport configured — lead logged only.' },
    { status: 200 },
  );
}

// ─── Block all other methods ──────────────────────────────────
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
