import React from 'react';
import { Card } from '@/components/ui';
import { Activity, Clock, Zap, DollarSign, Power } from 'lucide-react';
import { TankProps } from '@/domain/entities/Tank';
import { cn } from '@/lib/utils/cn';

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
            className: "text-fg-success-primary",
            bgClassName: "bg-bg-success-secondary"
        },
        {
            label: 'horas uso',
            value: `${tank.totalUsageHours || 1240}h`,
            sub: 'total acumulado',
            icon: Clock,
            className: "text-fg-brand-primary",
            bgClassName: "bg-bg-brand-secondary"
        },
        {
            label: 'horas ocioso',
            value: `${tank.totalIdleHours || 420}h`,
            sub: 'últimos 30 dias',
            icon: Power,
            className: "text-fg-secondary",
            bgClassName: "bg-bg-secondary"
        },
        {
            label: 'energia',
            value: `${tank.energyConsumedKwh || 3450} kWh`,
            sub: 'estimado',
            icon: Zap,
            className: "text-fg-warning-primary",
            bgClassName: "bg-bg-warning-secondary"
        },
        {
            label: 'faturamento',
            value: `R$ ${tank.revenueGenerated || 12500}`,
            sub: 'mês atual',
            icon: DollarSign,
            className: "text-fg-brand-tertiary",
            bgClassName: "bg-bg-brand-secondary/50"
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 my-6">
            {kpis.map((kpi, idx) => (
                <Card key={idx} className="p-4 flex flex-col justify-between h-auto gap-3 border-border-secondary hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                        <div className={cn("p-2 rounded-lg", kpi.bgClassName)}>
                            <kpi.icon size={18} className={kpi.className} />
                        </div>
                        {idx === 0 && (
                            <span className="text-[10px] font-bold text-fg-success-primary bg-bg-success-secondary px-1.5 py-0.5 rounded-full">
                                +12%
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-xl font-bold text-fg-primary font-display tracking-tight">{kpi.value.toLowerCase()}</p>
                        <p className="text-xs font-semibold text-fg-tertiary uppercase tracking-wider">{kpi.label}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
};
