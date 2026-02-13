'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { TankProps, TankStatus } from '@/domain/entities/Tank';
import { LocationProps } from '@/domain/entities/Location';
import { TankCard } from './TankCard';
import { Users, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// ... (keep existing statusColors/Labels if still needed for summary, but moving logic to Card)

interface SessionConfig {
    duration: number;
    musicDuration: number;
    volume: number;
    delayStart: number;
}

export default function TanksPage() {
    const router = useRouter();
    const [tanks, setTanks] = useState<TankProps[]>([]);
    const [locations, setLocations] = useState<LocationProps[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    // Session Dialog State
    const [sessionDialog, setSessionDialog] = useState<string | null>(null);
    const [config, setConfig] = useState<SessionConfig>({ duration: 60, musicDuration: 10, volume: 70, delayStart: 5 });

    useEffect(() => {
        Promise.all([
            fetch('/api/tanks?pageSize=50').then(r => r.json()),
            fetch('/api/locations').then(r => r.json())
        ]).then(([tanksData, locsData]) => {
            // Enrich mock data with new fields if missing
            const enrichedTanks = (tanksData.data ?? []).map((t: any) => ({
                ...t,
                ledsOn: t.ledsOn ?? false,
                musicOn: t.musicOn ?? false,
                heaterOn: t.heaterOn ?? true,
                pumpOn: t.pumpOn ?? true,
                status: t.status as TankStatus
            }));
            setTanks(enrichedTanks);
            setLocations(locsData.data ?? []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const handleStartSession = (tankId: string) => {
        setTanks(prev => prev.map(t => t.id === tankId ? {
            ...t,
            status: 'in_use' as TankStatus,
            sessionTimeRemaining: config.duration,
            currentClient: { name: 'Cliente Avulso', photoUrl: '' },
            pumpOn: false, // Pump off during session
            ledsOn: true,
            musicOn: true
        } : t));
        setSessionDialog(null);
    };

    const handleStopSession = (tankId: string) => {
        setTanks(prev => prev.map(t => t.id === tankId ? {
            ...t,
            status: 'cleaning' as TankStatus,
            cleaningTimeRemaining: 20,
            sessionTimeRemaining: undefined,
            currentClient: undefined,
            pumpOn: true, // Pump on for cleaning
            ledsOn: false,
            musicOn: false
        } : t));
    };

    const handleStartCleaning = (tankId: string) => {
        setTanks(prev => prev.map(t => t.id === tankId ? {
            ...t,
            status: 'cleaning' as TankStatus,
            cleaningTimeRemaining: 20,
            pumpOn: true
        } : t));
    };

    const handleStopCleaning = (tankId: string) => {
        setTanks(prev => prev.map(t => t.id === tankId ? {
            ...t,
            status: 'ready' as TankStatus,
            cleaningTimeRemaining: undefined,
            pumpOn: false // Or keep enabled based on preference? Usually filtration runs often. Let's keep true if default.
            // Actually, usually pump runs for filtration. Let's leave it as is state-wise.
        } : t));
    };

    const handleToggleDevice = (tankId: string, device: 'leds' | 'music' | 'heater' | 'pump') => {
        setTanks(prev => prev.map(t => {
            if (t.id !== tankId) return t;
            const updates: Partial<TankProps> = {};
            if (device === 'leds') updates.ledsOn = !t.ledsOn;
            if (device === 'music') updates.musicOn = !t.musicOn;
            if (device === 'heater') updates.heaterOn = !t.heaterOn;
            if (device === 'pump') updates.pumpOn = !t.pumpOn;
            return { ...t, ...updates };
        }));
    };

    const handleToggleNightMode = (tankId: string) => {
        setTanks(prev => prev.map(t => t.id === tankId ? {
            ...t,
            status: t.status === 'night_mode' ? 'ready' : 'night_mode' as TankStatus
        } : t));
    };

    const filteredTanks = selectedLocation === 'all'
        ? tanks
        : tanks.filter(t => t.locationId === selectedLocation);

    // Recalculate counts with new status
    const counts = {
        in_use: filteredTanks.filter(t => t.status === 'in_use').length,
        ready: filteredTanks.filter(t => t.status === 'ready').length,
        issue: filteredTanks.filter(t => ['cleaning', 'maintenance', 'offline'].includes(t.status)).length,
        night: filteredTanks.filter(t => t.status === 'night_mode').length
    };

    if (loading) return <div style={{ padding: 'var(--space-5)' }}><p style={{ opacity: 0.5 }}>carregando tanques...</p></div>;

    return (
        <div style={{ maxWidth: '1600px', margin: '0 auto', paddingBottom: '40px' }}>
            {/* Header Compacto */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>controle de tanques</h1>

                    {/* Compact Filters */}
                    <div style={{ display: 'flex', gap: '8px', padding: '4px', backgroundColor: 'var(--surface)', borderRadius: '100px', border: '1px solid var(--border)' }}>
                        <button
                            onClick={() => setSelectedLocation('all')}
                            style={{
                                padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                                backgroundColor: selectedLocation === 'all' ? 'var(--foreground)' : 'transparent',
                                color: selectedLocation === 'all' ? 'var(--background)' : 'var(--foreground)',
                                opacity: selectedLocation === 'all' ? 1 : 0.6,
                                transition: 'all 0.2s'
                            }}
                        >
                            todas
                        </button>
                        {locations.map(loc => (
                            <button
                                key={loc.id}
                                onClick={() => setSelectedLocation(loc.id)}
                                style={{
                                    padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                                    backgroundColor: selectedLocation === loc.id ? 'var(--foreground)' : 'transparent',
                                    color: selectedLocation === loc.id ? 'var(--background)' : 'var(--foreground)',
                                    opacity: selectedLocation === loc.id ? 1 : 0.6,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {loc.city.toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status Summary - Pills */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: 'white', borderRadius: '100px', border: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 600 }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                        <span style={{ color: '#10B981', opacity: 1 }}>{counts.in_use} ativos</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: 'white', borderRadius: '100px', border: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 600 }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#94A3B8' }} />
                        <span style={{ opacity: 0.6 }}>{counts.ready} livres</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: 'white', borderRadius: '100px', border: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 600 }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                        <span style={{ opacity: 0.6 }}>{counts.issue} atenção</span>
                    </div>
                </div>
            </div>

            {/* Denser Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-4)' }}>
                {filteredTanks.map(tank => (
                    <TankCard
                        key={tank.id}
                        tank={tank}
                        onStartSession={() => setSessionDialog(tank.id)}
                        onStopSession={() => handleStopSession(tank.id)}
                        onStartCleaning={() => handleStartCleaning(tank.id)}
                        onStopCleaning={() => handleStopCleaning(tank.id)}
                        onToggleNightMode={() => handleToggleNightMode(tank.id)}
                        onToggleDevice={(device) => handleToggleDevice(tank.id, device)}
                        onViewDetails={() => router.push(`/admin/tanks/${tank.id}`)}
                    />
                ))}
            </div>

            {/* Session Dialog */}
            {sessionDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="outline-none max-w-md w-full p-6 bg-white dark:bg-void-obsidian rounded-xl shadow-2xl relative">
                        <button
                            onClick={() => setSessionDialog(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold mb-4">configurar sessão</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {[
                                { label: 'duração (min)', value: config.duration, key: 'duration' as const, min: 30, max: 120, step: 15 },
                                { label: 'música (min)', value: config.musicDuration, key: 'musicDuration' as const, min: 0, max: 30, step: 5 },
                                { label: 'volume (%)', value: config.volume, key: 'volume' as const, min: 0, max: 100, step: 5 },
                                { label: 'atraso início (min)', value: config.delayStart, key: 'delayStart' as const, min: 0, max: 15, step: 1 },
                            ].map(field => (
                                <div key={field.key}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>{field.label}</label>
                                        <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{field.value}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={field.min}
                                        max={field.max}
                                        step={field.step}
                                        value={field.value}
                                        onChange={e => setConfig(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                                    />
                                </div>
                            ))}
                            <div style={{ marginTop: 'var(--space-2)' }}>
                                <Button intent="primary" className="w-full" onClick={() => sessionDialog && handleStartSession(sessionDialog)}>
                                    iniciar sessão
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


