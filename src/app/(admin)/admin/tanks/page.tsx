'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { TankProps, TankStatus } from '@/domain/entities/Tank';
import { LocationProps } from '@/domain/entities/Location';
import { TankCard } from './TankCard';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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
            pumpOn: false
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

    if (loading) return (
        <div className="p-8 flex items-center justify-center">
            <p className="text-fg-tertiary animate-pulse">carregando tanques...</p>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto pb-10">
            {/* Header Compacto */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold tracking-tight text-fg-primary font-display">controle de tanques</h1>

                    {/* Compact Filters */}
                    <div className="flex gap-1 p-1 bg-surface rounded-full border border-border-secondary">
                        <button
                            onClick={() => setSelectedLocation('all')}
                            className={cn(
                                "px-3 py-1 rounded-full text-xs font-semibold transition-all",
                                selectedLocation === 'all'
                                    ? "bg-bg-primary text-fg-primary shadow-sm"
                                    : "text-fg-tertiary hover:text-fg-primary hover:bg-bg-secondary"
                            )}
                        >
                            todas
                        </button>
                        {locations.map(loc => (
                            <button
                                key={loc.id}
                                onClick={() => setSelectedLocation(loc.id)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-xs font-semibold transition-all",
                                    selectedLocation === loc.id
                                        ? "bg-bg-primary text-fg-primary shadow-sm"
                                        : "text-fg-tertiary hover:text-fg-primary hover:bg-bg-secondary"
                                )}
                            >
                                {loc.city.toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status Summary - Pills */}
                <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-full border border-border-secondary text-xs font-semibold">
                        <div className="w-1.5 h-1.5 rounded-full bg-fg-success-primary" />
                        <span className="text-fg-success-primary">{counts.in_use} ativos</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-full border border-border-secondary text-xs font-semibold">
                        <div className="w-1.5 h-1.5 rounded-full bg-fg-tertiary" />
                        <span className="text-fg-tertiary">{counts.ready} livres</span>
                    </div>
                    {(counts.issue > 0) && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-full border border-border-secondary text-xs font-semibold">
                            <div className="w-1.5 h-1.5 rounded-full bg-fg-warning-primary" />
                            <span className="text-fg-warning-primary">{counts.issue} atenção</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Denser Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-surface rounded-xl shadow-2xl relative border border-border-secondary p-6 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setSessionDialog(null)}
                            className="absolute top-4 right-4 text-fg-tertiary hover:text-fg-primary transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold mb-6 font-display text-fg-primary">configurar sessão</h2>
                        <div className="flex flex-col gap-5">
                            {[
                                { label: 'duração (min)', value: config.duration, key: 'duration' as const, min: 30, max: 120, step: 15 },
                                { label: 'música (min)', value: config.musicDuration, key: 'musicDuration' as const, min: 0, max: 30, step: 5 },
                                { label: 'volume (%)', value: config.volume, key: 'volume' as const, min: 0, max: 100, step: 5 },
                                { label: 'atraso início (min)', value: config.delayStart, key: 'delayStart' as const, min: 0, max: 15, step: 1 },
                            ].map(field => (
                                <div key={field.key}>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs font-bold text-fg-secondary uppercase tracking-wider">{field.label}</label>
                                        <span className="text-sm font-mono font-bold text-fg-primary">{field.value}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={field.min}
                                        max={field.max}
                                        step={field.step}
                                        value={field.value}
                                        onChange={e => setConfig(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                                        className="w-full accent-bg-brand-solid h-2 bg-bg-secondary rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            ))}
                            <div className="mt-4">
                                <Button intent="primary" className="w-full justify-center" onClick={() => sessionDialog && handleStartSession(sessionDialog)}>
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



