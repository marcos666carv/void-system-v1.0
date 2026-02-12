'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { ClientProps } from '@/domain/entities/Client';
import { VOID_LEVELS, VOID_LEVEL_CONFIG, xpToNextLevel, VoidLevel } from '@/domain/value-objects/VoidLevel';
import { Search, Filter, Mail, Phone, MapPin, DollarSign, Calendar, Star, Zap, User, ChevronRight, Clock, Tag, MessageSquare, ShoppingBag, CreditCard, Gift } from 'lucide-react';
import s from './AdminCustomers.module.css';

const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);
const formatDate = (d: Date | string | undefined) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';

export default function CustomersPage() {
    const searchParams = useSearchParams();
    const initialClientId = searchParams.get('id');
    const [clients, setClients] = useState<ClientProps[]>([]);
    const [search, setSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState<VoidLevel | 'all'>('all');
    const [selectedClient, setSelectedClient] = useState<ClientProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<ClientProps>>({});

    const handleSave = () => {
        if (!selectedClient) return;

        const changes: string[] = [];
        const newClient = { ...selectedClient, ...formData };

        // Check for specific field changes to log
        if (formData.phone !== selectedClient.phone) changes.push(`Telefone alterado: ${selectedClient.phone || 'vazio'} -> ${formData.phone}`);
        if (formData.cpf !== selectedClient.cpf) changes.push(`CPF alterado: ${selectedClient.cpf || 'vazio'} -> ${formData.cpf}`);
        if (new Date(formData.birthDate || '').getTime() !== new Date(selectedClient.birthDate || '').getTime()) changes.push(`Data de nascimento alterada`);
        if (JSON.stringify(formData.usageTags) !== JSON.stringify(selectedClient.usageTags)) changes.push(`Tags de uso atualizadas`);
        if (JSON.stringify(formData.preferredWeekDays) !== JSON.stringify(selectedClient.preferredWeekDays)) changes.push(`Dias preferidos atualizados`);

        if (changes.length > 0) {
            // Add interaction log
            const newInteraction = {
                id: `log_${Date.now()}`,
                date: new Date(),
                type: 'system' as const,
                notes: `Alteração de perfil: ${changes.join('; ')}`
            };

            newClient.interactionHistory = [newInteraction, ...(newClient.interactionHistory || [])];
        }

        setSelectedClient(newClient);

        // Update the client in the main list as well
        setClients(prev => prev.map(c => c.id === newClient.id ? newClient : c));

        setIsEditing(false);
        setFormData({});
    };

    useEffect(() => {
        fetch('/api/clients?pageSize=50')
            .then(r => r.json())
            .then(data => {
                const loadedClients = data.data ?? [];
                setClients(loadedClients);
                setLoading(false);

                // Strategies for initial selection:
                // 1. If ID in URL matches a client, select them.
                // 2. Otherwise default to first client if list not empty.
                if (initialClientId) {
                    const target = loadedClients.find((c: ClientProps) => c.id === initialClientId);
                    if (target) {
                        setSelectedClient(target);
                        return;
                    }
                }

                if (loadedClients.length > 0) {
                    setSelectedClient(loadedClients[0]);
                }
            })
            .catch(() => setLoading(false));
    }, [initialClientId]);

    const filtered = useMemo(() => {
        return clients.filter(c => {
            if (c.role !== 'client') return false;
            const q = search.toLowerCase();
            const matchesSearch = !q || c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
            const matchesLevel = levelFilter === 'all' || c.level === levelFilter;
            return matchesSearch && matchesLevel;
        });
    }, [clients, search, levelFilter]);

    const levelCounts = useMemo(() => {
        const counts: Record<string, number> = { all: 0 };
        VOID_LEVELS.forEach(l => { counts[l] = 0; });
        clients.filter(c => c.role === 'client').forEach(c => { counts[c.level] = (counts[c.level] || 0) + 1; counts.all++; });
        return counts;
    }, [clients]);

    if (loading) return <div style={{ padding: 'var(--space-5)' }}><p style={{ opacity: 0.5 }}>carregando clientes...</p></div>;

    return (
        <div className={s.container}>
            {/* Header */}
            <div className={s.header}>
                <h1 className={s.title}>base de clientes</h1>
                <p className={s.subtitle}>gestão de relacionamento e fidelidade</p>
            </div>

            <div className={s.contentGrid}>

                {/* LEFT COLUMN: Search & List */}
                <div className={s.listColumn}>

                    {/* Controls */}
                    <div className={s.controls}>
                        <div className={s.searchContainer}>
                            <Search size={14} className={s.searchIcon} />
                            <input
                                placeholder="buscar cliente..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className={s.searchInput}
                            />
                        </div>
                        <div className={s.filterScroll}>
                            {(['all', ...VOID_LEVELS] as const).map(level => {
                                const isActive = levelFilter === level;
                                const config = level !== 'all' ? VOID_LEVEL_CONFIG[level] : null;
                                return (
                                    <button
                                        key={level}
                                        onClick={() => setLevelFilter(level)}
                                        className={s.filterButton}
                                        style={{
                                            border: `1px solid ${isActive ? (config?.color ?? 'var(--foreground)') : 'var(--border)'}`,
                                            backgroundColor: isActive ? (config?.color ?? 'var(--foreground)') : 'white',
                                            color: isActive ? 'white' : 'var(--foreground)',
                                            opacity: isActive ? 1 : 0.6,
                                        }}
                                    >
                                        {level === 'all' ? 'todos' : config?.label.toLowerCase()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Scrollable List */}
                    <div className={s.clientList}>
                        {filtered.map(client => {
                            const params = VOID_LEVEL_CONFIG[client.level];
                            const isSelected = selectedClient?.id === client.id;
                            return (
                                <div
                                    key={client.id}
                                    onClick={() => setSelectedClient(client)}
                                    className={`${s.clientItem} ${isSelected ? s.clientItemActive : ''}`}
                                >
                                    <div className={s.clientAvatarSmall} style={{ backgroundColor: `${params.color}20`, color: params.color }}>
                                        {client.fullName.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p className={s.clientName}>
                                                {client.fullName.toLowerCase()}
                                            </p>
                                            {isSelected && <ChevronRight size={14} className="opacity-40" />}
                                        </div>
                                        <p className={s.clientEmail}>{client.email}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* RIGHT COLUMN: Detail (Dark Hero Style) */}
                {/* RIGHT COLUMN: Detail (Dark Hero Style) */}
                <div className={s.detailColumn}>
                    {selectedClient ? (
                        <>
                            {/* Dark Hero Profile Card */}
                            <div className={s.heroCard}>
                                {/* Background Accent */}
                                <div className={s.heroBackground} />

                                {/* Header Actions */}
                                <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10, display: 'flex', gap: '8px' }}>
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                style={{
                                                    padding: '8px 16px', borderRadius: '8px', border: 'none',
                                                    backgroundColor: '#10B981', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem'
                                                }}
                                            >
                                                Salvar
                                            </button>
                                            <button
                                                onClick={() => { setIsEditing(false); setFormData({}); }}
                                                style={{
                                                    padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                                                    backgroundColor: 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem'
                                                }}
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => { setIsEditing(true); setFormData({ ...selectedClient }); }}
                                            style={{
                                                padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                                                backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem',
                                                backdropFilter: 'blur(4px)'
                                            }}
                                        >
                                            Editar Perfil
                                        </button>
                                    )}
                                </div>

                                {/* Avatar & Identity */}
                                <div style={{ flexShrink: 0 }}>
                                    <div className={s.heroAvatar} style={{ color: VOID_LEVEL_CONFIG[selectedClient.level].color }}>
                                        {selectedClient.fullName.substring(0, 2).toUpperCase()}
                                    </div>

                                    <div
                                        className={s.heroBadge}
                                        style={{
                                            backgroundColor: `${VOID_LEVEL_CONFIG[selectedClient.level].color}20`, // 12% opacity (approx) or 20 hex = 32 decimal -> 12.5%
                                            color: VOID_LEVEL_CONFIG[selectedClient.level].color,
                                            borderColor: `${VOID_LEVEL_CONFIG[selectedClient.level].color}40`
                                        }}
                                    >
                                        <Star size={12} fill="currentColor" />
                                        <span>{VOID_LEVEL_CONFIG[selectedClient.level].label.toLowerCase()}</span>
                                    </div>
                                </div>

                                {/* Stats & Info */}
                                <div className={s.heroContent}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
                                        <h2 className={s.heroTitle}>{selectedClient.fullName.toLowerCase()}</h2>

                                        {/* Usage Tags */}
                                        {isEditing ? (
                                            <div style={{ marginTop: '8px' }}>
                                                <label style={{ fontSize: '0.75rem', opacity: 0.7, display: 'block', marginBottom: '4px' }}>Tags (separadas por vírgula)</label>
                                                <input
                                                    value={formData.usageTags?.join(', ') || ''}
                                                    onChange={e => setFormData({ ...formData, usageTags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                                        color: 'white', padding: '8px', borderRadius: '8px', width: '100%', fontSize: '0.875rem'
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            selectedClient.usageTags && (
                                                <div className={s.heroTags}>
                                                    {selectedClient.usageTags.map(tag => (
                                                        <span key={tag} className={s.heroTag}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className={s.heroMetaGrid}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <span className={s.heroMetaItem}><Mail size={14} /> {selectedClient.email}</span>

                                            {/* Phone */}
                                            {isEditing ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Phone size={14} style={{ opacity: 0.7 }} />
                                                    <input
                                                        value={formData.phone || ''}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        placeholder="Telefone"
                                                        style={{
                                                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                                            color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', width: '140px'
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                selectedClient.phone && <span className={s.heroMetaItem}><Phone size={14} /> {selectedClient.phone}</span>
                                            )}

                                            {/* CPF */}
                                            {isEditing ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <CreditCard size={14} style={{ opacity: 0.7 }} />
                                                    <input
                                                        value={formData.cpf || ''}
                                                        onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                                                        placeholder="CPF"
                                                        style={{
                                                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                                            color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', width: '140px'
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                selectedClient.cpf && <span className={s.heroMetaItem}><CreditCard size={14} /> {selectedClient.cpf}</span>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {/* Birth Date */}
                                            {isEditing ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Gift size={14} style={{ opacity: 0.7 }} />
                                                    <input
                                                        type="date"
                                                        value={formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : ''}
                                                        onChange={e => setFormData({ ...formData, birthDate: e.target.value ? new Date(e.target.value) : undefined })}
                                                        style={{
                                                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                                            color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem'
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                selectedClient.birthDate && <span className={s.heroMetaItem}><Gift size={14} /> {formatDate(selectedClient.birthDate)}</span>
                                            )}

                                            <span className={s.heroMetaItem}><Calendar size={14} /> cliente desde {formatDate(selectedClient.createdAt)}</span>

                                            {/* Preferred Week Days */}
                                            {isEditing ? (
                                                <div style={{ marginTop: '4px' }}>
                                                    <label style={{ fontSize: '0.65rem', opacity: 0.7, display: 'block', marginBottom: '2px' }}>Dias preferidos</label>
                                                    <input
                                                        value={formData.preferredWeekDays?.join(', ') || ''}
                                                        onChange={e => setFormData({ ...formData, preferredWeekDays: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                                        style={{
                                                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                                            color: 'white', padding: '4px 8px', borderRadius: '6px', width: '100%', fontSize: '0.8rem'
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                selectedClient.preferredWeekDays && (
                                                    <span className={s.heroMetaItem}><Clock size={14} /> prefere: {selectedClient.preferredWeekDays.join(', ')}</span>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div className={s.heroStatsGrid}>
                                        <div className={s.heroStatCard}>
                                            <p className={s.heroStatLabel}>sessões</p>
                                            <p className={s.heroStatValue}>{selectedClient.totalSessions}</p>
                                        </div>
                                        <div className={s.heroStatCard}>
                                            <p className={s.heroStatLabel}>gasto total</p>
                                            <p className={s.heroStatValue}>{formatCurrency(selectedClient.totalSpent)}</p>
                                        </div>
                                        <div className={s.heroStatCard}>
                                            <p className={s.heroStatLabel}>xp total</p>
                                            <p className={s.heroStatValue}>{selectedClient.xp}</p>
                                        </div>
                                        <div className={s.heroStatCard}>
                                            <p className={s.heroStatLabel}>nps</p>
                                            <p className={s.heroStatValue}>{selectedClient.npsScore || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preferences & History */}
                            <div className={s.detailGrid}>
                                {/* Left Column: Preferences & Interactions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

                                    {/* Preferences */}
                                    <div className={s.infoCard}>
                                        <h3 className={s.cardTitle}>
                                            <Star size={16} /> preferências
                                        </h3>
                                        {/* ... existing preferences code ... */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div className={s.infoRow}>
                                                <div className={s.infoLabel}>
                                                    <Zap size={14} /> temperatura
                                                </div>
                                                <span className={s.infoValue}>{selectedClient.preferences?.temperature}°c</span>
                                            </div>
                                            <div className={s.infoRow}>
                                                <div className={s.infoLabel}>
                                                    <Zap size={14} /> iluminação
                                                </div>
                                                <span className={s.infoValue}>{selectedClient.preferences?.lighting ? 'ligada' : 'desligada'}</span>
                                            </div>
                                            {selectedClient.preferences?.claustrophobiaNotes && (
                                                <div className={s.alertBox}>
                                                    <p style={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '4px' }}>⚠️ claustrofobia</p>
                                                    {selectedClient.preferences.claustrophobiaNotes}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Interaction History */}
                                    <div className={s.infoCard}>
                                        <h3 className={s.cardTitle}>
                                            <MessageSquare size={16} /> histórico de interações
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {selectedClient.interactionHistory ? (
                                                selectedClient.interactionHistory.map(interaction => (
                                                    <div key={interaction.id} className={s.historyItem}>
                                                        <div className={s.historyHeader}>
                                                            <span>{formatDate(interaction.date)}</span>
                                                            <span style={{ textTransform: 'uppercase' }}>{interaction.type}</span>
                                                        </div>
                                                        <p>{interaction.notes}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.8rem' }}>nenhuma interação registrada.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: History (Visits & Purchases) */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

                                    {/* Visits */}
                                    <div className={s.infoCard}>
                                        <h3 className={s.cardTitle}>
                                            <Calendar size={16} /> visitas recentes
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {selectedClient.visitHistory ? (
                                                selectedClient.visitHistory.map((date, i) => (
                                                    <div key={i} className={s.visitRow}>
                                                        <span style={{ fontSize: '0.875rem' }}>visita realizada</span>
                                                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{formatDate(date)}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.8rem' }}>histórico vazio.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Purchases */}
                                    <div className={s.infoCard}>
                                        <h3 className={s.cardTitle}>
                                            <ShoppingBag size={16} /> histórico de compras
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {selectedClient.purchaseHistory ? (
                                                selectedClient.purchaseHistory.map(purchase => (
                                                    <div key={purchase.id} className={s.purchaseItem}>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{purchase.itemName}</span>
                                                            <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{formatDate(purchase.date)}</span>
                                                        </div>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{formatCurrency(purchase.value)}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.8rem' }}>nenhuma compra registrada.</p>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={s.emptyState}>
                            <User size={48} />
                            <p>selecione um cliente para ver detalhes</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
