'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';

interface Location {
    id: string;
    name: string;
    address: string;
    city: string;
    active: boolean;
}

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [form, setForm] = useState({ name: '', address: '', city: '' });

    const fetchLocations = useCallback(async () => {
        const res = await fetch('/api/locations?page=1&limit=50');
        const data = await res.json();
        setLocations(data.data || []);
    }, []);

    useEffect(() => { fetchLocations(); }, [fetchLocations]);

    const resetForm = () => {
        setForm({ name: '', address: '', city: '' });
        setEditingLocation(null);
        setShowForm(false);
    };

    const openEdit = (loc: Location) => {
        setEditingLocation(loc);
        setForm({ name: loc.name, address: loc.address, city: loc.city });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingLocation) {
            await fetch(`/api/locations/${editingLocation.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        } else {
            await fetch('/api/locations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        }
        resetForm();
        fetchLocations();
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/locations/${id}`, { method: 'DELETE' });
        fetchLocations();
    };

    const thStyle: React.CSSProperties = { padding: '1.5rem 2rem', fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' };
    const tdStyle: React.CSSProperties = { padding: '1.5rem 2rem' };

    return (
        <div>
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase' }}>Locais</h1>
                    <p style={{ opacity: 0.5 }}>Filiais Void Float e suas configurações.</p>
                </div>
                <Button color="success" size="md" onClick={() => { resetForm(); setShowForm(true); }}>+ Nova Filial</Button>
            </div>

            {showForm && (
                <Card  padding="lg" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
                        {editingLocation ? 'Editar Filial' : 'Nova Filial'}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div><label style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>Nome</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                        <div><label style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>Cidade</label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required /></div>
                        <div><label style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>Endereço</label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required /></div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <Button color="secondary" size="md" type="button" onClick={resetForm}>Cancelar</Button>
                            <Button color="success" size="md" type="submit">{editingLocation ? 'Salvar' : 'Criar'}</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                {locations.map(loc => (
                    <Card key={loc.id}  padding="lg">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{loc.name}</h3>
                                <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{loc.address}</span>
                            </div>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 800, backgroundColor: loc.active ? 'rgba(191,255,0,0.1)' : 'rgba(255,92,0,0.1)', color: loc.active ? 'var(--void-neon-green)' : 'var(--void-blaze-orange)', border: `1px solid ${loc.active ? 'rgba(191,255,0,0.2)' : 'rgba(255,92,0,0.2)'}` }}>
                                {loc.active ? 'ATIVA' : 'INATIVA'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button color="success" size="sm" fullWidth onClick={() => openEdit(loc)}>Editar</Button>
                            <Button color="secondary" size="sm" fullWidth onClick={() => handleDelete(loc.id)}>Remover</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
