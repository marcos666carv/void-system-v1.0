import { Skeleton } from '@/components/ui';

export default function ClientLoading() {
    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <Skeleton className="h-8 w-2/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-[300px] w-full" />
        </div>
    );
}
