'use client';
import { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import Reveal from '../Animation/Reveal';
import SplitWords from '../Animation/SplitWords';

// WhatsApp number is read at build time from NEXT_PUBLIC_WHATSAPP env
// (digits only, with country code, e.g. 5511999999999). Empty string
// hides the WhatsApp shortcut entirely — useful while you don't have
// a public number set up yet.
const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP || '').replace(/\D/g, '');

// ────────────────────────────────────────────────────────────────
// ContactForm — animated boutique contact form. Posts to
// /api/send-email (existing endpoint). Inline validation + success
// state; no external CSV/country fetcher (kept clean).
// ────────────────────────────────────────────────────────────────

const inputCls =
  'w-full px-4 py-3 rounded-xl text-sm text-[var(--mist-50)] placeholder:text-[var(--mist-500)] transition-all duration-300 focus:outline-none';

const inputStyle = {
  background: 'rgba(20, 27, 45, 0.55)',
  border: '1px solid var(--border-soft)',
  colorScheme: 'dark',
};

const inputFocusStyle =
  'focus:border-[var(--teal-500)] focus:ring-2 focus:ring-[rgba(94,234,212,0.18)]';

export default function ContactForm() {
  const { t } = useI18n();
  const [state, setState] = useState({ status: 'idle', error: null });

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    details: '',
    // Honeypot — hidden from real users via CSS, irresistible to bots.
    // The API silently 200s if this is filled, so the bot moves on.
    website: '',
  });

  function update(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.firstName.trim() ||
      !form.email.trim() ||
      !form.details.trim()
    ) {
      setState({ status: 'error', error: 'required' });
      return;
    }

    setState({ status: 'sending', error: null });

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState({ status: 'sent', error: null });
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        budget: '',
        details: '',
      });
    } catch (err) {
      setState({ status: 'error', error: err.message });
    }
  }

  const projectTypes = ['web', 'marketing', 'consulting', 'analysis', 'other'];
  const budgets = ['small', 'medium', 'large', 'enterprise', 'tbd'];

  return (
    <section
      className="relative section-pad pt-32"
      aria-label={t('contact.label')}
    >
      <div className="container-narrow">
        <Reveal>
          <span className="label-tag inline-block mb-6">
            ◇ {t('contact.label')}
          </span>
        </Reveal>

        <h1 className="display-xl font-display mb-6 text-balance">
          <SplitWords text={t('contact.title')} />{' '}
          <span className="text-bridge">
            <SplitWords text={t('contact.highlight')} delay={120} />
          </span>
          <SplitWords text={t('contact.after')} delay={240} />
        </h1>

        <Reveal delay={300}>
          <p className="text-lg text-[var(--mist-300)] mb-8 text-pretty">
            {t('contact.intro')}
          </p>
        </Reveal>

        {WHATSAPP && (
          <Reveal delay={380}>
            <div
              className="mb-12 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
              style={{
                background:
                  'linear-gradient(135deg, rgba(94,234,212,0.10), rgba(167,139,250,0.06))',
                border: '1px solid var(--border-glow)',
              }}
            >
              <div className="flex-grow">
                <p className="text-[var(--mist-50)] font-medium mb-1">
                  {t('contact.info.whatsappLabel')}
                </p>
                <p className="text-sm text-[var(--mist-400)]">
                  {t('contact.info.whatsappHint')}
                </p>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá, vim do site da Fronnexus.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-bridge"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {t('contact.info.whatsappLabel')}
              </a>
            </div>
          </Reveal>
        )}

        {state.status === 'sent' ? (
          <Reveal kind="scale">
            <div
              className="glass p-10 sm:p-14 text-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(94,234,212,0.08), rgba(167,139,250,0.06))',
                border: '1px solid var(--border-glow)',
              }}
            >
              <h2 className="display-md font-display mb-4 text-bridge">
                {t('contact.success.title')}
              </h2>
              <p className="text-lg text-[var(--mist-200)] text-pretty">
                {t('contact.success.body')}
              </p>
            </div>
          </Reveal>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Honeypot — hidden from humans, bots fill it. */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
              }}
            >
              <label htmlFor="website-field">
                Website (leave empty)
                <input
                  id="website-field"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => update('website', e.target.value)}
                />
              </label>
            </div>
            <Reveal delay={400}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t('contact.labels.firstName')} required>
                  <input
                    type="text"
                    className={`${inputCls} ${inputFocusStyle}`}
                    style={inputStyle}
                    placeholder={t('contact.placeholders.firstName')}
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    required
                  />
                </Field>
                <Field label={t('contact.labels.lastName')}>
                  <input
                    type="text"
                    className={`${inputCls} ${inputFocusStyle}`}
                    style={inputStyle}
                    placeholder={t('contact.placeholders.lastName')}
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                  />
                </Field>
              </div>
            </Reveal>

            <Reveal delay={460}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t('contact.labels.email')} required>
                  <input
                    type="email"
                    className={`${inputCls} ${inputFocusStyle}`}
                    style={inputStyle}
                    placeholder={t('contact.placeholders.email')}
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    required
                  />
                </Field>
                <Field
                  label={`${t('contact.labels.phone')} ${t('contact.labels.phoneOptional')}`}
                >
                  <input
                    type="tel"
                    className={`${inputCls} ${inputFocusStyle}`}
                    style={inputStyle}
                    placeholder={t('contact.placeholders.phone')}
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                  />
                </Field>
              </div>
            </Reveal>

            <Reveal delay={520}>
              <Field
                label={`${t('contact.labels.company')} ${t('contact.labels.companyOptional')}`}
              >
                <input
                  type="text"
                  className={`${inputCls} ${inputFocusStyle}`}
                  style={inputStyle}
                  placeholder={t('contact.placeholders.company')}
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                />
              </Field>
            </Reveal>

            <Reveal delay={580}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label={t('contact.labels.projectType')}
                  hint={t('contact.labels.projectTypeHint')}
                >
                  <select
                    className={`${inputCls} ${inputFocusStyle}`}
                    style={inputStyle}
                    value={form.projectType}
                    onChange={(e) => update('projectType', e.target.value)}
                  >
                    <option value="">—</option>
                    {projectTypes.map((p) => (
                      <option key={p} value={p}>
                        {t(`contact.projectTypes.${p}`)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label={t('contact.labels.budget')}
                  hint={t('contact.labels.budgetOptional')}
                >
                  <select
                    className={`${inputCls} ${inputFocusStyle}`}
                    style={inputStyle}
                    value={form.budget}
                    onChange={(e) => update('budget', e.target.value)}
                  >
                    <option value="">—</option>
                    {budgets.map((b) => (
                      <option key={b} value={b}>
                        {t(`contact.budgets.${b}`)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </Reveal>

            <Reveal delay={640}>
              <Field
                label={t('contact.labels.projectDetails')}
                hint={t('contact.labels.projectDetailsHint')}
                required
              >
                <textarea
                  rows={6}
                  className={`${inputCls} ${inputFocusStyle} resize-y`}
                  style={inputStyle}
                  placeholder={t('contact.placeholders.details')}
                  value={form.details}
                  onChange={(e) => update('details', e.target.value)}
                  required
                />
              </Field>
            </Reveal>

            {state.status === 'error' && (
              <Reveal>
                <div
                  className="p-4 rounded-xl text-sm"
                  style={{
                    background: 'rgba(255,107,107,0.08)',
                    border: '1px solid var(--border-coral)',
                    color: 'var(--coral-300)',
                  }}
                >
                  {t('contact.error.title')} — {t('contact.error.body')}
                </div>
              </Reveal>
            )}

            <Reveal delay={700}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="btn-bridge"
                  disabled={state.status === 'sending'}
                  style={{
                    opacity: state.status === 'sending' ? 0.6 : 1,
                    cursor: state.status === 'sending' ? 'wait' : 'pointer',
                  }}
                >
                  {state.status === 'sending'
                    ? t('contact.labels.submitting')
                    : t('contact.labels.submit')}
                  <span aria-hidden="true">→</span>
                </button>

                <div className="text-sm text-[var(--mist-400)] flex flex-col sm:flex-row sm:items-center sm:gap-3">
                  <a
                    href={`mailto:${t('contact.info.email')}`}
                    className="text-[var(--teal-500)] hover:text-[var(--mist-50)]"
                  >
                    {t('contact.info.email')}
                  </a>
                  <span className="hidden sm:inline">·</span>
                  <span>{t('contact.info.responseTime')}</span>
                </div>
              </div>
            </Reveal>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold tracking-[0.18em] uppercase mb-2 text-[var(--mist-300)]">
        {label}
        {required && <span className="text-coral ml-1">*</span>}
      </span>
      {children}
      {hint && (
        <span className="block mt-1.5 text-[11px] text-[var(--mist-500)]">
          {hint}
        </span>
      )}
    </label>
  );
}
