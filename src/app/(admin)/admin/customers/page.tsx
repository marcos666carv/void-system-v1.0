'use client';
// Force update check

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useClients } from '@/hooks/useClients';
// Fix: Ensure components are exported clearly in index.ts or import directly if index has issues
import { ClientGrid } from './components/ClientGrid';
import { ClientDetailPanel } from './components/ClientDetailPanel';
import { VOID_LEVELS, VoidLevel } from '@/domain/value-objects/VoidLevel';
import { Search } from 'lucide-react';
import { ClientProps } from '@/domain/entities/Client';

export default function CustomersPage() {
    const searchParams = useSearchParams();
    const initialClientId = searchParams.get('id');
    const { clients, loading, updateClient } = useClients({ initialClientId });

    const [search, setSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState<VoidLevel | 'all'>('all');
    const [selectedClient, setSelectedClient] = useState<ClientProps | null>(null);

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

    // Derived State: Auto-select initial client if available
    useMemo(() => {
        if (!selectedClient && clientFound()) {
            setSelectedClient(clientFound() || null);
        }

        function clientFound() {
            if (initialClientId) return clients.find(c => c.id === initialClientId);
            if (filtered.length > 0) return filtered[0];
            return undefined;
        }
    }, [clients, initialClientId, filtered, selectedClient]);


    return (
        <div className="h-[calc(100vh-4rem)] bg-void-ice dark:bg-void-deep-blue flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex-none px-6 py-4 flex justify-between items-end border-b border-void-slate/10">
                <div>
                    <h1 className="text-2xl font-display font-light text-void-deep-blue dark:text-void-ice lowercase tracking-tight">
                        base de clientes
                    </h1>
                    <p className="text-xs font-mono text-void-slate uppercase tracking-widest mt-1 opacity-70">
                        gestão de relacionamento e fidelidade
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">

                {/* Left Column: Search & List (3/12) */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col border-r border-void-slate/10 bg-white/50 dark:bg-void-obsidian/20 backdrop-blur-sm">

                    {/* Controls */}
                    <div className="p-4 flex flex-col gap-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-void-slate" />
                            <input
                                placeholder="buscar cliente..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-white/5 border border-void-slate/20 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-void-vibrant-blue transition-all"
                            />
                        </div>

                        {/* Level Filter Tags */}
                        <div className="flex gap-1 overflow-x-auto pb-2 custom-scrollbar">
                            {(['all', ...VOID_LEVELS] as const).map(level => {
                                const isActive = levelFilter === level;
                                return (
                                    <button
                                        key={level}
                                        onClick={() => setLevelFilter(level)}
                                        className={`
                                            px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider whitespace-nowrap transition-all
                                            ${isActive
                                                ? 'bg-void-deep-blue text-white shadow-md'
                                                : 'bg-white/50 text-void-slate hover:bg-white border border-void-slate/10'}
                                        `}
                                    >
                                        {level}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 overflow-hidden">
                        <ClientGrid
                            clients={filtered}
                            selectedId={selectedClient ? selectedClient.id : undefined}
                            onSelect={setSelectedClient}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Right Column: Detail (9/12) */}
                <div className="col-span-12 md:col-span-8 lg:col-span-9 bg-void-deep-blue relative overflow-hidden p-6 flex items-center justify-center">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '32px 32px'
                        }}
                    />

                    <div className="w-full max-w-4xl h-full relative z-10">
                        <ClientDetailPanel
                            client={selectedClient}
                            onSave={(updatedFields) => {
                                if (selectedClient) {
                                    const merged = { ...selectedClient, ...updatedFields };
                                    setSelectedClient(merged);
                                    updateClient(merged);
                                    // Here you would trigger the actual API call
                                    // For now, it updates local state
                                }
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
