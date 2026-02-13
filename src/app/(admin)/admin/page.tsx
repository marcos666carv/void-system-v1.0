'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, Zap, Calendar } from 'lucide-react';

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
        return <div className="p-8 text-gray-500">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-display">Executive Dashboard</h1>
                    <p className="text-sm text-gray-500">Performance overview for this month</p>
                </div>
                <div className="flex gap-2">
                    <Button intent="secondary" size="sm">Export Report</Button>
                    <Button intent="primary" size="sm">New Booking</Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Revenue */}
                <Card className="flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalRevenue)}</h3>
                        </div>
                        <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <Badge intent="success" className="mr-2">
                            <ArrowUpRight size={12} className="mr-1" /> 12%
                        </Badge>
                        <span className="text-gray-500">vs last month</span>
                    </div>
                </Card>

                {/* Sessions */}
                <Card className="flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalSessions}</h3>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <Badge intent="success" className="mr-2">
                            <ArrowUpRight size={12} className="mr-1" /> 8%
                        </Badge>
                        <span className="text-gray-500">vs last month</span>
                    </div>
                </Card>

                {/* Avg Ticket */}
                <Card className="flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Average Ticket</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.averageTicket)}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Activity size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <Badge intent="error" className="mr-2">
                            <ArrowDownRight size={12} className="mr-1" /> 2%
                        </Badge>
                        <span className="text-gray-500">vs target</span>
                    </div>
                </Card>

                {/* Idle Capacity */}
                <Card className="flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Idle Capacity</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.tankIdlePercentage}%</h3>
                        </div>
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                            <Zap size={20} />
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
                        <div
                            className="bg-orange-500 h-1.5 rounded-full"
                            style={{ width: `${stats.tankIdlePercentage}%` }}
                        />
                    </div>
                </Card>
            </div>

            {/* Content Area - Placeholder for Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 h-96 flex items-center justify-center border-dashed">
                    <p className="text-gray-400">Revenue Chart Placeholder</p>
                </Card>
                <Card className="h-96 flex items-center justify-center border-dashed">
                    <p className="text-gray-400">Top Services Placeholder</p>
                </Card>
            </div>
        </div>
    );
}
