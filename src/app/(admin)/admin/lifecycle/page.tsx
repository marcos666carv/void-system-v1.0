'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui';
import { VOID_LEVELS, VOID_LEVEL_CONFIG, VoidLevel } from '@/domain/value-objects/VoidLevel';
import { ClientProps } from '@/domain/entities/Client';

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

    if (loading) return <div style={{ padding: 'var(--space-5)' }}><p style={{ opacity: 0.5 }}>carregando lifecycle...</p></div>;

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-3)' }}>
                <h1 style={{ fontSize: 'var(--font-size-2xl)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>lifecycle do cliente</h1>
                <p style={{ opacity: 0.5, marginTop: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>funil de evolução e automações CRM por nível void</p>
            </div>

            {/* KPI Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                {[
                    { label: 'total clientes', value: totalClients },
                    { label: 'taxa retenção', value: `${totalClients > 0 ? Math.round(((totalClients - levelStats[0].count) / totalClients) * 100) : 0}%` },
                    { label: 'ltv médio', value: formatCurrency(totalClients > 0 ? Math.round(clients.reduce((s, c) => s + c.totalSpent, 0) / totalClients) : 0) },
                    { label: 'nps médio', value: (() => { const scored = clients.filter(c => c.npsScore); return scored.length > 0 ? (scored.reduce((s, c) => s + (c.npsScore ?? 0), 0) / scored.length).toFixed(1) : '—'; })() },
                ].map((kpi, i) => (
                    <Card key={i}  padding="md">
                        <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 500, opacity: 0.5, letterSpacing: '0.04em' }}>{kpi.label}</span>
                        <div style={{ marginTop: 'var(--space-1)' }}>
                            <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, fontFamily: 'var(--font-display)' }}>{kpi.value}</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Funnel Visualization */}
            <Card  padding="md" style={{ marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, letterSpacing: '0.02em', marginBottom: 'var(--space-4)' }}>
                    funil de evolução
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {levelStats.map((stat, i) => {
                        const config = VOID_LEVEL_CONFIG[stat.level];
                        const maxCount = Math.max(...levelStats.map(s => s.count), 1);
                        const width = Math.max((stat.count / maxCount) * 100, 8);
                        return (
                            <div key={stat.level}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                    {/* Level badge */}
                                    <div style={{
                                        width: '100px', flexShrink: 0,
                                        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                                    }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: 'var(--radius-full)', backgroundColor: config.color }} />
                                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{config.label.toLowerCase()}</span>
                                    </div>

                                    {/* Bar */}
                                    <div style={{ flex: 1, height: '32px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                                        <div style={{
                                            height: '100%', width: `${width}%`,
                                            backgroundColor: `${config.color}20`,
                                            borderRight: `3px solid ${config.color}`,
                                            transition: 'width 0.8s var(--ease-antigravity)',
                                            display: 'flex', alignItems: 'center', paddingLeft: 'var(--space-3)',
                                        }}>
                                            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, fontFamily: 'var(--font-display)', color: config.color }}>
                                                {stat.count} ({stat.percentage}%)
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexShrink: 0, minWidth: '180px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: 'var(--font-size-xs)', opacity: 0.4 }}>avg sessões</p>
                                            <span style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>{stat.avgSessions}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: 'var(--font-size-xs)', opacity: 0.4 }}>avg gasto</p>
                                            <span style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>{formatCurrency(stat.avgSpent)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Conversion Rate Arrow */}
                                {i < conversionRates.length && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingLeft: '104px', marginTop: 'var(--space-2)' }}>
                                        <span style={{ fontSize: 'var(--font-size-xs)', opacity: 0.3 }}>↓</span>
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 600,
                                            padding: 'var(--space-1) var(--space-3)',
                                            borderRadius: 'var(--radius-full)',
                                            backgroundColor: conversionRates[i].rate > 50 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                                            color: conversionRates[i].rate > 50 ? 'var(--void-success)' : 'var(--void-error)',
                                            border: `1px solid ${conversionRates[i].rate > 50 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
                                        }}>
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
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, letterSpacing: '0.02em', marginBottom: 'var(--space-4)' }}>
                automações crm por nível
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
                {VOID_LEVELS.map(level => {
                    const config = VOID_LEVEL_CONFIG[level];
                    return (
                        <Card key={level}  padding="md" style={{ borderTop: `3px solid ${config.color}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: 'var(--radius-full)', backgroundColor: config.color }} />
                                <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{config.label.toLowerCase()}</span>
                            </div>
                            <p style={{ fontSize: 'var(--font-size-xs)', opacity: 0.4, marginBottom: 'var(--space-3)' }}>{config.description}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {automationDescriptions[level].map((action, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)', padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                                        <span style={{ color: config.color, fontWeight: 600 }}>→</span>
                                        <span>{action}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
