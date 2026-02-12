import React from 'react';

interface SkeletonProps {
    width?: string;
    height?: string;
    borderRadius?: string;
    style?: React.CSSProperties;
}

export function Skeleton({ width = '100%', height = '1rem', borderRadius, style }: SkeletonProps) {
    return (
        <div
            className="skeleton"
            aria-hidden="true"
            style={{
                width,
                height,
                borderRadius,
                ...style,
            }}
        />
    );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
    return (
        <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Array.from({ length: lines }, (_, i) => (
                <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height="0.875rem" />
            ))}
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div aria-hidden="true" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton height="1.25rem" width="40%" />
            <SkeletonText lines={2} />
            <Skeleton height="2rem" width="30%" />
        </div>
    );
}
