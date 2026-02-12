'use client';

import { useState, useEffect } from 'react';
import { ClientProps } from '@/domain/entities/Client';
import { VOID_LEVEL_CONFIG } from '@/domain/value-objects/VoidLevel';
import { motion, AnimatePresence } from 'motion/react';
import {
    Phone, Mail, CreditCard, Gift, Calendar, Clock, Star, Zap,
    MessageSquare, ShoppingBag, User, Edit2, X, Check, Activity
} from 'lucide-react';
import { Button } from '@/components/ui';

interface ClientDetailPanelProps {
    client: ClientProps | null;
    onSave?: (updatedClient: Partial<ClientProps>) => void;
}

const formatDate = (d: Date | string | undefined) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';
const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

export function ClientDetailPanel({ client, onSave }: ClientDetailPanelProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<ClientProps>>({});

    // Reset when client changes
    useEffect(() => {
        setIsEditing(false);
        setFormData({});
    }, [client?.id]);

    const handleSave = () => {
        if (onSave) {
            onSave(formData);
            setIsEditing(false);
        }
    };

    if (!client) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-void-slate opacity-40 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                <User size={64} strokeWidth={1} />
                <p className="mt-4 text-sm font-light">selecione um cliente para ver detalhes</p>
            </div>
        );
    }

    const config = VOID_LEVEL_CONFIG[client.level];
    const data = isEditing ? { ...client, ...formData } : client;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col gap-6 p-6 rounded-2xl border border-white/10 bg-void-obsidian text-void-ice shadow-2xl overflow-y-auto relative"
            >
                {/* Background Ambient Glow */}
                <div
                    className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-20 pointer-events-none"
                    style={{ background: config.color }}
                />

                {/* Header Actions */}
                <div className="absolute top-6 right-6 z-20 flex gap-2">
                    {isEditing ? (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSave}
                                className="px-4 py-2 bg-void-success text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-void-success/20 transition-all flex items-center gap-2"
                            >
                                <Check size={14} /> Salvar
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setIsEditing(false); setFormData({}); }}
                                className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                                <X size={14} /> Cancelar
                            </motion.button>
                        </>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setIsEditing(true); setFormData({ ...client }); }}
                            className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-semibold hover:bg-white/10 backdrop-blur-md transition-all flex items-center gap-2"
                        >
                            <Edit2 size={14} /> Editar
                        </motion.button>
                    )}
                </div>

                {/* Hero Profile */}
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg ring-1 ring-white/20"
                            style={{ backgroundColor: `${config.color}20`, color: config.color }}
                        >
                            {client.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="mt-1">
                            <div
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 border"
                                style={{
                                    backgroundColor: `${config.color}10`,
                                    color: config.color,
                                    borderColor: `${config.color}30`
                                }}
                            >
                                <Star size={10} fill="currentColor" />
                                {config.label}
                            </div>
                            <h1 className="text-2xl font-display font-light tracking-tight text-white/90">
                                {client.fullName.toLowerCase()}
                            </h1>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-3 mt-4">
                        {[
                            { label: 'sessões', value: client.totalSessions },
                            { label: 'gasto total', value: formatCurrency(client.totalSpent) },
                            { label: 'xp total', value: client.xp },
                            { label: 'nps', value: client.npsScore || '-' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-void-slate font-bold opacity-70 mb-1">{stat.label}</span>
                                <span className="text-lg font-mono font-medium text-white">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">

                    {/* Left Col: Contact & Preferences */}
                    <div className="flex flex-col gap-6">
                        {/* Contact Info */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <User size={14} /> Contato
                            </h3>
                            <div className="space-y-4">
                                <InfoRow label="Email" icon={<Mail size={14} />} value={client.email} />

                                {isEditing ? (
                                    <EditInput
                                        label="Telefone"
                                        value={String(formData.phone ?? client.phone ?? '')} // Fix: Ensure string
                                        onChange={v => setFormData({ ...formData, phone: v })}
                                        icon={<Phone size={14} />}
                                    />
                                ) : (
                                    <InfoRow label="Telefone" icon={<Phone size={14} />} value={client.phone} />
                                )}

                                {isEditing ? (
                                    <EditInput
                                        label="CPF"
                                        value={String(formData.cpf ?? client.cpf ?? '')} // Fix: Ensure string
                                        onChange={v => setFormData({ ...formData, cpf: v })}
                                        icon={<CreditCard size={14} />}
                                    />
                                ) : (
                                    <InfoRow label="CPF" icon={<CreditCard size={14} />} value={client.cpf} />
                                )}

                                {isEditing ? (
                                    // Fix: Date Handling
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase text-white/40 font-bold flex items-center gap-2">
                                            <Gift size={14} /> Nascimento
                                        </label>
                                        <input
                                            type="date"
                                            className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-void-vibrant-blue transition-all"
                                            value={
                                                (formData.birthDate as any) instanceof Date
                                                    ? (formData.birthDate as any).toISOString().split('T')[0]
                                                    : (typeof formData.birthDate === 'string' ? formData.birthDate.split('T')[0] : '')
                                            }
                                            onChange={e => setFormData({ ...formData, birthDate: e.target.value ? e.target.value : undefined })}
                                        />
                                    </div>
                                ) : (
                                    <InfoRow label="Nascimento" icon={<Gift size={14} />} value={formatDate(client.birthDate)} />
                                )}
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Zap size={14} /> Preferências
                            </h3>
                            <div className="space-y-4">
                                <InfoRow label="Temperatura" value={`${client.preferences?.temperature}°c`} />
                                <InfoRow label="Iluminação" value={client.preferences?.lighting ? 'ligada' : 'desligada'} />
                                {client.preferences?.claustrophobiaNotes && (
                                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 p-3 rounded-lg text-xs leading-relaxed">
                                        <span className="font-bold block mb-1">⚠️ Claustrofobia</span>
                                        {client.preferences.claustrophobiaNotes}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: History */}
                    <div className="flex flex-col gap-6">
                        {/* Interactions */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity size={14} /> Histórico Recente
                            </h3>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {client.interactionHistory && client.interactionHistory.length > 0 ? (
                                    client.interactionHistory.slice(0, 5).map(interaction => (
                                        <div key={interaction.id} className="text-sm border-l-2 border-white/10 pl-3 py-1">
                                            <div className="flex justify-between opacity-50 text-xs mb-1">
                                                <span>{formatDate(interaction.date)}</span>
                                                <span className="uppercase font-bold">{interaction.type}</span>
                                            </div>
                                            <p className="text-white/80 leading-snug">{interaction.notes}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white/20 italic text-sm">nenhuma interação registrada</p>
                                )}
                            </div>
                        </div>

                        {/* Purchases */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ShoppingBag size={14} /> Compras
                            </h3>
                            <div className="space-y-2">
                                {client.purchaseHistory && client.purchaseHistory.length > 0 ? (
                                    client.purchaseHistory.slice(0, 3).map(purchase => (
                                        <div key={purchase.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg text-sm">
                                            <div>
                                                <p className="font-medium text-white">{purchase.itemName}</p>
                                                <p className="text-[10px] text-white/40">{formatDate(purchase.date)}</p>
                                            </div>
                                            <span className="font-mono font-bold text-void-vibrant-blue">{formatCurrency(purchase.value)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white/20 italic text-sm">nenhuma compra recente</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// Sub-components for cleaner code
function InfoRow({ label, icon, value }: { label: string, icon?: React.ReactNode, value?: string | number | null }) {
    if (!value) return null;
    return (
        <div className="flex items-center justify-between group">
            <span className="text-xs text-white/40 uppercase font-bold flex items-center gap-2">
                {icon} {label}
            </span>
            <span className="text-sm font-medium text-white/90">{value}</span>
        </div>
    );
}

function EditInput({ label, value, onChange, icon }: { label: string, value: string, onChange: (v: string) => void, icon?: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase text-white/40 font-bold flex items-center gap-2">
                {icon} {label}
            </label>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-void-vibrant-blue transition-all"
            />
        </div>
    );
}
