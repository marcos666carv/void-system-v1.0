'use client';

interface BarItem {
    label: string;
    value: number;
    meta?: string;
}

interface SvgBarChartProps {
    data: BarItem[];
    color?: string;
    height?: number;
    showValues?: boolean;
}

export function SvgBarChart({
    data,
    color = 'var(--primary)',
    height: propHeight,
    showValues = true,
}: SvgBarChartProps) {
    if (data.length === 0) return null;

    const max = Math.max(...data.map((d) => d.value));
    const barHeight = 20;
    const gap = 12;
    const labelWidth = 120;
    const valueWidth = 100;
    const height = propHeight || data.length * (barHeight + gap) + gap;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
            {data.map((item, i) => {
                const pct = max > 0 ? (item.value / max) * 100 : 0;
                return (
                    <div
                        key={i}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `${labelWidth}px 1fr ${showValues ? `${valueWidth}px` : ''}`,
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                        }}
                    >
                        <span
                            style={{
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 500,
                                color: 'var(--foreground)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {item.label}
                        </span>
                        <div
                            style={{
                                height: `${barHeight}px`,
                                backgroundColor: 'var(--void-ice)',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    width: `${pct}%`,
                                    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                                    borderRadius: '10px',
                                    transition: 'width 0.6s var(--ease-antigravity)',
                                }}
                            />
                        </div>
                        {showValues && (
                            <span
                                style={{
                                    fontSize: 'var(--font-size-xs)',
                                    color: 'var(--secondary)',
                                    textAlign: 'right',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {item.meta || item.value.toLocaleString('pt-BR')}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
