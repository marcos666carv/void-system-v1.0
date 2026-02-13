import { SkeletonCard } from '@/components/ui';

export default function AdminLoading() {
    return (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
            <SkeletonCard />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    );
}
