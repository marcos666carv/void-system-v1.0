'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { VOID_LEVEL_CONFIG, xpToNextLevel, VoidLevel } from '@/domain/value-objects/VoidLevel';
import Link from 'next/link';

interface DashboardData {
    fullName: string;
    xp: number;
    level: VoidLevel;
    credits: number;
    creditType: string;
    upcomingBookings: { id: string; service: string; date: string; time: string; tank: string }[];
    recentSessions: { id: string; service: string; date: string; duration: number; completed: boolean }[];
}

const mockData: DashboardData = {
    fullName: 'Ana',
    xp: 3200,
    level: 'mestre',
    credits: 4,
    creditType: 'Flutuação 60min',
    upcomingBookings: [
        { id: '1', service: 'Flutuação 60min', date: '2026-02-14', time: '10:00', tank: 'Tank Zero-01' },
        { id: '2', service: 'Massagem + Float', date: '2026-02-18', time: '14:00', tank: 'Tank Zero-04' },
    ],
    recentSessions: [
        { id: '1', service: 'Flutuação 60min', date: '2026-02-08', duration: 60, completed: true },
        { id: '2', service: 'Flutuação 90min', date: '2026-02-01', duration: 90, completed: true },
        { id: '3', service: 'Flutuação 60min', date: '2026-01-25', duration: 60, completed: true },
        { id: '4', service: 'Flutuação 60min', date: '2026-01-18', duration: 60, completed: false },
    ],
};

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setData(mockData), 200);
        return () => clearTimeout(timer);
    }, []);

    if (!data) return <div style={{ padding: 'var(--space-7)' }}><p style={{ opacity: 0.5 }}>carregando...</p></div>;

    const progress = xpToNextLevel(data.xp);
    const config = VOID_LEVEL_CONFIG[data.level];

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 'var(--space-7)' }}>
                <p style={{ opacity: 0.5, fontSize: 'var(--font-size-sm)' }}>olá,</p>
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{data.fullName}</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
                {/* XP & Level */}
                <Card padding="lg">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: 'var(--radius-full)', backgroundColor: config.color }} />
                        <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: config.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {config.label}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontWeight: 600 }}>{data.xp} xp</span>
                        {progress.next && <span style={{ opacity: 0.4 }}>{progress.remaining} para {VOID_LEVEL_CONFIG[progress.next].label.toLowerCase()}</span>}
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', width: `${progress.progress}%`,
                            backgroundColor: config.color,
                            borderRadius: 'var(--radius-full)',
                            transition: 'width 0.8s var(--ease-antigravity)',
                        }} />
                    </div>
                    <p style={{ fontSize: 'var(--font-size-xs)', opacity: 0.3, marginTop: 'var(--space-2)' }}>{config.description}</p>
                </Card>

                {/* Credits */}
                <Card padding="lg">
                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.08em' }}>
                        créditos disponíveis
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                        <span style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
                            {String(data.credits).padStart(2, '0')}
                        </span>
                        <span style={{ opacity: 0.5, fontSize: 'var(--font-size-sm)' }}>{data.creditType}</span>
                    </div>
                    <Link href="/schedule" style={{ marginTop: 'var(--space-5)', display: 'block' }}>
                        <Button color="primary" size="md" className="w-full">agendar sessão</Button>
                    </Link>
                </Card>
            </div>

            {/* Upcoming Bookings */}
            <Card padding="lg" style={{ marginBottom: 'var(--space-5)' }}>
                <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-5)', opacity: 0.6 }}>
                    próximas sessões
                </h3>
                {data.upcomingBookings.length === 0 ? (
                    <p style={{ opacity: 0.4, fontSize: 'var(--font-size-sm)' }}>nenhuma sessão agendada</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {data.upcomingBookings.map(booking => (
                            <div key={booking.id} style={{
                                display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                                padding: 'var(--space-4)',
                                backgroundColor: 'var(--surface)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border)',
                            }}>
                                {/* Date block */}
                                <div style={{
                                    width: '50px', height: '50px',
                                    backgroundColor: 'rgba(0,102,255,0.06)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid rgba(0,102,255,0.12)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--primary)', lineHeight: 1 }}>
                                        {new Date(booking.date).getDate()}
                                    </span>
                                    <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', opacity: 0.5, fontWeight: 600 }}>
                                        {new Date(booking.date).toLocaleDateString('pt-BR', { month: 'short' })}
                                    </span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{booking.service}</span>
                                    <p style={{ fontSize: 'var(--font-size-xs)', opacity: 0.5, marginTop: '2px' }}>{booking.time} · {booking.tank}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Recent History */}
            <Card padding="lg">
                <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-5)', opacity: 0.6 }}>
                    histórico recente
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {data.recentSessions.map(session => (
                        <div key={session.id} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: 'var(--space-3) var(--space-4)',
                            backgroundColor: 'var(--surface)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <span style={{ fontSize: 'var(--font-size-lg)' }}>{session.completed ? '✅' : '❌'}</span>
                                <div>
                                    <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{session.service}</span>
                                    <p style={{ fontSize: 'var(--font-size-xs)', opacity: 0.5 }}>{session.duration}min</p>
                                </div>
                            </div>
                            <span style={{ fontSize: 'var(--font-size-xs)', opacity: 0.4 }}>
                                {new Date(session.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
