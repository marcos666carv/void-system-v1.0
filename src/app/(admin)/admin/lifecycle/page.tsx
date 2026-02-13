'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui';
import { VOID_LEVELS, VOID_LEVEL_CONFIG, VoidLevel } from '@/domain/value-objects/VoidLevel';
import { ClientProps } from '@/domain/entities/Client';
import { cn } from '@/lib/utils/cn';
import { ArrowDown, CheckCircle2 } from 'lucide-react';

interface LevelStats {
    level: VoidLevel;
    count: number;
    percentage: number;
    avgSpent: number;
    avgSessions: number;
}

const automationDescriptions: Record<VoidLevel, string[]> = {
    iniciado: ['e-mail de boas-vindas', 'pesquisa pós-sessão', 'oferta 2ª sessão -20%'],
    explorador: ['convite para Void Club', 'e-mail com benefícios de assinatura', 'notificação push com horários'],
    habitue: ['desconto exclusivo no aniversário', 'acesso prioritário a novos horários', 'indicação premiada ativa'],
    mestre: ['convite para eventos VIP', 'acesso a sessões estendidas', 'programa de embaixador'],
    voidwalker: ['experiência personalizada completa', 'acesso ilimitado a todas as unidades', 'convites para lançamentos'],
};

export default function LifecyclePage() {
    const [clients, setClients] = useState<ClientProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/clients?pageSize=50')
            .then(r => r.json())
            .then(data => { setClients((data.data ?? []).filter((c: ClientProps) => c.role === 'client')); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const totalClients = clients.length;

    const levelStats: LevelStats[] = VOID_LEVELS.map(level => {
        const levelClients = clients.filter(c => c.level === level);
        return {
            level,
            count: levelClients.length,
            percentage: totalClients > 0 ? Math.round((levelClients.length / totalClients) * 100) : 0,
            avgSpent: levelClients.length > 0 ? Math.round(levelClients.reduce((sum, c) => sum + c.totalSpent, 0) / levelClients.length) : 0,
            avgSessions: levelClients.length > 0 ? Math.round(levelClients.reduce((sum, c) => sum + c.totalSessions, 0) / levelClients.length) : 0,
        };
    });

    const conversionRates: { from: VoidLevel; to: VoidLevel; rate: number }[] = [];
    for (let i = 0; i < VOID_LEVELS.length - 1; i++) {
        const from = levelStats[i];
        const to = levelStats[i + 1];
        const rate = from.count > 0 ? Math.round((to.count / from.count) * 100) : 0;
        conversionRates.push({ from: from.level, to: to.level, rate: Math.min(rate, 100) });
    }

    const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

    if (loading) return (
        <div className="p-10 flex items-center justify-center">
            <p className="text-fg-tertiary animate-pulse">carregando lifecycle...</p>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto pb-10 flex flex-col gap-6">
            <div className="mb-2">
                <h1 className="text-2xl font-bold font-display text-fg-primary tracking-tight">lifecycle do cliente</h1>
                <p className="text-sm text-fg-tertiary font-medium">funil de evolução e automações CRM por nível void</p>
            </div>

            {/* KPI Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'total clientes', value: totalClients },
                    { label: 'taxa retenção', value: `${totalClients > 0 ? Math.round(((totalClients - levelStats[0].count) / totalClients) * 100) : 0}%` },
                    { label: 'ltv médio', value: formatCurrency(totalClients > 0 ? Math.round(clients.reduce((s, c) => s + c.totalSpent, 0) / totalClients) : 0) },
                    { label: 'nps médio', value: (() => { const scored = clients.filter(c => c.npsScore); return scored.length > 0 ? (scored.reduce((s, c) => s + (c.npsScore ?? 0), 0) / scored.length).toFixed(1) : '—'; })() },
                ].map((kpi, i) => (
                    <Card key={i} className="p-4 border-border-secondary">
                        <span className="text-xs font-semibold text-fg-tertiary uppercase tracking-wider">{kpi.label}</span>
                        <div className="mt-1">
                            <span className="text-2xl font-bold font-display text-fg-primary tracking-tight">{kpi.value}</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Funnel Visualization */}
            <Card className="p-6 border-border-secondary overflow-hidden">
                <h3 className="text-sm font-bold text-fg-primary uppercase tracking-wider mb-6">
                    funil de evolução
                </h3>
                <div className="flex flex-col gap-4">
                    {levelStats.map((stat, i) => {
                        const config = VOID_LEVEL_CONFIG[stat.level];
                        const maxCount = Math.max(...levelStats.map(s => s.count), 1);
                        const width = Math.max((stat.count / maxCount) * 100, 8);
                        return (
                            <div key={stat.level}>
                                <div className="flex items-center gap-4">
                                    {/* Level badge */}
                                    <div className="w-[100px] shrink-0 flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
                                        <span className="text-sm font-bold text-fg-primary lowercase">{config.label.toLowerCase()}</span>
                                    </div>

                                    {/* Bar */}
                                    <div className="flex-1 h-9 bg-bg-secondary rounded-lg overflow-hidden border border-border-secondary relative">
                                        <div
                                            className="h-full flex items-center pl-3 transition-all duration-700 ease-out border-r-2"
                                            style={{
                                                width: `${width}%`,
                                                backgroundColor: `${config.color}20`,
                                                borderColor: config.color,
                                            }}
                                        >
                                            <span
                                                className="text-sm font-bold font-display"
                                                style={{ color: config.color }}
                                            >
                                                {stat.count} <span className="text-xs opacity-70 ml-1">({stat.percentage}%)</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex gap-6 shrink-0 min-w-[180px] justify-end">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-fg-quaternary uppercase">avg sessões</p>
                                            <span className="text-sm font-bold text-fg-primary font-display tabular-nums">{stat.avgSessions}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-fg-quaternary uppercase">avg gasto</p>
                                            <span className="text-sm font-bold text-fg-primary font-display tabular-nums">{formatCurrency(stat.avgSpent)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Conversion Rate Arrow */}
                                {i < conversionRates.length && (
                                    <div className="flex items-center gap-3 pl-[104px] mt-2 mb-2">
                                        <ArrowDown size={14} className="text-fg-tertiary/50" />
                                        <span
                                            className={cn(
                                                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                                conversionRates[i].rate > 50
                                                    ? "bg-bg-success-secondary/50 text-fg-success-primary border-bg-success-secondary"
                                                    : "bg-bg-error-secondary/50 text-fg-error-primary border-bg-error-secondary"
                                            )}
                                        >
                                            {conversionRates[i].rate}% conversão
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* CRM Automations per Level */}
            <div>
                <h3 className="text-sm font-bold text-fg-primary uppercase tracking-wider mb-4 ml-1">
                    automações crm por nível
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {VOID_LEVELS.map(level => {
                        const config = VOID_LEVEL_CONFIG[level];
                        return (
                            <Card key={level} className="p-5 border-border-secondary border-t-[3px] h-full" style={{ borderTopColor: config.color }}>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
                                    <span className="font-bold text-sm text-fg-primary lowercase">{config.label.toLowerCase()}</span>
                                </div>
                                <p className="text-xs text-fg-tertiary mb-3 min-h-[32px]">{config.description}</p>
                                <div className="flex flex-col gap-2">
                                    {automationDescriptions[level].map((action, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs p-2 bg-bg-secondary/50 rounded-lg border border-border-secondary/50">
                                            <CheckCircle2 size={12} className="mt-0.5 shrink-0" style={{ color: config.color }} />
                                            <span className="text-fg-secondary font-medium">{action}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
