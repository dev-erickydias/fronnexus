'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';

const SHORT = { pt: 'PT', en: 'EN' };
const FULL = { pt: 'Português', en: 'English' };

// ────────────────────────────────────────────────────────────────
// LanguageSwitcher — single dropdown pill (PT/EN).
// Closes on outside click, Escape, or selection.
// ────────────────────────────────────────────────────────────────

export default function LanguageSwitcher() {
  const { lang, changeLang, supportedLangs, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;

    function onDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  function handlePick(code) {
    if (code !== lang) changeLang(code);
    close();
    triggerRef.current?.focus();
  }

  return (
    <div
      ref={rootRef}
      className="relative inline-block"
      style={{ marginLeft: 6 }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t('nav.language')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-200"
        style={{
          background: open
            ? 'rgba(94, 234, 212, 0.12)'
            : 'rgba(20, 27, 45, 0.45)',
          border: '1px solid var(--border-soft)',
          color: 'var(--teal-500)',
        }}
      >
        <span>{SHORT[lang] || lang.toUpperCase()}</span>
        <svg
          width="9"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
          style={{
            transition: 'transform 0.25s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <ul
        id={menuId}
        role="listbox"
        hidden={!open}
        className="absolute top-full right-0 mt-2 min-w-[160px] p-1.5 rounded-2xl"
        style={{
          background: 'rgba(10, 14, 20, 0.92)',
          backdropFilter: 'blur(18px) saturate(160%)',
          WebkitBackdropFilter: 'blur(18px) saturate(160%)',
          border: '1px solid var(--border-soft)',
          boxShadow:
            '0 18px 40px rgba(0,0,0,0.5), 0 0 32px rgba(94,234,212,0.06)',
        }}
      >
        {supportedLangs.map((code) => {
          const active = code === lang;
          return (
            <li key={code} role="option" aria-selected={active}>
              <button
                type="button"
                onClick={() => handlePick(code)}
                tabIndex={open ? 0 : -1}
                className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl transition-all duration-200"
                style={{
                  background: active ? 'rgba(94, 234, 212, 0.10)' : 'transparent',
                  color: active ? 'var(--teal-500)' : 'var(--mist-200)',
                }}
              >
                <span className="text-[11px] font-bold tracking-[0.20em]">
                  {SHORT[code]}
                </span>
                <span className="text-[12px] opacity-85">{FULL[code]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
