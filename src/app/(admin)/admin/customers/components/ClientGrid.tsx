'use client';

import { ClientProps } from '@/domain/entities/Client';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface ClientGridProps {
    clients: ClientProps[];
    onSelect: (client: ClientProps) => void;
    loading?: boolean;
}

const formatDate = (d: Date | string | undefined) => d ? new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

export function ClientGrid({ clients, onSelect, loading }: ClientGridProps) {
    if (loading) {
        return (
            <div className="w-full space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-lg" />
                ))}
            </div>
        );
    }

    if (clients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                <p>Nenhum cliente encontrado</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Cliente</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Sessões</th>
                        <th className="px-6 py-4">Gasto Total</th>
                        <th className="px-6 py-4">Última Visita</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {clients.map((client) => (
                        <tr
                            key={client.id}
                            onClick={() => onSelect(client)}
                            className="hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Avatar src={client.photoUrl} alt={client.fullName} fallback={client.fullName} size="sm" />
                                    <div>
                                        <div className="font-medium text-gray-900">{client.fullName}</div>
                                        <div className="text-sm text-gray-500">{client.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <Badge
                                    intent={
                                        client.lifeCycleStage === 'active' ? 'success' :
                                            client.lifeCycleStage === 'new' ? 'brand' :
                                                client.lifeCycleStage === 'churned' ? 'error' : 'gray'
                                    }
                                >
                                    {client.lifeCycleStage || 'Unknown'}
                                </Badge>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-900 font-medium">{client.totalSessions}</span>
                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-brand-600"
                                            style={{ width: `${Math.min(client.totalSessions * 5, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                {formatCurrency(client.totalSpent)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {formatDate(client.lastVisit)}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <ChevronRight size={16} className="text-gray-400 group-hover:text-brand-600 transition-colors" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
