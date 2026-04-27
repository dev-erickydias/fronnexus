'use client';

// ────────────────────────────────────────────────────────────────
// Global error boundary. Used when the root layout itself throws
// (e.g. provider crash, fonts misconfigured). Renders its own <html>
// and <body> because there's no shared layout to wrap us.
// ────────────────────────────────────────────────────────────────

export default function GlobalError({ error, reset }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          background: '#0a0e14',
          color: '#f5f1ea',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          role="alert"
          style={{
            maxWidth: 480,
            margin: '0 24px',
            padding: 40,
            borderRadius: 24,
            background: 'rgba(20, 27, 45, 0.8)',
            border: '1px solid rgba(255, 107, 107, 0.2)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#ff6b6b',
              marginBottom: 16,
            }}
          >
            ◇ Algo grave aconteceu
          </div>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              margin: '0 0 16px',
            }}
          >
            Site indisponível
          </h1>
          <p
            style={{
              color: '#94a3b8',
              lineHeight: 1.6,
              margin: '0 0 32px',
            }}
          >
            Foi um erro raríssimo a nível do app inteiro. Já registramos
            e vamos resolver. Tenta recarregar daqui a alguns minutos —
            ou nos manda um e-mail.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: '12px 24px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
                color: '#0a0e14',
                background:
                  'linear-gradient(135deg, #5eead4 0%, #a78bfa 50%, #ff6b6b 100%)',
              }}
            >
              Recarregar
            </button>
            <a
              href="mailto:contato@fronnexus.org"
              style={{
                padding: '12px 24px',
                borderRadius: 999,
                border: '1px solid rgba(245, 241, 234, 0.15)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
                color: '#f5f1ea',
                textDecoration: 'none',
                background: 'transparent',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Mandar e-mail
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
