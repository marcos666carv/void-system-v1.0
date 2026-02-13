'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import Link from 'next/link';

interface Service {
    id: string;
    name: string;
    duration: number;
    price: number;
}

interface TimeSlot {
    time: string;
    available: boolean;
}

export default function SchedulePage() {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Fetch services on mount
    useEffect(() => {
        async function fetchServices() {
            try {
                const res = await fetch('/api/services');
                if (res.ok) {
                    const data = await res.json();
                    setServices(data);
                    if (data.length > 0) setSelectedService(data[0]);
                }
            } catch (error) {
                console.error('Failed to fetch services', error);
            }
        }
        fetchServices();
    }, []);

    // Fetch availability when date or service changes
    useEffect(() => {
        if (!selectedDate || !selectedService) return;
        const serviceId = selectedService.id;

        async function fetchAvailability() {
            setIsLoadingSlots(true);
            try {
                const res = await fetch(`/api/availability?date=${selectedDate}&serviceId=${serviceId}`);
                if (res.ok) {
                    const data = await res.json();
                    setSlots(data);
                }
            } catch (error) {
                console.error('Failed to fetch availability', error);
                setSlots([]);
            } finally {
                setIsLoadingSlots(false);
            }
        }
        fetchAvailability();
    }, [selectedDate, selectedService]);

    const dates = useMemo(() => {
        const result: { date: Date; value: string; day: number; weekday: string; monthLabel: string }[] = [];
        const today = new Date();
        for (let i = 0; i <= 21; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            if (d.getDay() === 0) continue; // Skip Sundays if closed
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

    const currentMonth = dates.length > 0 ? dates[0].date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : '';

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: 'var(--space-7) var(--space-5)' }}>
            <div style={{ marginBottom: 'var(--space-7)' }}>
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>agendar sessão</h1>
                <p style={{ opacity: 0.5, marginTop: 'var(--space-2)' }}>escolha o melhor dia e horário para sua flutuação</p>
            </div>

            {/* Service Selection */}
            {services.length > 0 && (
                <div style={{ marginBottom: 'var(--space-5)', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        {services.map(s => (
                            <button
                                key={s.id}
                                onClick={() => { setSelectedService(s); setSelectedSlot(null); }}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '999px',
                                    border: selectedService?.id === s.id ? '1px solid var(--foreground)' : '1px solid var(--border)',
                                    backgroundColor: selectedService?.id === s.id ? 'var(--foreground)' : 'transparent',
                                    color: selectedService?.id === s.id ? 'var(--background)' : 'var(--foreground)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Calendar */}
            <Card padding="lg" style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6 }}>
                        {currentMonth}
                    </h3>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
                    gap: 'var(--space-2)',
                }}>
                    {dates.map(d => {
                        const isSelected = selectedDate === d.value;
                        return (
                            <button
                                key={d.value}
                                onClick={() => { setSelectedDate(d.value); setSelectedSlot(null); }}
                                style={{
                                    padding: 'var(--space-3) var(--space-2)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                    backgroundColor: isSelected ? 'rgba(0,102,255,0.06)' : 'var(--surface)',
                                    cursor: 'pointer',
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
                <Card padding="lg" style={{ marginBottom: 'var(--space-5)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-5)', opacity: 0.6 }}>
                        horários disponíveis
                    </h3>
                    {isLoadingSlots ? (
                        <div style={{ opacity: 0.5, padding: '20px', textAlign: 'center' }}>Carregando...</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
                            {slots.length > 0 ? slots.map((slot) => {
                                const available = slot.available;
                                const isSelected = selectedSlot === slot.time;
                                return (
                                    <button
                                        key={slot.time}
                                        onClick={() => available && setSelectedSlot(slot.time)}
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
                                        {slot.time}
                                    </button>
                                );
                            }) : (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5 }}>Nenhum horário disponível</div>
                            )}
                        </div>
                    )}
                </Card>
            )}

            {/* Summary & CTA */}
            {selectedSlot && selectedDate && selectedService && (
                <Card padding="lg">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                        <div>
                            <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>sessão selecionada</span>
                            <p style={{ fontSize: 'var(--font-size-xs)', opacity: 0.5, marginTop: '2px' }}>
                                {selectedService.name} • {new Date(selectedDate + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', weekday: 'long' })} às {selectedSlot}
                            </p>
                        </div>
                    </div>
                    <Link href="/checkout">
                        <Button color="primary" size="lg" className="w-full">continuar para checkout</Button>
                    </Link>
                </Card>
            )}
        </div>
    );
}
