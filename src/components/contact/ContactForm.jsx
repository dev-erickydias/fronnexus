'use client';
import { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import Reveal from '../Animation/Reveal';
import SplitWords from '../Animation/SplitWords';

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
          <p className="text-lg text-[var(--mist-300)] mb-12 text-pretty">
            {t('contact.intro')}
          </p>
        </Reveal>

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
          <form onSubmit={handleSubmit} className="space-y-6">
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
