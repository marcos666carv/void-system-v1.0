'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, Zap } from 'lucide-react';

interface DashboardStats {
    totalRevenue: number;
    totalSessions: number;
    averageTicket: number;
    tankIdlePercentage: number;
}

const mockStats: DashboardStats = {
    totalRevenue: 0,
    totalSessions: 0,
    averageTicket: 0,
    tankIdlePercentage: 0,
};

const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
                    setStats(mockStats);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
                setStats(mockStats);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (isLoading || !stats) {
        return <div className="p-8 text-fg-tertiary animate-pulse">Carregando dashboard...</div>;
    }

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-display-sm font-bold text-fg-primary font-display tracking-tight uppercase">Dashboard Executivo</h1>
                    <p className="text-sm text-fg-tertiary">Visão geral de performance deste mês</p>
                </div>
                <div className="flex gap-2">
                    <Button intent="secondary" size="sm">Exportar Relatório</Button>
                    <Button intent="primary" size="sm">Novo Agendamento</Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue */}
                <Card className="flex flex-col justify-between p-6 border-border-secondary shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-fg-secondary uppercase tracking-wider">Receita Total</p>
                            <h3 className="text-3xl font-bold text-fg-primary mt-2 font-display">{formatCurrency(stats.totalRevenue)}</h3>
                        </div>
                        <div className="p-3 bg-bg-brand-secondary/10 rounded-xl text-fg-brand-primary border border-bg-brand-secondary/20">
                            <DollarSign size={22} />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center text-sm">
                        <Badge intent="success" className="mr-2 px-2 py-0.5">
                            <ArrowUpRight size={14} className="mr-1" /> 12%
                        </Badge>
                        <span className="text-fg-tertiary">vs mês anterior</span>
                    </div>
                </Card>

                {/* Sessions */}
                <Card className="flex flex-col justify-between p-6 border-border-secondary shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-fg-secondary uppercase tracking-wider">Sessões Totais</p>
                            <h3 className="text-3xl font-bold text-fg-primary mt-2 font-display">{stats.totalSessions}</h3>
                        </div>
                        <div className="p-3 bg-bg-secondary rounded-xl text-fg-primary border border-border-secondary">
                            <Users size={22} />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center text-sm">
                        <Badge intent="success" className="mr-2 px-2 py-0.5">
                            <ArrowUpRight size={14} className="mr-1" /> 8%
                        </Badge>
                        <span className="text-fg-tertiary">vs mês anterior</span>
                    </div>
                </Card>

                {/* Avg Ticket */}
                <Card className="flex flex-col justify-between p-6 border-border-secondary shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-fg-secondary uppercase tracking-wider">Ticket Médio</p>
                            <h3 className="text-3xl font-bold text-fg-primary mt-2 font-display">{formatCurrency(stats.averageTicket)}</h3>
                        </div>
                        <div className="p-3 bg-bg-secondary rounded-xl text-fg-primary border border-border-secondary">
                            <Activity size={22} />
                        </div>
                    </div>
                    <div className="mt-6 flex items-center text-sm">
                        <Badge intent="warning" className="mr-2 px-2 py-0.5">
                            <ArrowDownRight size={14} className="mr-1" /> 2%
                        </Badge>
                        <span className="text-fg-tertiary">vs meta</span>
                    </div>
                </Card>

                {/* Idle Capacity */}
                <Card className="flex flex-col justify-between p-6 border-border-secondary shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-fg-secondary uppercase tracking-wider">Ociosidade</p>
                            <h3 className="text-3xl font-bold text-fg-primary mt-2 font-display">{stats.tankIdlePercentage}%</h3>
                        </div>
                        <div className="p-3 bg-bg-error-secondary/10 rounded-xl text-fg-error-primary border border-bg-error-secondary/20">
                            <Zap size={22} />
                        </div>
                    </div>
                    <div className="mt-6 w-full bg-bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-fg-error-primary h-2 rounded-full"
                            style={{ width: `${stats.tankIdlePercentage}%` }}
                        />
                    </div>
                </Card>
            </div>

            {/* Content Area - Placeholder for Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 h-96 flex items-center justify-center border-border-secondary border-dashed bg-bg-secondary/30">
                    <p className="text-fg-tertiary font-medium">Gráfico de Receita (Placeholder)</p>
                </Card>
                <Card className="h-96 flex items-center justify-center border-border-secondary border-dashed bg-bg-secondary/30">
                    <p className="text-fg-tertiary font-medium">Top Serviços (Placeholder)</p>
                </Card>
            </div>
        </div>
    );
}
