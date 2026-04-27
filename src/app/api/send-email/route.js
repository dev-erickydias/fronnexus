import { NextResponse } from 'next/server';

// ────────────────────────────────────────────────────────────────
// POST /api/send-email
// Receives the v3 ContactForm payload and either delivers via Resend
// (preferred) or falls back to a Supabase row insert.
//
// Recipient is hardcoded to the founder's Gmail — no MX setup needed
// at MVP stage. When you upgrade to Workspace later, swap RECIPIENT
// for an env var without touching the form.
//
// Env vars (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY              — preferred path (3000 free emails/mo)
//   NEXT_PUBLIC_SUPABASE_URL    — fallback persistence
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
// ────────────────────────────────────────────────────────────────

const RECIPIENT = 'erickyhenriquesd@gmail.com';
const FROM = 'Fronnexus <onboarding@resend.dev>';

function isEmpty(v) {
  return !v || String(v).trim() === '';
}

function validate(b) {
  const errs = {};
  if (isEmpty(b.firstName)) errs.firstName = true;
  if (isEmpty(b.email) || !/\S+@\S+\.\S+/.test(b.email || '')) errs.email = true;
  if (isEmpty(b.details) || (b.details || '').trim().length < 10)
    errs.details = true;
  // lastName, phone, company, projectType, budget are all optional in v3
  return errs;
}

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

function buildHtml(d) {
  const safe = (s) => String(s || '').replace(/[<>&]/g, (c) =>
    c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&amp;'
  );
  const fullName = `${safe(d.firstName)} ${safe(d.lastName) || ''}`.trim();

  return `
  <div style="font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e14; color: #f5f1ea; padding: 32px;">
    <div style="background: linear-gradient(135deg, #5eead4 0%, #a78bfa 50%, #ff6b6b 100%); padding: 24px; border-radius: 16px 16px 0 0;">
      <h1 style="color: #0a0e14; margin: 0; font-size: 22px; letter-spacing: -0.02em;">Novo contato — Fronnexus</h1>
      <p style="color: rgba(10,14,20,0.7); margin: 8px 0 0; font-size: 13px; font-weight: 500;">
        Recebido via formulário do site
      </p>
    </div>

    <div style="background: #141b2d; padding: 28px; border: 1px solid rgba(245,241,234,0.08); border-top: none; border-radius: 0 0 16px 16px;">
      <table style="width: 100%; border-collapse: collapse; color: #f5f1ea;">
        <tr><td style="padding: 6px 0; color: #94a3b8; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; width: 130px;">Nome</td><td style="padding: 6px 0; font-weight: 600; font-size: 15px;">${fullName || '—'}</td></tr>
        <tr><td style="padding: 6px 0; color: #94a3b8; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;">E-mail</td><td style="padding: 6px 0;"><a href="mailto:${safe(d.email)}" style="color: #5eead4; text-decoration: none;">${safe(d.email)}</a></td></tr>
        ${d.phone ? `<tr><td style="padding: 6px 0; color: #94a3b8; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;">Telefone</td><td style="padding: 6px 0;"><a href="tel:${safe(d.phone)}" style="color: #5eead4; text-decoration: none;">${safe(d.phone)}</a></td></tr>` : ''}
        ${d.company ? `<tr><td style="padding: 6px 0; color: #94a3b8; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;">Empresa</td><td style="padding: 6px 0;">${safe(d.company)}</td></tr>` : ''}
        ${d.projectType ? `<tr><td style="padding: 6px 0; color: #94a3b8; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;">Tipo</td><td style="padding: 6px 0; color: #ff6b6b;">${PROJECT_TYPE_LABEL[d.projectType] || safe(d.projectType)}</td></tr>` : ''}
        ${d.budget ? `<tr><td style="padding: 6px 0; color: #94a3b8; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;">Orçamento</td><td style="padding: 6px 0; color: #a78bfa;">${BUDGET_LABEL[d.budget] || safe(d.budget)}</td></tr>` : ''}
      </table>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid rgba(245,241,234,0.08);" />

      <p style="color: #94a3b8; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 10px;">Mensagem</p>
      <div style="background: #0a0e14; border: 1px solid rgba(94,234,212,0.10); border-radius: 12px; padding: 18px; white-space: pre-line; font-size: 14px; line-height: 1.65; color: #ebe6dd;">${safe(d.details)}</div>

      <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(245,241,234,0.08); display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="mailto:${safe(d.email)}?subject=Re:%20seu%20projeto%20%E2%80%94%20Fronnexus" style="display: inline-block; padding: 10px 18px; background: linear-gradient(135deg, #5eead4, #a78bfa); color: #0a0e14; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 13px;">Responder</a>
        ${d.phone ? `<a href="https://wa.me/${String(d.phone).replace(/\D/g, '')}" style="display: inline-block; padding: 10px 18px; background: rgba(94,234,212,0.10); color: #5eead4; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 13px; border: 1px solid rgba(94,234,212,0.30);">WhatsApp</a>` : ''}
      </div>
    </div>

    <p style="color: #64748b; font-size: 11px; text-align: center; margin: 16px 0 0;">
      fronnexus.org · respondido em até 24h
    </p>
  </div>`;
}

export async function POST(req) {
  let formData;
  try {
    formData = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const errs = validate(formData);
  if (Object.keys(errs).length) {
    return NextResponse.json(
      { error: 'Invalid payload', fields: errs },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const subject = `[Fronnexus] ${formData.firstName}${formData.lastName ? ' ' + formData.lastName : ''}${formData.projectType ? ' · ' + (PROJECT_TYPE_LABEL[formData.projectType] || formData.projectType) : ''}`;

  // ─── Preferred path: Resend ────────────────────────────────────
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
          reply_to: formData.email,
          subject,
          html: buildHtml(formData),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('[RESEND ERROR]', err);
        return NextResponse.json(
          { error: 'Failed to send email.' },
          { status: 500 },
        );
      }

      return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
      console.error('[RESEND ERROR]', err);
      return NextResponse.json(
        { error: 'Failed to send email.' },
        { status: 500 },
      );
    }
  }

  // ─── Fallback: persist to Supabase ────────────────────────────
  // Useful while Resend isn't configured yet — the lead doesn't get
  // dropped on the floor; you read it from the Supabase dashboard.
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
        first_name: formData.firstName,
        last_name: formData.lastName || null,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        project_type: formData.projectType || null,
        budget: formData.budget || null,
        message: formData.details,
      });

      if (error) {
        console.error('[SUPABASE INSERT ERROR]', error);
        return NextResponse.json(
          { error: 'Failed to save submission.' },
          { status: 500 },
        );
      }

      return NextResponse.json({ ok: true, persisted: true }, { status: 200 });
    } catch (err) {
      console.error('[FALLBACK ERROR]', err);
    }
  }

  // No transport configured — log + 200 so the lead UX still feels OK,
  // and the founder sees the warning in Vercel runtime logs.
  console.warn(
    '[CONTACT-NO-TRANSPORT] Lead arrived but neither Resend nor Supabase is configured:',
    {
      from: formData.email,
      subject,
    },
  );
  return NextResponse.json(
    { ok: true, warning: 'No transport configured — lead logged only.' },
    { status: 200 },
  );
}
