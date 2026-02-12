import { useState, useEffect, useCallback } from 'react';
import { ClientProps } from '@/domain/entities/Client';
import { VoidLevel } from '@/domain/value-objects/VoidLevel';

interface UseClientsOptions {
    initialClientId?: string | null;
}

interface UseClientsResult {
    clients: ClientProps[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    updateClient: (updatedClient: ClientProps) => void;
}

export function useClients({ initialClientId }: UseClientsOptions = {}): UseClientsResult {
    const [clients, setClients] = useState<ClientProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClients = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/clients?pageSize=50');
            if (!response.ok) {
                throw new Error('Failed to fetch clients');
            }
            const data = await response.json();
            setClients(data.data ?? []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const updateClient = useCallback((updatedClient: ClientProps) => {
        setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    }, []);

    return {
        clients,
        loading,
        error,
        refetch: fetchClients,
        updateClient
    };
}
