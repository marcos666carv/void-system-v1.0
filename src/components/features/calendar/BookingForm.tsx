'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import type { ClientProps } from '@/domain/entities/Client';

interface BookingFormProps {
    date: Date;
    onSuccess: () => void;
    onCancel: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ date, onSuccess, onCancel }) => {
    const [clients, setClients] = useState<ClientProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        clientId: '',
        serviceId: 'prod_float_60',
        startTime: '',
        endTime: '',
    });

    useEffect(() => {
        fetch('/api/clients')
            .then(res => res.json())
            .then(result => setClients(result.data ?? result));

        const pad = (n: number) => n < 10 ? `0${n}` : n;
        const localIso = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:00`;
        setFormData(prev => ({ ...prev, startTime: localIso }));
    }, [date]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const startTime = new Date(formData.startTime);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: formData.clientId,
                    serviceId: formData.serviceId,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                }),
            });

            if (res.ok) {
                onSuccess();
            } else {
                const error = await res.json();
                alert(error.message ?? 'Failed to create booking');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', minWidth: '300px' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>client</label>
                <select
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        outline: 'none',
                    }}
                    required
                    value={formData.clientId}
                    onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                >
                    <option value="" disabled>select a client</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.fullName}</option>
                    ))}
                </select>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>service</label>
                <select
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        outline: 'none',
                    }}
                    value={formData.serviceId}
                    onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
                >
                    <option value="prod_float_60">flutuação (60min)</option>
                    <option value="prod_float_90">flutuação (90min)</option>
                </select>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>data & hora</label>
                <Input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    required
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="button" onClick={onCancel} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>cancelar</Button>
                <Button type="submit" disabled={loading} style={{ flex: 1 }}>
                    {loading ? 'agendando...' : 'confirmar agendamento'}
                </Button>
            </div>
        </form>
    );
};
