'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import Link from 'next/link';

const timeSlots = ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00', '17:30', '19:00'];

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const dates = useMemo(() => {
        const result: { date: Date; value: string; day: number; weekday: string; monthLabel: string }[] = [];
        const today = new Date();
        for (let i = 1; i <= 21; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            if (d.getDay() === 0) continue;
            result.push({
                date: d,
                value: d.toISOString().split('T')[0],
                day: d.getDate(),
                weekday: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
                monthLabel: d.toLocaleDateString('pt-BR', { month: 'short' }),
            });
        }
        return result;
    }, []);

    const availabilityMap = useMemo(() => {
        const map: Record<string, boolean[]> = {};
        dates.forEach(d => {
            map[d.value] = timeSlots.map(() => Math.random() > 0.3);
        });
        return map;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentAvailability = selectedDate ? (availabilityMap[selectedDate] || []) : [];
    const currentMonth = dates.length > 0 ? dates[0].date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : '';

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: 'var(--space-7) var(--space-5)' }}>
            <div style={{ marginBottom: 'var(--space-7)' }}>
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>agendar sessão</h1>
                <p style={{ opacity: 0.5, marginTop: 'var(--space-2)' }}>escolha o melhor dia e horário para sua flutuação</p>
            </div>

            {/* Calendar */}
            <Card  padding="lg" style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>
                        {currentMonth}
                    </h3>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--font-size-xs)', opacity: 0.4 }}>
                        <span>● disponível</span>
                        <span style={{ opacity: 0.5 }}>● lotado</span>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
                    gap: 'var(--space-2)',
                }}>
                    {dates.map(d => {
                        const isSelected = selectedDate === d.value;
                        const hasSlots = (availabilityMap[d.value] || []).some(Boolean);
                        return (
                            <button
                                key={d.value}
                                onClick={() => { setSelectedDate(d.value); setSelectedSlot(null); }}
                                style={{
                                    padding: 'var(--space-3) var(--space-2)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                    backgroundColor: isSelected ? 'rgba(0,102,255,0.06)' : !hasSlots ? 'var(--border)' : 'var(--surface)',
                                    cursor: hasSlots ? 'pointer' : 'not-allowed',
                                    opacity: hasSlots ? 1 : 0.35,
                                    textAlign: 'center',
                                    transition: 'all var(--duration-fast)',
                                }}
                            >
                                <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', opacity: 0.4, display: 'block', fontWeight: 600 }}>{d.weekday}</span>
                                <span style={{
                                    fontSize: 'var(--font-size-lg)', fontWeight: 600, fontFamily: 'var(--font-display)',
                                    color: isSelected ? 'var(--primary)' : 'var(--foreground)',
                                    display: 'block', lineHeight: 1.6,
                                }}>
                                    {d.day}
                                </span>
                                <span style={{ fontSize: '0.55rem', opacity: 0.3, textTransform: 'uppercase' }}>{d.monthLabel}</span>
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Time Slots */}
            {selectedDate && (
                <Card  padding="lg" style={{ marginBottom: 'var(--space-5)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-5)', opacity: 0.6 }}>
                        horários disponíveis
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
                        {timeSlots.map((slot, i) => {
                            const available = currentAvailability[i];
                            const isSelected = selectedSlot === slot;
                            return (
                                <button
                                    key={slot}
                                    onClick={() => available && setSelectedSlot(slot)}
                                    disabled={!available}
                                    style={{
                                        padding: 'var(--space-4)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                        backgroundColor: isSelected ? 'rgba(0,102,255,0.06)' : !available ? 'var(--border)' : 'var(--surface)',
                                        cursor: available ? 'pointer' : 'not-allowed',
                                        opacity: available ? 1 : 0.3,
                                        fontWeight: 600,
                                        fontSize: 'var(--font-size-sm)',
                                        fontFamily: 'var(--font-display)',
                                        color: isSelected ? 'var(--primary)' : 'var(--foreground)',
                                        transition: 'all var(--duration-fast)',
                                    }}
                                >
                                    {slot}
                                </button>
                            );
                        })}
                    </div>
                </Card>
            )}

            {/* Summary & CTA */}
            {selectedSlot && selectedDate && (
                <Card  padding="lg">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                        <div>
                            <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>sessão selecionada</span>
                            <p style={{ fontSize: 'var(--font-size-xs)', opacity: 0.5, marginTop: '2px' }}>
                                {new Date(selectedDate + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', weekday: 'long' })} às {selectedSlot}
                            </p>
                        </div>
                    </div>
                    <Link href="/checkout">
                        <Button color="primary" size="lg" fullWidth>continuar para checkout</Button>
                    </Link>
                </Card>
            )}
        </div>
    );
}
