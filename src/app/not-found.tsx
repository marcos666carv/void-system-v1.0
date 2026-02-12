export default function NotFound() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '1.5rem',
            padding: '2rem',
            textAlign: 'center',
        }}>
            <h1 style={{ fontSize: '6rem', fontWeight: 700, lineHeight: 1 }}>404</h1>
            <p style={{ opacity: 0.7 }}>
                esta página não existe no void.
            </p>
            <a
                href="/"
                style={{
                    padding: '0.75rem 2rem',
                    border: '1px solid currentColor',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: 'inherit',
                    fontFamily: 'inherit',
                    textTransform: 'lowercase',
                }}
            >
                voltar ao início
            </a>
        </div>
    );
}
