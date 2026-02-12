'use client';

import s from './AdminTankDetail.module.css';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Modal } from '@/components/ui-legacy/Modal';
import { TankProps, TankStatus } from '@/domain/entities/Tank';
import { ArrowLeft, Thermometer } from 'lucide-react';
import { TankActiveSession } from './components/TankActiveSession';
import { TankKPIs } from './components/TankKPIs';
import { TankMaintenance } from './components/TankMaintenance';
import { TankHistory } from './components/TankHistory';

// Status Config
const statusConfig: Record<TankStatus, { label: string; color: string }> = {
    ready: { label: 'livre', color: '#94A3B8' },
    in_use: { label: 'em sessão', color: '#10B981' },
    cleaning: { label: 'limpeza', color: '#EF4444' },
    maintenance: { label: 'manutenção', color: '#DC2626' },
    offline: { label: 'offline', color: '#64748B' },
    night_mode: { label: 'modo noturno', color: '#8B5CF6' }
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

    if (loading) return <div style={{ padding: '40px' }}>carregando...</div>;
    if (!tank) return <div style={{ padding: '40px' }}>não encontrado</div>;

    const status = statusConfig[tank.status] || statusConfig.offline;

    return (
        <div className={s.container}>
            {/* Header */}
            <div className={s.header}>
                <div className={s.headerLeft}>
                    <Button color="tertiary" onClick={() => router.push('/admin/tanks')} className={s.backButton}>
                        <ArrowLeft size={18} />
                    </Button>
                    <div className={s.titleContainer}>
                        <h1 className={s.title}>{tank.name?.toLowerCase() || 'tanque sem nome'}</h1>
                        <p className={s.subtitle}>
                            {tank.locationId === 'loc_curitiba' ? 'curitiba' : 'campo largo'} · {tank.installedAt ? new Date(tank.installedAt).getFullYear() : '2023'}
                        </p>
                    </div>
                </div>
                <div className={s.headerRight}>
                    <div className={s.statusBadge} style={{ borderColor: status.color + '40' }}>
                        <div className={s.statusDot} style={{ backgroundColor: status.color }} />
                        <span className={s.statusText}>{status.label}</span>
                    </div>
                    <div className={s.temperatureBadge}>
                        <Thermometer size={16} className="text-blue-500" />
                        <span className={s.temperatureValue}>{tank.temperature?.toFixed(1) || '35.5'}°c</span>
                    </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className={s.grid}>
                {/* Main Column */}
                <div className={s.mainColumn}>
                    <TankActiveSession tank={tank} onEndSession={handleEndSession} />
                    <TankKPIs tank={tank} />
                    <TankMaintenance parts={tank.parts || []} onIntervene={handleOpenMaintenance} />
                </div>

                {/* Sidebar Column */}
                <div className={s.sidebarColumn}>
                    <TankHistory history={tank.sessionHistory} />
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isMaintenanceModalOpen}
                onClose={() => setIsMaintenanceModalOpen(false)}
                title="manutenção de peça"
            >
                <div>
                    <div className={s.formGroup}>
                        <label className={s.label}>novo id / serial</label>
                        <input
                            type="text"
                            placeholder="ex: pump-2026-x9"
                            value={maintenanceForm.newPartId}
                            onChange={(e) => setMaintenanceForm(prev => ({ ...prev, newPartId: e.target.value }))}
                            className={s.input}
                        />
                    </div>
                    <div className={s.formGroup}>
                        <label className={s.label}>técnico</label>
                        <input
                            type="text"
                            placeholder="nome do responsável"
                            value={maintenanceForm.technician}
                            onChange={(e) => setMaintenanceForm(prev => ({ ...prev, technician: e.target.value }))}
                            className={s.input}
                        />
                    </div>
                    <div className={s.modalActions}>
                        <Button color="tertiary" onClick={() => setIsMaintenanceModalOpen(false)}>cancelar</Button>
                        <Button color="primary" onClick={handleConfirmMaintenance} disabled={!maintenanceForm.newPartId || !maintenanceForm.technician}>
                            confirmar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
