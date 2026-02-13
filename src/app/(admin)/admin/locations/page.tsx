'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Input, Badge } from '@/components/ui';
import { MapPin, Plus, Store, CheckCircle, XCircle, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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
    const [loading, setLoading] = useState(true);

    const fetchLocations = useCallback(async () => {
        try {
            const res = await fetch('/api/locations?page=1&limit=50');
            const data = await res.json();
            setLocations(data.data || []);
        } catch (error) {
            console.error('Failed to fetch locations', error);
        } finally {
            setLoading(false);
        }
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
        try {
            if (editingLocation) {
                await fetch(`/api/locations/${editingLocation.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            } else {
                await fetch('/api/locations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            }
            resetForm();
            fetchLocations();
        } catch (error) {
            console.error('Failed to save location', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover esta filial?')) return;
        try {
            await fetch(`/api/locations/${id}`, { method: 'DELETE' });
            fetchLocations();
        } catch (error) {
            console.error('Failed to delete location', error);
        }
    };

    if (loading) return (
        <div className="p-10 flex items-center justify-center">
            <p className="text-fg-tertiary animate-pulse">carregando locais...</p>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto pb-10 flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-display text-fg-primary tracking-tight uppercase">Locais</h1>
                    <p className="text-sm text-fg-tertiary font-medium">Filiais Void Float e suas configurações.</p>
                </div>
                <Button intent="primary" onClick={() => { resetForm(); setShowForm(true); }}>
                    <Plus size={16} className="mr-2" />
                    Nova Filial
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl p-6 border-border-secondary shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-fg-primary uppercase tracking-wider mb-6">
                            {editingLocation ? 'Editar Filial' : 'Nova Filial'}
                        </h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-fg-secondary uppercase tracking-wider">Nome</label>
                                    <Input
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        required
                                        placeholder="Ex: Void Batel"
                                        className="bg-bg-secondary border-border-secondary"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-fg-secondary uppercase tracking-wider">Cidade</label>
                                    <Input
                                        value={form.city}
                                        onChange={e => setForm({ ...form, city: e.target.value })}
                                        required
                                        placeholder="Ex: Curitiba"
                                        className="bg-bg-secondary border-border-secondary"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-fg-secondary uppercase tracking-wider">Endereço</label>
                                <Input
                                    value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                    required
                                    placeholder="Ex: Av. Batel, 1230"
                                    className="bg-bg-secondary border-border-secondary"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-secondary">
                                <Button intent="secondary" type="button" onClick={resetForm}>Cancelar</Button>
                                <Button intent="primary" type="submit">{editingLocation ? 'Salvar Alterações' : 'Criar Filial'}</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map(loc => (
                    <Card key={loc.id} className="p-6 border-border-secondary hover:border-border-primary transition-colors group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-3">
                                <div className="p-2.5 bg-bg-secondary rounded-lg text-fg-brand-primary h-fit">
                                    <Store size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-fg-primary font-display">{loc.name}</h3>
                                    <div className="flex items-center gap-1.5 text-sm text-fg-tertiary mt-1">
                                        <MapPin size={12} />
                                        <span>{loc.city}</span>
                                    </div>
                                </div>
                            </div>
                            <Badge
                                intent={loc.active ? "success" : "warning"}
                                className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider"
                            >
                                {loc.active ? 'Ativa' : 'Inativa'}
                            </Badge>
                        </div>

                        <p className="text-sm text-fg-secondary mb-6 pl-12 border-l-2 border-border-secondary ml-3 py-1">
                            {loc.address}
                        </p>

                        <div className="flex gap-3 mt-auto">
                            <Button
                                intent="secondary"
                                size="sm"
                                className="w-full justify-center group-hover:bg-bg-secondary transition-colors"
                                onClick={() => openEdit(loc)}
                            >
                                <Pencil size={14} className="mr-2" />
                                Editar
                            </Button>
                            <Button
                                intent="secondary"
                                size="sm"
                                className="w-full justify-center text-fg-error-primary hover:bg-bg-error-secondary hover:text-fg-error-primary hover:border-bg-error-secondary transition-colors"
                                onClick={() => handleDelete(loc.id)}
                            >
                                <Trash2 size={14} className="mr-2" />
                                Remover
                            </Button>
                        </div>
                    </Card>
                ))}

                {locations.length === 0 && !loading && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-border-secondary rounded-2xl text-fg-tertiary">
                        <Store size={48} className="mb-4 opacity-20" />
                        <p className="font-bold opacity-50">Nenhuma filial cadastrada.</p>
                        <Button intent="secondary" className="mt-4" onClick={() => setShowForm(true)}>Criar Primeira Filial</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
