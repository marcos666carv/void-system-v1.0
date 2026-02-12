import Link from 'next/link';

export const Logo = ({ className = '' }: { className?: string }) => {
    return (
        <Link href="/" className={`flex items-center gap-2 no-underline text-fg-primary ${className}`}>
            <span className="text-2xl font-semibold tracking-widest font-display text-brand-primary">void</span>
            <span className="text-[0.6rem] opacity-50 tracking-wider font-sans">system v1.0</span>
        </Link>
    );
};
