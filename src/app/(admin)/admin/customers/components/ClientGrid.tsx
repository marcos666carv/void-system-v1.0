'use client';

import { ClientProps } from '@/domain/entities/Client';
import { VOID_LEVEL_CONFIG } from '@/domain/value-objects/VoidLevel';
import { motion } from 'motion/react';
import { ChevronRight, Calendar, DollarSign, Activity } from 'lucide-react';

interface ClientGridProps {
    clients: ClientProps[];
    onSelect: (client: ClientProps) => void;
    loading?: boolean;
}

const formatDate = (d: Date | string | undefined) => d ? new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '-';
const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

export function ClientGrid({ clients, onSelect, loading }: ClientGridProps) {
    if (loading) {
        return (
            <div className="w-full space-y-2 p-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    if (clients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-void-slate opacity-40">
                <p>nenhum cliente encontrado</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header - Hidden on mobile, visible on desktop */}
            <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_1fr_50px] gap-4 px-6 py-3 text-[10px] uppercase font-bold tracking-widest text-white/30 sticky top-0 bg-void-deep-blue/95 backdrop-blur z-10 border-b border-white/5">
                <div>Cliente</div>
                <div>Status</div>
                <div>Sessões</div>
                <div>Gasto</div>
                <div>Última Visita</div>
                <div></div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
                {clients.map((client, index) => {
                    const config = VOID_LEVEL_CONFIG[client.level];

                    return (
                        <motion.div
                            key={client.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03, duration: 0.2 }}
                            onClick={() => onSelect(client)}
                            className="
                                group relative grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_1fr_1fr_50px] gap-4 px-6 py-4 items-center cursor-pointer
                                hover:bg-white/[0.02] transition-colors
                            "
                        >
                            {/* Actions overlay for visual feedback */}
                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-void-vibrant-blue opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Client Identity */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-transform group-hover:scale-105"
                                    style={{
                                        backgroundColor: `${config.color}15`,
                                        color: config.color,
                                    }}
                                >
                                    {client.fullName.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-white font-medium truncate group-hover:text-void-vibrant-blue transition-colors">
                                        {client.fullName.toLowerCase()}
                                    </h3>
                                    <p className="text-xs text-white/40 truncate font-mono">{client.email}</p>
                                </div>
                            </div>

                            {/* Status Pill */}
                            <div className="hidden md:block">
                                <span className={`
                                    inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                                    border border-white/10
                                    ${client.lifeCycleStage === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                                    ${client.lifeCycleStage === 'new' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                                    ${client.lifeCycleStage === 'churned' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                                    ${client.lifeCycleStage === 'vip' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                                    ${!client.lifeCycleStage ? 'bg-white/5 text-white/40' : ''}
                                `}>
                                    {client.lifeCycleStage || 'Active'}
                                </span>
                            </div>

                            {/* Sessions */}
                            <div className="hidden md:flex items-center gap-2">
                                <div className="w-8 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-void-vibrant-blue"
                                        style={{ width: `${Math.min(client.totalSessions * 5, 100)}%` }}
                                    />
                                </div>
                                <span className="text-sm font-mono text-white/70">{client.totalSessions}</span>
                            </div>

                            {/* Spent */}
                            <div className="hidden md:block">
                                <span className="text-sm font-mono text-white/70">{formatCurrency(client.totalSpent)}</span>
                            </div>

                            {/* Last Visit */}
                            <div className="hidden md:block">
                                <span className="text-xs text-white/50">{formatDate(client.lastVisit)}</span>
                            </div>

                            {/* Action Arrow */}
                            <div className="flex justify-end">
                                <ChevronRight className="text-void-vibrant-blue opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" size={18} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
