'use client';

interface SvgAreaChartProps {
    data: number[];
    labels?: string[];
    color?: string;
    height?: number;
    showGrid?: boolean;
    showDots?: boolean;
    showValues?: boolean;
}

export function SvgAreaChart({
    data,
    labels = [],
    color = 'var(--primary)',
    height = 200,
    showGrid = true,
    showDots = true,
    showValues = false,
}: SvgAreaChartProps) {
    if (data.length < 2) return null;

    const width = 600;
    const padL = 48;
    const padR = 16;
    const padT = 16;
    const padB = 28;
    const chartW = width - padL - padR;
    const chartH = height - padT - padB;

    const min = 0;
    const max = Math.max(...data) * 1.15;
    const range = max - min || 1;

    const points = data.map((v, i) => ({
        x: padL + (i / (data.length - 1)) * chartW,
        y: padT + (1 - (v - min) / range) * chartH,
    }));

    const smoothPath = (pts: typeof points) => {
        return pts
            .map((p, i) => {
                if (i === 0) return `M ${p.x} ${p.y}`;
                const prev = pts[i - 1];
                const tension = 0.3;
                const cpx1 = prev.x + (p.x - prev.x) * tension;
                const cpx2 = p.x - (p.x - prev.x) * tension;
                return `C ${cpx1} ${prev.y}, ${cpx2} ${p.y}, ${p.x} ${p.y}`;
            })
            .join(' ');
    };

    const linePath = smoothPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`;

    const gridLines = [0, 0.25, 0.5, 0.75, 1];

    const gradId = `area-fill-${Math.random().toString(36).slice(2, 8)}`;

    return (
        <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ display: 'block' }}
        >
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.01} />
                </linearGradient>
            </defs>

            {showGrid && gridLines.map((pct) => {
                const y = padT + (1 - pct) * chartH;
                const val = Math.round(min + pct * range);
                return (
                    <g key={pct}>
                        <line
                            x1={padL}
                            y1={y}
                            x2={padL + chartW}
                            y2={y}
                            stroke="var(--border)"
                            strokeDasharray="4 4"
                        />
                        <text
                            x={padL - 8}
                            y={y + 4}
                            textAnchor="end"
                            fontSize="10"
                            fill="var(--secondary)"
                            opacity={0.6}
                        >
                            {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                        </text>
                    </g>
                );
            })}

            <path d={areaPath} fill={`url(#${gradId})`} />
            <path d={linePath} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />

            {showDots && points.map((p, i) => (
                <g key={i}>
                    <circle cx={p.x} cy={p.y} r={3} fill="var(--surface)" stroke={color} strokeWidth={1.5} />
                    {showValues && (
                        <text
                            x={p.x}
                            y={p.y - 10}
                            textAnchor="middle"
                            fontSize="10"
                            fill="var(--foreground)"
                            fontWeight={600}
                        >
                            {data[i] >= 1000 ? `${(data[i] / 1000).toFixed(1)}k` : data[i]}
                        </text>
                    )}
                </g>
            ))}

            {labels.map((label, i) => {
                const x = padL + (i / (data.length - 1)) * chartW;
                return (
                    <text
                        key={i}
                        x={x}
                        y={height - 4}
                        textAnchor="middle"
                        fontSize="10"
                        fill="var(--secondary)"
                        opacity={0.6}
                    >
                        {label}
                    </text>
                );
            })}
        </svg>
    );
}
