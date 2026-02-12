'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div role="alert" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '1.5rem',
            padding: '2rem',
            textAlign: 'center',
        }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>oops</h1>
            <p style={{ opacity: 0.7, maxWidth: '400px' }}>
                algo inesperado aconteceu. nossa equipe foi notificada.
            </p>
            <button
                onClick={() => reset()}
                style={{
                    padding: '0.75rem 2rem',
                    border: '1px solid currentColor',
                    borderRadius: '4px',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textTransform: 'lowercase',
                }}
            >
                tentar novamente
            </button>
        </div>
    );
}
