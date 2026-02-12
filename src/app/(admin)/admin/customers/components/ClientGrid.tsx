'use client';

import { ClientProps } from '@/domain/entities/Client';
import { VOID_LEVEL_CONFIG, VoidLevel } from '@/domain/value-objects/VoidLevel';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface ClientGridProps {
    clients: ClientProps[];
    selectedId?: string;
    onSelect: (client: ClientProps) => void;
    loading?: boolean;
}

export function ClientGrid({ clients, selectedId, onSelect, loading }: ClientGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-2 p-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-white/5 animate-pulse rounded-lg" />
                ))}
            </div>
        );
    }

    if (clients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-void-slate opacity-60">
                <p>nenhum cliente encontrado</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-2 p-2 overflow-y-auto h-full content-start">
            {clients.map((client, index) => {
                const config = VOID_LEVEL_CONFIG[client.level];
                const isSelected = selectedId === client.id;

                return (
                    <motion.div
                        key={client.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={() => onSelect(client)}
                        className={`
                            group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                            border border-transparent hover:border-white/10 hover:bg-white/5
                            ${isSelected ? 'bg-white/10 border-void-vibrant-blue/20 shadow-sm' : ''}
                        `}
                    >
                        {/* Avatar */}
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-inner"
                            style={{
                                backgroundColor: `${config.color}20`,
                                color: config.color,
                                boxShadow: isSelected ? `0 0 10px ${config.color}40` : 'none'
                            }}
                        >
                            {client.fullName.substring(0, 2).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <h3 className={`text-sm font-medium truncate ${isSelected ? 'text-void-vibrant-blue' : 'text-void-deep-blue dark:text-void-ice'}`}>
                                    {client.fullName.toLowerCase()}
                                </h3>
                                {isSelected && <ChevronRight size={14} className="text-void-vibrant-blue animate-pulse" />}
                            </div>
                            <p className="text-xs text-void-slate truncate">{client.email}</p>
                        </div>

                        {/* Level Indicator (Subtle) */}
                        <div
                            className="absolute right-0 top-0 bottom-0 w-1 rounded-r-xl transition-all duration-300"
                            style={{
                                backgroundColor: isSelected ? config.color : 'transparent',
                                opacity: isSelected ? 1 : 0
                            }}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
}
