'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Badge } from '@/components/ui';
import { TankProps, TankStatus } from '@/domain/entities/Tank';
import { ArrowLeft, Thermometer, X } from 'lucide-react';
import { TankActiveSession } from './components/TankActiveSession';
import { TankKPIs } from './components/TankKPIs';
import { TankMaintenance } from './components/TankMaintenance';
import { TankHistory } from './components/TankHistory';
import { cn } from '@/lib/utils/cn';

// Status Config
const statusConfig: Record<TankStatus, { label: string; intent: "success" | "error" | "warning" | "gray" | "brand" }> = {
    ready: { label: 'livre', intent: 'success' },
    in_use: { label: 'em sessão', intent: 'error' },
    cleaning: { label: 'limpeza', intent: 'warning' },
    maintenance: { label: 'manutenção', intent: 'error' },
    offline: { label: 'offline', intent: 'gray' },
    night_mode: { label: 'modo noturno', intent: 'brand' }
};

export default function TankDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [tank, setTank] = useState<TankProps | null>(null);
    const [loading, setLoading] = useState(true);

    // Maintenance Modal State
    const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
    const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
    const [maintenanceForm, setMaintenanceForm] = useState({ newPartId: '', technician: '' });

    useEffect(() => {
        if (!params.id) return;
        fetch(`/api/tanks/${params.id}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch tank');
                return res.json();
            })
            .then(data => {
                const mockHistory = Array.from({ length: 15 }).map((_, i) => ({
                    id: `sess_${i}`,
                    clientId: `client_${i}`,
                    clientName: ['Alice Silva', 'Bruno Santos', 'Carla Diaz', 'Daniel Costa', 'Elena Lima'][i % 5],
                    clientPhotoUrl: i % 3 === 0 ? `https://i.pravatar.cc/150?u=${i}` : undefined,
                    clientCpf: '123.456.789-00',
                    date: new Date(Date.now() - i * 86400000),
                    duration: 60 + (i % 3) * 30,
                    isGift: i % 4 === 0
                }));

                const enrichedData: TankProps = {
                    ...data,
                    ledsOn: data.ledsOn ?? false,
                    musicOn: data.musicOn ?? false,
                    heaterOn: data.heaterOn ?? true,
                    pumpOn: data.pumpOn ?? true,
                    currentClient: data.currentClient ? {
                        ...data.currentClient,
                        name: data.currentClient.name.toLowerCase(),
                        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
                        isGift: false,
                        email: 'cliente@exemplo.com',
                        phone: '(41) 99999-9999',
                        cpf: '123.456.789-00',
                        level: 'mestre'
                    } : undefined,
                    parts: [
                        { id: 'p1', name: 'bomba de circulação silenciosa', serialNumber: 'SN-99887766', lastReplacedAt: new Date('2023-11-15T10:00:00Z'), lifespanHours: 5000, currentHours: 4200, status: 'warning' },
                        { id: 'p2', name: 'aquecedor de titânio', serialNumber: 'HT-11223344', lastReplacedAt: new Date('2024-01-20T14:30:00Z'), lifespanHours: 3000, currentHours: 1200, status: 'ok' },
                        { id: 'p3', name: 'filtro uv de alta potência', serialNumber: 'UV-55667788', lastReplacedAt: new Date('2024-02-10T09:00:00Z'), lifespanHours: 2000, currentHours: 1950, status: 'critical' }
                    ],
                    sessionHistory: mockHistory,
                    totalSessions: 142,
                    totalUsageHours: 1250,
                    totalIdleHours: 420,
                    energyConsumedKwh: 3450,
                    revenueGenerated: 18500
                };
                setTank(enrichedData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [params.id]);

    const handleOpenMaintenance = (partId: string) => {
        setSelectedPartId(partId);
        setMaintenanceForm({ newPartId: '', technician: '' });
        setIsMaintenanceModalOpen(true);
    };

    const handleConfirmMaintenance = () => {
        setIsMaintenanceModalOpen(false);
        if (tank && selectedPartId) {
            const updatedParts = tank.parts?.map(p =>
                p.id === selectedPartId ? { ...p, lastReplacedAt: new Date(), serialNumber: maintenanceForm.newPartId || p.serialNumber, currentHours: 0, status: 'ok' as const } : p
            );
            setTank({ ...tank, parts: updatedParts });
        }
    };

    const handleEndSession = () => {
        if (tank) {
            setTank({ ...tank, status: 'cleaning', sessionTimeRemaining: undefined, cleaningTimeRemaining: 20 });
        }
    };

    if (loading) return (
        <div className="p-10 flex items-center justify-center">
            <p className="text-fg-tertiary animate-pulse">carregando...</p>
        </div>
    );
    if (!tank) return <div className="p-10 text-fg-error-primary">não encontrado</div>;

    const status = statusConfig[tank.status] || statusConfig.offline;

    return (
        <div className="max-w-[1600px] mx-auto pb-10 flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <Button intent="secondary" onClick={() => router.push('/admin/tanks')} className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold font-display text-fg-primary tracking-tight">{tank.name?.toLowerCase() || 'tanque sem nome'}</h1>
                        <p className="text-sm text-fg-tertiary font-medium">
                            {tank.locationId === 'loc_curitiba' ? 'curitiba' : 'campo largo'} · {tank.installedAt ? new Date(tank.installedAt).getFullYear() : '2023'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge intent={status.intent} size="md" className="px-3 py-1">
                        {status.label}
                    </Badge>
                    <div className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-full border border-border-secondary shadow-sm">
                        <Thermometer size={16} className="text-fg-brand-primary" />
                        <span className="text-sm font-bold text-fg-primary">{tank.temperature?.toFixed(1) || '35.5'}°c</span>
                    </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
                {/* Main Column */}
                <div className="flex flex-col gap-6">
                    <TankActiveSession tank={tank} onEndSession={handleEndSession} />
                    <TankKPIs tank={tank} />
                    <TankMaintenance parts={tank.parts || []} onIntervene={handleOpenMaintenance} />
                </div>

                {/* Sidebar Column */}
                <div className="flex flex-col gap-6 h-full">
                    <TankHistory history={tank.sessionHistory} />
                </div>
            </div>

            {/* Modal */}
            {isMaintenanceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-surface rounded-xl shadow-2xl relative border border-border-secondary p-6 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsMaintenanceModalOpen(false)}
                            className="absolute top-4 right-4 text-fg-tertiary hover:text-fg-primary transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold mb-4 font-display text-fg-primary">manutenção de peça</h2>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-fg-secondary uppercase tracking-wider">novo id / serial</label>
                                <input
                                    type="text"
                                    placeholder="ex: pump-2026-x9"
                                    value={maintenanceForm.newPartId}
                                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, newPartId: e.target.value }))}
                                    className="w-full px-4 py-2 bg-bg-secondary rounded-lg border border-border-secondary focus:ring-2 focus:ring-focus-ring outline-none transition-all placeholder:text-fg-quaternary text-sm text-fg-primary"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-fg-secondary uppercase tracking-wider">técnico</label>
                                <input
                                    type="text"
                                    placeholder="nome do responsável"
                                    value={maintenanceForm.technician}
                                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, technician: e.target.value }))}
                                    className="w-full px-4 py-2 bg-bg-secondary rounded-lg border border-border-secondary focus:ring-2 focus:ring-focus-ring outline-none transition-all placeholder:text-fg-quaternary text-sm text-fg-primary"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <Button intent="secondary" onClick={() => setIsMaintenanceModalOpen(false)}>cancelar</Button>
                                <Button intent="primary" onClick={handleConfirmMaintenance} disabled={!maintenanceForm.newPartId || !maintenanceForm.technician}>
                                    confirmar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
