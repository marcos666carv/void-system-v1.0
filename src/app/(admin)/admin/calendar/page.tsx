'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { CalendarView, CalendarBlockedSlot, CalendarOperatingHours } from '@/components/features/calendar/CalendarView';
import type { AppointmentProps } from '@/domain/entities/Appointment';
import { Plus, X, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui';

interface Location {
    id: string;
    name: string;
}

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-display uppercase tracking-tight">Calendar</h1>
                    <p className="text-sm text-gray-500">Manage schedules, blocks, and operating hours.</p>
                </div>
                <div className="w-full sm:w-64">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Location</label>
                    <div className="relative">
                        <select
                            value={selectedLocation}
                            onChange={e => setSelectedLocation(e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 pr-8 shadow-sm"
                        >
                            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar View */}
            <div>
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

            {/* Management Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Operating Hours Form */}
                <Card padding="lg">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Clock className="text-brand-600" size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">Operating Hours</h3>
                        </div>
                        <Button intent="secondary" size="sm" onClick={() => setShowHoursForm(!showHoursForm)} leftIcon={<Plus size={16} />}>
                            Add
                        </Button>
                    </div>

                    {showHoursForm && (
                        <form onSubmit={handleHoursSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Day of Week</label>
                                <select
                                    value={hoursForm.dayOfWeek}
                                    onChange={e => setHoursForm({ ...hoursForm, dayOfWeek: Number(e.target.value) })}
                                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 p-2.5"
                                >
                                    {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Open" type="time" value={hoursForm.openTime} onChange={e => setHoursForm({ ...hoursForm, openTime: e.target.value })} />
                                <Input label="Close" type="time" value={hoursForm.closeTime} onChange={e => setHoursForm({ ...hoursForm, closeTime: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button intent="tertiary" size="sm" onClick={() => setShowHoursForm(false)}>Cancel</Button>
                                <Button intent="primary" size="sm" type="submit">Save Hours</Button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-2">
                        {DAYS.map((day, idx) => {
                            const hours = operatingHours.find(h => h.dayOfWeek === idx);
                            return (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                    <span className="text-sm font-medium text-gray-700">{day}</span>
                                    {hours ? (
                                        <Badge intent="success">{hours.openTime} - {hours.closeTime}</Badge>
                                    ) : (
                                        <Badge intent="gray">Closed</Badge>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Blocked Slots Form */}
                <Card padding="lg">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="text-error-600" size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">Blocked Slots</h3>
                        </div>
                        <Button intent="secondary" size="sm" onClick={() => setShowBlockForm(!showBlockForm)} leftIcon={<Plus size={16} />}>
                            Block
                        </Button>
                    </div>

                    {showBlockForm && (
                        <form onSubmit={handleBlockSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Start" type="datetime-local" value={blockForm.startTime} onChange={e => setBlockForm({ ...blockForm, startTime: e.target.value })} />
                                <Input label="End" type="datetime-local" value={blockForm.endTime} onChange={e => setBlockForm({ ...blockForm, endTime: e.target.value })} />
                            </div>
                            <Input label="Reason" placeholder="e.g. Maintenance" value={blockForm.reason} onChange={e => setBlockForm({ ...blockForm, reason: e.target.value })} />
                            <div className="flex justify-end gap-2">
                                <Button intent="tertiary" size="sm" onClick={() => setShowBlockForm(false)}>Cancel</Button>
                                <Button intent="primary" size="sm" type="submit">Confirm Block</Button>
                            </div>
                        </form>
                    )}

                    <div className="max-h-[400px] overflow-y-auto space-y-3 custom-scrollbar pr-2">
                        {blockedSlots.length === 0 && (
                            <div className="text-center py-8 text-gray-400 text-sm">No blocking rules active.</div>
                        )}
                        {blockedSlots.map(slot => (
                            <div key={slot.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-error-200 transition-colors">
                                <div>
                                    <div className="font-semibold text-gray-900 text-sm">{new Date(slot.startTime).toLocaleDateString()}</div>
                                    <div className="text-xs text-gray-500 mb-1">{new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    <div className="text-xs text-error-600 font-medium">{slot.reason}</div>
                                </div>
                                <button
                                    onClick={() => handleDeleteBlock(slot.id)}
                                    className="p-1 text-gray-400 hover:text-error-600 rounded-md hover:bg-error-50 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
