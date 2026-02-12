import { Skeleton } from '@/components/ui-legacy/Skeleton';

export default function ClientLoading() {
    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <Skeleton height="2rem" width="40%" />
            <Skeleton height="1rem" width="80%" />
            <Skeleton height="1rem" width="60%" />
            <Skeleton height="300px" width="100%" />
        </div>
    );
}
