import Link from 'next/link';
import { Geist } from 'next/font/google';

const geist = Geist({ subsets: ['latin'] });

export const Logo = ({ className = '' }: { className?: string }) => {
    return (
        <Link href="/" className={`${geist.className} ${className}`} style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textDecoration: 'none',
            color: 'var(--foreground)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        }}>
            <span style={{ color: 'var(--primary)' }}>void</span>
            <span style={{ fontSize: '0.6rem', opacity: 0.5, letterSpacing: '0.05em' }}>system v1.0</span>
        </Link>
    );
};
