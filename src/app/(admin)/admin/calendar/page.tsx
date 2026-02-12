'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { CalendarView, CalendarBlockedSlot, CalendarOperatingHours } from '@/components/features/calendar/CalendarView';
import type { AppointmentProps } from '@/domain/entities/Appointment';

interface Location {
    id: string;
    name: string;
}

const DAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export default function CalendarPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [blockedSlots, setBlockedSlots] = useState<CalendarBlockedSlot[]>([]);
    const [operatingHours, setOperatingHours] = useState<CalendarOperatingHours[]>([]);
    const [appointments, setAppointments] = useState<AppointmentProps[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [showBlockForm, setShowBlockForm] = useState(false);
    const [showHoursForm, setShowHoursForm] = useState(false);
    const [blockForm, setBlockForm] = useState({ startTime: '', endTime: '', reason: '', recurring: false });
    const [hoursForm, setHoursForm] = useState<{ dayOfWeek: number; openTime: string; closeTime: string }>({ dayOfWeek: 0, openTime: '09:00', closeTime: '21:00' });

    const fetchLocations = useCallback(async () => {
        const res = await fetch('/api/locations?page=1&limit=50');
        const data = await res.json();
        setLocations(data.data || []);
        if (data.data?.length && !selectedLocation) setSelectedLocation(data.data[0].id);
    }, [selectedLocation]);

    const fetchData = useCallback(async () => {
        if (!selectedLocation) return;
        const [blocksRes, hoursRes, apptsRes] = await Promise.all([
            fetch(`/api/calendar/blocked-slots?page=1&limit=100&locationId=${selectedLocation}`),
            fetch(`/api/calendar/operating-hours?locationId=${selectedLocation}`),
            fetch(`/api/appointments?page=1&limit=100&locationId=${selectedLocation}`) // Assuming this EP exists/filters
        ]);

        const blocksData = await blocksRes.json();
        const hoursData = await hoursRes.json();
        const apptsData = await apptsRes.json(); // Assuming structure

        setBlockedSlots(blocksData.data || []);
        setOperatingHours(hoursData || []);
        setAppointments(apptsData.data || []); // Safety check if endpoint works differently
    }, [selectedLocation]);

    useEffect(() => { fetchLocations(); }, [fetchLocations]);
    useEffect(() => { fetchData(); }, [fetchData]);

    const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
        const newDate = new Date(currentDate);
        if (direction === 'prev') newDate.setDate(newDate.getDate() - 7);
        else if (direction === 'next') newDate.setDate(newDate.getDate() + 7);
        else newDate.setTime(Date.now());
        setCurrentDate(newDate);
    };

    const handleSlotClick = (date: Date) => {
        setBlockForm({ ...blockForm, startTime: date.toISOString().slice(0, 16), endTime: new Date(date.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16) });
        setShowBlockForm(true);
    };

    const handleBlockSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/calendar/blocked-slots', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                locationId: selectedLocation,
                startTime: new Date(blockForm.startTime).toISOString(),
                endTime: new Date(blockForm.endTime).toISOString(),
                reason: blockForm.reason,
                recurring: blockForm.recurring,
            }),
        });
        setBlockForm({ startTime: '', endTime: '', reason: '', recurring: false });
        setShowBlockForm(false);
        fetchData();
    };

    const handleDeleteBlock = async (id: string) => {
        await fetch(`/api/calendar/blocked-slots?id=${id}`, { method: 'DELETE' });
        fetchData();
    };

    const handleHoursSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/calendar/operating-hours', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `${selectedLocation}_${hoursForm.dayOfWeek}`,
                locationId: selectedLocation,
                dayOfWeek: hoursForm.dayOfWeek,
                openTime: hoursForm.openTime,
                closeTime: hoursForm.closeTime,
                active: true,
            }),
        });
        setShowHoursForm(false);
        fetchData();
    };

    return (
        <div>
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase' }}>Gestão de Calendário</h1>
                    <p style={{ opacity: 0.5 }}>Bloqueios e horários de funcionamento.</p>
                </div>
                <div style={{ width: '250px' }}>
                    <label style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Filial</label>
                    <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: 'var(--border-thin)', color: 'inherit', borderRadius: '4px' }}>
                        {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <CalendarView
                    currentDate={currentDate}
                    onNavigate={handleNavigate}
                    onSlotClick={handleSlotClick}
                    onBlockClick={(b) => handleDeleteBlock(b.id)} // Click to delete for now
                    appointments={appointments}
                    blockedSlots={blockedSlots}
                    operatingHours={operatingHours}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Operating Hours Form */}
                <Card  padding="lg">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Horários de Funcionamento</h3>
                        <Button color="secondary" size="sm" onClick={() => setShowHoursForm(!showHoursForm)}>+ Definir</Button>
                    </div>
                    {showHoursForm && (
                        <form onSubmit={handleHoursSubmit} style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
                            <select value={hoursForm.dayOfWeek} onChange={e => setHoursForm({ ...hoursForm, dayOfWeek: Number(e.target.value) })} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white' }}>
                                {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                            </select>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Input type="time" value={hoursForm.openTime} onChange={e => setHoursForm({ ...hoursForm, openTime: e.target.value })} />
                                <Input type="time" value={hoursForm.closeTime} onChange={e => setHoursForm({ ...hoursForm, closeTime: e.target.value })} />
                            </div>
                            <Button color="success" size="sm" type="submit">Salvar</Button>
                        </form>
                    )}
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {DAYS.map((day, idx) => {
                            const hours = operatingHours.find(h => h.dayOfWeek === idx);
                            return (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: hours ? 1 : 0.4 }}>
                                    <span>{day}</span>
                                    <span>{hours ? `${hours.openTime} - ${hours.closeTime}` : 'Fechado'}</span>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Blocked Slots Form */}
                <Card  padding="lg">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Bloqueios</h3>
                        <Button color="secondary" size="sm" onClick={() => setShowBlockForm(!showBlockForm)}>+ Bloquear</Button>
                    </div>
                    {showBlockForm && (
                        <form onSubmit={handleBlockSubmit} style={{ display: 'grid', gap: '1rem' }}>
                            <div><label style={{ fontSize: '0.7rem' }}>Início</label><Input type="datetime-local" value={blockForm.startTime} onChange={e => setBlockForm({ ...blockForm, startTime: e.target.value })} /></div>
                            <div><label style={{ fontSize: '0.7rem' }}>Fim</label><Input type="datetime-local" value={blockForm.endTime} onChange={e => setBlockForm({ ...blockForm, endTime: e.target.value })} /></div>
                            <Input placeholder="Motivo" value={blockForm.reason} onChange={e => setBlockForm({ ...blockForm, reason: e.target.value })} />
                            <Button color="success" size="sm" type="submit">Bloquear</Button>
                        </form>
                    )}
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {blockedSlots.map(slot => (
                            <div key={slot.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
                                <div>
                                    <div style={{ fontWeight: 700 }}>{new Date(slot.startTime).toLocaleDateString()}</div>
                                    <div style={{ opacity: 0.7 }}>{new Date(slot.startTime).toLocaleTimeString()} - {new Date(slot.endTime).toLocaleTimeString()}</div>
                                    <div style={{ color: 'var(--void-blaze-orange)' }}>{slot.reason}</div>
                                </div>
                                <Button color="secondary" size="sm" onClick={() => handleDeleteBlock(slot.id)}>×</Button>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
