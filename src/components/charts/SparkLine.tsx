'use client';

interface SparkLineProps {
    data: number[];
    color?: string;
    width?: number;
    height?: number;
    strokeWidth?: number;
    showArea?: boolean;
}

export function SparkLine({
    data,
    color = 'var(--primary)',
    width = 80,
    height = 32,
    strokeWidth = 1.5,
    showArea = true,
}: SparkLineProps) {
    if (data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;

    const points = data.map((v, i) => ({
        x: padding + (i / (data.length - 1)) * (width - padding * 2),
        y: padding + (1 - (v - min) / range) * (height - padding * 2),
    }));

    const pathD = points
        .map((p, i) => {
            if (i === 0) return `M ${p.x} ${p.y}`;
            const prev = points[i - 1];
            const cpx1 = prev.x + (p.x - prev.x) / 3;
            const cpx2 = prev.x + (2 * (p.x - prev.x)) / 3;
            return `C ${cpx1} ${prev.y}, ${cpx2} ${p.y}, ${p.x} ${p.y}`;
        })
        .join(' ');

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    const gradientId = `spark-grad-${Math.random().toString(36).slice(2, 8)}`;

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            style={{ display: 'block' }}
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            {showArea && (
                <path d={areaD} fill={`url(#${gradientId})`} />
            )}
            <path d={pathD} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
