'use client';

// ────────────────────────────────────────────────────────────────
// Route-level error boundary. Catches any error thrown during the
// render of a page, including async/Suspense + WebGL failures.
// Keeps the user on a branded screen instead of a blank page.
// ────────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Surface only — never log secrets / user input
    console.error('[route error]', error?.digest || error?.message || 'unknown');
  }, [error]);

  return (
    <main
      className="min-h-[80dvh] flex items-center justify-center px-6 pt-32 pb-24"
      role="alert"
    >
      <div
        className="w-full max-w-md text-center rounded-3xl p-10"
        style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--border-coral)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <span
          className="label-tag inline-block mb-4"
          style={{ color: 'var(--coral-500)' }}
        >
          ◇ Algo deu errado
        </span>
        <h1 className="display-md font-display mb-4 text-balance">
          Bati a cabeça.
        </h1>
        <p className="text-[var(--mist-300)] mb-8 text-pretty">
          Algo na página quebrou de forma inesperada. Já registramos
          o erro e estamos olhando.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-bridge"
          >
            Tentar de novo
          </button>
          <Link href="/" className="btn-ghost">
            Voltar pra home
          </Link>
        </div>
      </div>
    </main>
  );
}
