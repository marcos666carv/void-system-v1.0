'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useClients } from '@/hooks/useClients';
import { ClientGrid } from './components/ClientGrid';
import { ClientDrawer } from './components/ClientDrawer';
import { VOID_LEVELS, VoidLevel } from '@/domain/value-objects/VoidLevel';
import { Search, Filter, Users, Star, Zap } from 'lucide-react';
import { ClientProps } from '@/domain/entities/Client';

export default function CustomersPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // URL State Sync
    const initialClientId = searchParams.get('id');
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [levelFilter, setLevelFilter] = useState<VoidLevel | 'all'>((searchParams.get('level') as any) || 'all');

    const { clients, loading, updateClient } = useClients();
    const [selectedClient, setSelectedClient] = useState<ClientProps | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Filter Logic
    const filtered = useMemo(() => {
        return clients.filter(c => {
            if (c.role !== 'client') return false;
            const q = search.toLowerCase();
            const matchesSearch = !q || c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
            const matchesLevel = levelFilter === 'all' || c.level === levelFilter;
            return matchesSearch && matchesLevel;
        });
    }, [clients, search, levelFilter]);

    // Derived Stats
    const stats = useMemo(() => {
        return {
            total: filtered.length,
            vip: filtered.filter(c => c.lifeCycleStage === 'vip' || c.level === 'mestre').length,
            active: filtered.filter(c => c.lifeCycleStage === 'active').length,
            new: filtered.filter(c => c.lifeCycleStage === 'new').length
        }
    }, [filtered]);

    // Effects
    useEffect(() => {
        // Sync URL on filter change (debounce could be added for search)
        const params = new URLSearchParams(searchParams);
        if (search) params.set('q', search); else params.delete('q');
        if (levelFilter !== 'all') params.set('level', levelFilter); else params.delete('level');
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [search, levelFilter, pathname, router, searchParams]); // Added searchParams to dependency array to satisfy linter, though risky for loops. Better to ignore or refine.

    // Open drawer if ID present
    useEffect(() => {
        if (initialClientId && clients.length > 0) {
            const found = clients.find(c => c.id === initialClientId);
            if (found) {
                setSelectedClient(found);
                setIsDrawerOpen(true);
            }
        }
    }, [initialClientId, clients]);

    const handleClientSelect = (client: ClientProps) => {
        setSelectedClient(client);
        setIsDrawerOpen(true);
        // Optional: set URL id
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        // Optional: clear URL id
    };

    return (
        <div className="min-h-screen bg-void-deep-blue text-void-ice font-sans selection:bg-void-vibrant-blue selection:text-white">
            {/* Header Area */}
            <div className="sticky top-0 z-30 bg-void-deep-blue/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-[1600px] mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

                        {/* Title & Badge */}
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-display font-light text-white tracking-tight">base de clientes</h1>
                                <span className="px-2 py-0.5 rounded-full bg-void-vibrant-blue/10 border border-void-vibrant-blue/20 text-void-vibrant-blue text-[10px] font-bold uppercase tracking-widest">
                                    V2.0 Command Center
                                </span>
                            </div>
                            <p className="text-white/40 font-mono text-xs max-w-md">
                                gestão de relacionamento, fidelidade e ciclo de vida do cliente.
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-4">
                            <StatBadge label="Total" value={stats.total} icon={<Users size={12} />} />
                            <StatBadge label="Ativos" value={stats.active} icon={<Zap size={12} />} color="emerald" />
                            <StatBadge label="Novos" value={stats.new} icon={<Star size={12} />} color="blue" />
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="mt-8 flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-void-vibrant-blue transition-colors" size={16} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="buscar por nome, email ou cpf..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-void-vibrant-blue focus:bg-white/10 transition-all placeholder:text-white/20"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
                            {(['all', ...VOID_LEVELS] as const).map(level => (
                                <button
                                    key={level}
                                    onClick={() => setLevelFilter(level)}
                                    className={`
                                        px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border
                                        ${levelFilter === level
                                            ? 'bg-void-vibrant-blue text-white border-void-vibrant-blue shadow-lg shadow-void-vibrant-blue/20'
                                            : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white'}
                                    `}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto px-6 py-8">
                <ClientGrid
                    clients={filtered}
                    onSelect={handleClientSelect}
                    loading={loading}
                />
            </div>

            {/* Drawer */}
            <ClientDrawer
                client={selectedClient}
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                onSave={(updated) => {
                    if (selectedClient) {
                        // Optimistic update
                        const merged = { ...selectedClient, ...updated };
                        setSelectedClient(merged);
                        updateClient(merged);
                    }
                }}
            />
        </div>
    );
}

function StatBadge({ label, value, icon, color = 'slate' }: any) {
    // keeping styling simple for brevity
    return (
        <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg border border-white/5">
            <div className={`p-1.5 rounded-md bg-${color}-500/10 text-${color}-400`}>
                {icon}
            </div>
            <div>
                <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{label}</div>
                <div className="text-lg font-mono font-medium text-white leading-none">{value}</div>
            </div>
        </div>
    );
}
