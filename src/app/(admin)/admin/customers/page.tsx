'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useClients } from '@/hooks/useClients';
import { ClientGrid } from './components/ClientGrid';
import { ClientDrawer } from './components/ClientDrawer';
import { VOID_LEVELS, VoidLevel } from '@/domain/value-objects/VoidLevel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClientProps } from '@/domain/entities/Client';
import { Search, Plus } from 'lucide-react';

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

    // Effects
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (search) params.set('q', search); else params.delete('q');
        if (levelFilter !== 'all') params.set('level', levelFilter); else params.delete('level');
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [search, levelFilter, pathname, router, searchParams]);

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
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-display">Clients</h1>
                    <p className="text-sm text-gray-500">Manage your recurring customers and loyalty program.</p>
                </div>
                <div className="flex gap-3">
                    <Button intent="secondary" leftIcon={<span className="text-lg">☁️</span>}>Import</Button>
                    <Button intent="primary" leftIcon={<Plus size={18} />}>Add Client</Button>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex-1 max-w-md">
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        leftIcon={<Search size={18} />}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                    <Button
                        size="sm"
                        intent={levelFilter === 'all' ? 'secondary' : 'tertiary'}
                        onClick={() => setLevelFilter('all')}
                        className={levelFilter === 'all' ? 'bg-gray-100' : ''}
                    >
                        All
                    </Button>
                    {VOID_LEVELS.map(level => (
                        <Button
                            key={level}
                            size="sm"
                            intent={levelFilter === level ? 'secondary' : 'tertiary'}
                            onClick={() => setLevelFilter(level)}
                            className={levelFilter === level ? 'bg-gray-100 capitalize' : 'capitalize'}
                        >
                            {level}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Data Grid */}
            <ClientGrid
                clients={filtered}
                onSelect={handleClientSelect}
                loading={loading}
            />

            {/* Detail Drawer */}
            <ClientDrawer
                client={selectedClient}
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                onSave={(updated) => {
                    if (selectedClient) {
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
    return null; // Deprecated in V2
}
