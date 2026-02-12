'use client';

export default function AdminError({
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
            minHeight: '40vh',
            gap: '1.5rem',
            textAlign: 'center',
        }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>erro no painel</h2>
            <p style={{ opacity: 0.7 }}>
                algo deu errado ao carregar esta seção.
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
