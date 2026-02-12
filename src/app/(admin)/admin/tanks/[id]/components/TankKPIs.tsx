import React from 'react';
import { Card } from '@/components/ui';
import { Activity, Clock, Zap, DollarSign, Power } from 'lucide-react';
import { TankProps } from '@/domain/entities/Tank';
import s from './TankKPIs.module.css';

interface TankKPIsProps {
    tank: TankProps;
}

export const TankKPIs: React.FC<TankKPIsProps> = ({ tank }) => {
    // Mock data if not present in tank entity yet (but we added types)
    const kpis = [
        {
            label: 'sessões totais',
            value: tank.totalSessions?.toString() || '0',
            sub: 'histórico completo',
            icon: Activity,
            className: s.textEmerald,
            bgClassName: s.bgEmerald
        },
        {
            label: 'horas uso',
            value: `${tank.totalUsageHours || 1240}h`,
            sub: 'total acumulado',
            icon: Clock,
            className: s.textBlue,
            bgClassName: s.bgBlue
        },
        {
            label: 'horas ocioso',
            value: `${tank.totalIdleHours || 420}h`,
            sub: 'últimos 30 dias',
            icon: Power,
            className: s.textSlate,
            bgClassName: s.bgSlate
        },
        {
            label: 'energia',
            value: `${tank.energyConsumedKwh || 3450} kWh`,
            sub: 'estimado',
            icon: Zap,
            className: s.textYellow,
            bgClassName: s.bgYellow
        },
        {
            label: 'faturamento',
            value: `R$ ${tank.revenueGenerated || 12500}`,
            sub: 'mês atual',
            icon: DollarSign,
            className: s.textPurple,
            bgClassName: s.bgPurple
        },
    ];

    return (
        <div className={s.grid}>
            {kpis.map((kpi, idx) => (
                <Card key={idx} className={s.card}>
                    <div className={s.header}>
                        <div className={`${s.iconWrapper} ${kpi.bgClassName}`}>
                            <kpi.icon size={18} className={kpi.className} />
                        </div>
                        {idx === 0 && (
                            <span className={s.trendBadge}>+12%</span>
                        )}
                    </div>
                    <div>
                        <p className={s.value}>{kpi.value.toLowerCase()}</p>
                        <p className={s.label}>{kpi.label}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
};
