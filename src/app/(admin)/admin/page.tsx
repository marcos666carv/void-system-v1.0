'use client';

import s from './AdminDashboard.module.css';

// ... imports ...
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { SparkLine } from '@/components/charts/SparkLine';
import { SvgAreaChart } from '@/components/charts/SvgAreaChart';
import { SvgBarChart } from '@/components/charts/SvgBarChart';
import { ArrowUpRight, ArrowDownRight, Activity, Users, DollarSign, Calendar, Zap, Gift, ExternalLink, X, Thermometer, Music, Waves, User } from 'lucide-react';

interface DashboardStats {
    totalRevenue: number;
    totalSessions: number;
    averageTicket: number;
    tankIdlePercentage: number;
}

interface EngagementAction {
    type: 'winback' | 'birthday' | 'upsell';
    clientName: string;
    detail: string;
}

interface TopService {
    name: string;
    bookings: number;
    revenue: number;
}

// Detailed Appointment Interface for Modal
interface AppointmentDetail {
    id: string;
    clientId: string;
    clientName: string;
    clientLevel: 'explorador' | 'adepto' | 'veterano' | 'mestre';
    time: string;
    location: string;
    service: string;
    setup: {
        music: boolean;
        temperature: number;
        lights: boolean;
    };
    stats: {
        floats: number;
        massages: number;
        purchases: number;
    };
}

const mockStats: DashboardStats = {
    totalRevenue: 42800,
    totalSessions: 156,
    averageTicket: 274,
    tankIdlePercentage: 18,
};

const mockActions: EngagementAction[] = [
    { type: 'winback', clientName: 'carlos mendes', detail: 'inativo há 45d' },
    { type: 'winback', clientName: 'rafael lima', detail: 'inativo há 60d' },
    { type: 'birthday', clientName: 'ana silva', detail: 'aniversário (3d)' },
    { type: 'upsell', clientName: 'lucas oliveira', detail: 'explorador → habitué' },
    { type: 'upsell', clientName: 'juliana alves', detail: 'explorador → habitué' },
];

const mockTopServices: TopService[] = [
    { name: 'flutuação 60min', bookings: 84, revenue: 12600 },
    { name: 'flutuação 90min', bookings: 42, revenue: 10500 },
    { name: 'massagem + float', bookings: 18, revenue: 8100 },
    { name: 'plano voyager', bookings: 12, revenue: 4188 },
];

const mockAppointments: AppointmentDetail[] = [
    {
        id: '1', clientId: 'client_1', clientName: 'marcos rocha', clientLevel: 'veterano', time: '09:00', location: 'curitiba', service: 'flutuação 60min',
        setup: { music: true, temperature: 35.5, lights: false },
        stats: { floats: 12, massages: 2, purchases: 15 }
    },
    {
        id: '2', clientId: 'client_2', clientName: 'julia santos', clientLevel: 'adepto', time: '10:30', location: 'curitiba', service: 'massagem',
        setup: { music: false, temperature: 35.0, lights: true },
        stats: { floats: 5, massages: 8, purchases: 6 }
    },
    {
        id: '3', clientId: 'client_3', clientName: 'pedro alves', clientLevel: 'explorador', time: '13:00', location: 'campo largo', service: 'flutuação 90min',
        setup: { music: true, temperature: 35.5, lights: true },
        stats: { floats: 1, massages: 0, purchases: 1 }
    },
    {
        id: '4', clientId: 'client_4', clientName: 'fernanda lima', clientLevel: 'mestre', time: '15:00', location: 'curitiba', service: 'completo (float + massagem)',
        setup: { music: false, temperature: 34.5, lights: false },
        stats: { floats: 45, massages: 20, purchases: 60 }
    },
];

const mockRevenueData = [3200, 4100, 3800, 5200, 4600, 6800, 5900, 4200, 6100, 5400, 6600, 7200];
const revenueLabels = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

const actionIcons: Record<string, any> = { winback: Activity, birthday: Gift, upsell: ArrowUpRight };

const kpiSparkData: number[][] = [
    [28, 32, 35, 38, 36, 41, 42.8],
    [120, 128, 135, 140, 145, 150, 156],
    [290, 285, 280, 278, 275, 272, 274],
    [25, 22, 20, 19, 18, 18, 18],
];

export default function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/dashboard');
                if (res.ok) {
                    const data = await res.json();
                    setStats({
                        totalRevenue: data.totalRevenue,
                        totalSessions: data.totalAppointments,
                        averageTicket: data.averageTicket,
                        tankIdlePercentage: data.tankIdlePercentage,
                    });
                } else {
                    // Fallback to mock in case of error
                    setStats(mockStats);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
                setStats(mockStats);
            }
        }
        fetchStats();
    }, []);

    if (!stats) {
        return <div style={{ padding: 'var(--space-5)' }}><p style={{ opacity: 0.5 }}>carregando dashboard...</p></div>;
    }

    return (
        <div className={s.container}>
            {/* Header Compacto */}
            <div className={s.header}>
                <div className={s.titleContainer}>
                    <h1 className={s.title}>dashboard executivo</h1>
                    <p className={s.subtitle}>visão geral de performance</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div className={s.periodBadge}>
                        <span style={{ opacity: 0.5 }}>período:</span> este mês
                    </div>
                </div>
            </div>

            {/* Layout Grid - High Density (Caplen Style) */}
            <div className={s.dashboardGrid}>

                {/* Left Column: Core Metrics & Charts */}
                <div className={s.adminColumnMain}>

                    {/* Hero Section: KPIs row */}
                    <div className={s.kpiGrid}>

                        {/* Revenue - Dark/Highlight Card */}
                        <div className={s.revenueCard}>
                            <div className={s.revenueIcon}><DollarSign size={24} /></div>
                            <p className={s.kpiLabel} style={{ color: 'rgba(255,255,255,0.6)' }}>receita total</p>
                            <p className={s.kpiValue} style={{ fontSize: '1.5rem' }}>{formatCurrency(stats.totalRevenue)}</p>
                            <div className={s.kpiTrend} style={{ color: '#10B981' }}>
                                <ArrowUpRight size={14} /> +12% <span style={{ opacity: 0.4, color: 'white' }}>vs. mês anterior</span>
                            </div>
                        </div>

                        {/* Sessions */}
                        <div className={s.kpiCard}>
                            <div className={s.kpiHeader}>
                                <p className={s.kpiLabel}>sessões</p>
                                <Users size={16} className={s.kpiIconGhost} />
                            </div>
                            <p className={s.kpiValue}>{stats.totalSessions}</p>
                            <div style={{ height: '24px' }}><SparkLine data={kpiSparkData[1]} color="var(--primary)" width={80} height={24} /></div>
                        </div>

                        {/* Ticket Medio */}
                        <div className={s.kpiCard}>
                            <div className={s.kpiHeader}>
                                <p className={s.kpiLabel}>ticket médio</p>
                                <DollarSign size={16} className={s.kpiIconGhost} />
                            </div>
                            <p className={s.kpiValue}>{formatCurrency(stats.averageTicket)}</p>
                            <div className={s.kpiTrend} style={{ color: '#EF4444' }}>
                                <ArrowDownRight size={14} /> -2% <span style={{ opacity: 0.4, color: 'var(--foreground)' }}>vs. alvo</span>
                            </div>
                        </div>

                        {/* Ociosidade */}
                        <div className={s.kpiCard}>
                            <div className={s.kpiHeader}>
                                <p className={s.kpiLabel}>ociosidade</p>
                                <Zap size={16} className={s.kpiIconGhost} />
                            </div>
                            <p className={s.kpiValue}>{stats.tankIdlePercentage}%</p>
                            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.tankIdlePercentage}%`, height: '100%', backgroundColor: '#10B981' }} />
                            </div>
                        </div>
                    </div>

                    {/* Charts Row - 2 Columns */}
                    <div className={s.chartsGrid}>
                        {/* Revenue Chart - Wider */}
                        <div className={s.chartCard}>
                            <div className={s.chartHeader}>
                                <h3 className={s.sectionTitle}>distribuição de receita</h3>
                                <Button color="tertiary" size="sm" style={{ fontSize: '0.75rem' }}>detalhes</Button>
                            </div>
                            <div style={{ height: '220px' }}>
                                <SvgAreaChart data={mockRevenueData} labels={revenueLabels} color="var(--primary)" height={220} showGrid showDots />
                            </div>
                        </div>

                        {/* Top Services - Narrower */}
                        <div className={s.chartCard}>
                            <h3 className={s.sectionTitle} style={{ marginBottom: '16px' }}>top serviços</h3>
                            <div className={s.serviceList}>
                                {mockTopServices.map((svc, i) => (
                                    <div key={i} className={s.serviceItem}>
                                        <div className={s.serviceStats}>
                                            <span className={s.serviceName}>{svc.name.toLowerCase()}</span>
                                            <span className={s.serviceValue}>{svc.bookings}</span>
                                        </div>
                                        <div className={s.progressBarTrack}>
                                            <div
                                                className={s.progressBarFill}
                                                style={{
                                                    width: `${(svc.bookings / 84) * 100}%`,
                                                    backgroundColor: ['#0F172A', '#334155', '#64748B', '#94A3B8'][i]
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions & Feed */}
                <div className={s.adminColumnSidebar}>

                    {/* Live Feed / Actions */}
                    <div className={s.engagementCard}>
                        <div className={s.engagementHeader}>
                            <h3 className={s.sectionTitle}>engajamento</h3>
                            <span className={s.pendingBadge}>{mockActions.length} pendentes</span>
                        </div>

                        <div className={s.actionList}>
                            {mockActions.map((action, i) => {
                                const Icon = actionIcons[action.type] || Activity;
                                const isWinback = action.type === 'winback';
                                const bg = isWinback ? '#FEF2F2' : '#F8FAFC';
                                const accent = isWinback ? '#EF4444' : '#64748B';

                                return (
                                    <div key={i} className={s.actionItem} style={{ backgroundColor: bg, borderColor: isWinback ? 'rgba(239,68,68,0.1)' : 'transparent' }}>
                                        <div className={s.actionIconBox}>
                                            <Icon size={14} color={accent} />
                                        </div>
                                        <div className={s.actionContent}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>{action.clientName.toLowerCase()}</p>
                                            <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{action.detail}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <Button color="tertiary" className="w-full mt-4 text-xs opacity-50 hover:opacity-100">ver todos os alertas</Button>
                    </div>

                    {/* Mini Calendar / Status with Google Link */}
                    <div className={s.calendarCard}>
                        <div className={s.calendarHeader}>
                            <div className={s.calendarDateGroup}>
                                <Calendar size={16} className="opacity-60" />
                                <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>hoje</h3>
                            </div>
                            <a
                                href="https://calendar.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'white', opacity: 0.7, transition: 'opacity 0.2s' }}
                                title="Abrir Google Calendar"
                                className="hover:opacity-100"
                            >
                                <ExternalLink size={16} />
                            </a>
                        </div>
                        <div className={s.calendarStats}>
                            <div
                                className={s.appointmentCount}
                                onClick={() => setIsAppointmentModalOpen(true)}
                                title="Ver detalhes dos agendamentos"
                            >
                                <p className={s.bigNumber}>12</p>
                                <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>agendamentos</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>capacidade</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>85%</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Appointment Details Modal */}
            {isAppointmentModalOpen && (
                <div className={s.modalOverlay} onClick={() => setIsAppointmentModalOpen(false)}>
                    <div className={s.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={s.modalHeader}>
                            <h3 className={s.modalTitle}>agendamentos de hoje</h3>
                            <button onClick={() => setIsAppointmentModalOpen(false)} style={{ padding: '8px' }}><X size={20} /></button>
                        </div>

                        <div className={s.appointmentList}>
                            {mockAppointments.map(app => (
                                <div
                                    key={app.id}
                                    className={s.appointmentCard}
                                    onClick={() => router.push(`/admin/customers?id=${app.clientId}`)}
                                >
                                    <div className={s.timeSlot}>
                                        <span className={s.timeText}>{app.time}</span>
                                        <span className={s.locationText}>{app.location}</span>
                                    </div>
                                    <div className={s.clientDetails}>
                                        <div className={s.clientHeader}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span className={s.clientName}>{app.clientName}</span>
                                                <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                                                    <span className={s.levelBadge}>{app.clientLevel}</span>
                                                </div>
                                            </div>
                                            {/* Setup Icons */}
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                {app.setup.music && <Music size={14} className="text-blue-500" />}
                                                {app.setup.lights && <Zap size={14} className="text-yellow-500" />}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.7rem', fontWeight: 600 }}>
                                                    <Thermometer size={12} /> {app.setup.temperature}°
                                                </div>
                                            </div>
                                        </div>

                                        <div className={s.clientStatsGrid}>
                                            <div className={s.statPair}>
                                                <span className={s.statValue}>{app.stats.floats}</span>
                                                <span className={s.statLabel}>floats</span>
                                            </div>
                                            <div className={s.statPair}>
                                                <span className={s.statValue}>{app.stats.massages}</span>
                                                <span className={s.statLabel}>massagens</span>
                                            </div>
                                            <div className={s.statPair}>
                                                <span className={s.statValue}>{app.stats.purchases}</span>
                                                <span className={s.statLabel}>compras</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
