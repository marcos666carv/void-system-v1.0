'use client';

import { useState, useEffect } from 'react';
import { ClientProps } from '@/domain/entities/Client';
import { VOID_LEVEL_CONFIG } from '@/domain/value-objects/VoidLevel';
import { motion, AnimatePresence } from 'motion/react';
import {
    Phone, Mail, CreditCard, Gift, Star, Zap,
    Activity, ShoppingBag, User, Edit2, X, Check, Calendar, Clock
} from 'lucide-react';

interface ClientDrawerProps {
    client: ClientProps | null;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (updatedClient: Partial<ClientProps>) => void;
}

const formatDate = (d: Date | string | undefined) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';
const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

export function ClientDrawer({ client, isOpen, onClose, onSave }: ClientDrawerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<ClientProps>>({});

    // Reset when client changes
    useEffect(() => {
        setIsEditing(false);
        setFormData({});
    }, [client?.id, isOpen]);

    const handleSave = () => {
        if (onSave) {
            onSave(formData);
            setIsEditing(false);
        }
    };

    if (!client) return null;

    const config = VOID_LEVEL_CONFIG[client.level];
    const data = isEditing ? { ...client, ...formData } : client;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-void-obsidian/80 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-void-deep-blue border-l border-white/10 z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header Actions */}
                        <div className="flex-none p-6 flex justify-between items-start border-b border-white/5 bg-void-deep-blue/50 backdrop-blur-md sticky top-0 z-20">
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-void-vibrant-blue text-white rounded-lg text-sm font-semibold shadow-lg hover:bg-void-vibrant-blue/90 transition-all flex items-center gap-2"
                                        >
                                            <Check size={14} /> Salvar
                                        </button>
                                        <button
                                            onClick={() => { setIsEditing(false); setFormData({}); }}
                                            className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-semibold hover:bg-white/10 transition-all"
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => { setIsEditing(true); setFormData({ ...client }); }}
                                        className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-semibold hover:bg-white/10 backdrop-blur-md transition-all flex items-center gap-2"
                                    >
                                        <Edit2 size={14} /> Editar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                            {/* Hero Section */}
                            <div className="flex flex-col gap-6 relative">
                                {/* Ambient Glow */}
                                <div
                                    className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-[80px] opacity-30 pointer-events-none"
                                    style={{ background: config.color }}
                                />

                                <div className="flex items-center gap-5 relative z-10">
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-2xl ring-1 ring-white/10"
                                        style={{ backgroundColor: `${config.color}20`, color: config.color }}
                                    >
                                        {client.fullName.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 border backdrop-blur-md"
                                            style={{
                                                backgroundColor: `${config.color}10`,
                                                color: config.color,
                                                borderColor: `${config.color}30`
                                            }}
                                        >
                                            <Star size={10} fill="currentColor" />
                                            {config.label}
                                        </div>
                                        <h2 className="text-3xl font-display font-light text-white leading-none">
                                            {client.fullName.toLowerCase()}
                                        </h2>
                                        <p className="text-white/40 font-mono text-xs mt-2 truncate max-w-[250px]">{client.email}</p>
                                    </div>
                                </div>

                                {/* Stats Ribbon */}
                                <div className="grid grid-cols-4 gap-2">
                                    <StatBox label="sessões" value={client.totalSessions} />
                                    <StatBox label="gasto" value={formatCurrency(client.totalSpent)} condensed />
                                    <StatBox label="xp" value={client.xp} />
                                    <StatBox label="nps" value={client.npsScore || '-'} />
                                </div>
                            </div>

                            {/* Info Groups */}
                            <div className="space-y-6">
                                {/* Personal Info */}
                                <div className="space-y-4">
                                    <SectionHeader icon={<User size={16} />} title="Dados Pessoais" />
                                    <div className="grid grid-cols-1 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <InfoRow
                                            label="Telefone"
                                            value={data.phone}
                                            isEditing={isEditing}
                                            onChange={(v: string) => setFormData({ ...formData, phone: v })}
                                        />
                                        <InfoRow
                                            label="CPF"
                                            value={data.cpf}
                                            isEditing={isEditing}
                                            onChange={(v: string) => setFormData({ ...formData, cpf: v })}
                                        />
                                        <InfoRow
                                            label="Nascimento"
                                            value={formatDate(data.birthDate)}
                                            isEditing={isEditing}
                                            type="date"
                                            rawValue={data.birthDate}
                                            onChange={(v: string) => setFormData({ ...formData, birthDate: v })}
                                        />
                                        <InfoRow
                                            label="Profissão"
                                            value={data.profession}
                                            isEditing={isEditing}
                                            onChange={(v: string) => setFormData({ ...formData, profession: v })}
                                        />
                                    </div>
                                </div>

                                {/* Preferences */}
                                <div className="space-y-4">
                                    <SectionHeader icon={<Zap size={16} />} title="Preferências" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                            <span className="text-[10px] uppercase text-white/40 font-bold block mb-1">Temperatura</span>
                                            <span className="text-lg font-mono text-white">{client.preferences?.temperature || 35.5}°c</span>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                            <span className="text-[10px] uppercase text-white/40 font-bold block mb-1">Luz</span>
                                            <span className="text-lg font-mono text-white">{client.preferences?.lighting ? 'ON' : 'OFF'}</span>
                                        </div>
                                    </div>
                                    {client.preferences?.claustrophobiaNotes && (
                                        <div className="bg-void-obsidian border-l-2 border-amber-500 p-3 text-sm text-amber-500/90 leading-relaxed">
                                            <strong className="block text-[10px] uppercase tracking-wider mb-1">Claustrofobia</strong>
                                            {client.preferences.claustrophobiaNotes}
                                        </div>
                                    )}
                                </div>

                                {/* History */}
                                <div className="space-y-4">
                                    <SectionHeader icon={<Activity size={16} />} title="Jornada" />
                                    <div className="space-y-2">
                                        {client.interactionHistory?.slice(0, 3).map((item, i) => (
                                            <div key={i} className="flex gap-3 text-sm p-3 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/5">
                                                <div className="text-white/30 font-mono text-xs pt-0.5">{formatDate(item.date)}</div>
                                                <div>
                                                    <div className="text-white font-medium mb-0.5">{item.type}</div>
                                                    <div className="text-white/60 text-xs leading-relaxed">{item.notes}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {!client.interactionHistory?.length && (
                                            <div className="text-white/20 text-center py-4 text-sm italic">
                                                sem histórico recente
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function StatBox({ label, value, condensed }: { label: string, value: string | number, condensed?: boolean }) {
    return (
        <div className="bg-void-obsidian/50 border border-white/5 rounded-lg p-2 flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-1">{label}</span>
            <span className={`font-mono text-white ${condensed ? 'text-sm' : 'text-xl'}`}>{value}</span>
        </div>
    );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode, title: string }) {
    return (
        <h3 className="flex items-center gap-2 text-void-vibrant-blue text-xs font-bold uppercase tracking-widest">
            {icon} {title}
        </h3>
    );
}

function InfoRow({ label, value, isEditing, onChange, type = 'text', rawValue }: any) {
    if (isEditing) {
        return (
            <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase text-white/30 font-bold">{label}</label>
                <input
                    type={type}
                    value={type === 'date' && rawValue ? new Date(rawValue).toISOString().split('T')[0] : (value || '')}
                    onChange={e => onChange(e.target.value)}
                    className="bg-void-obsidian px-3 py-2 rounded border border-white/10 text-white text-sm focus:border-void-vibrant-blue outline-none transition-colors"
                />
            </div>
        );
    }

    if (!value) return null;
    return (
        <div className="flex justify-between items-center py-1 group">
            <span className="text-white/40 text-sm">{label}</span>
            <span className="text-white font-medium text-sm group-hover:text-void-vibrant-blue transition-colors text-right">{value}</span>
        </div>
    );
}
