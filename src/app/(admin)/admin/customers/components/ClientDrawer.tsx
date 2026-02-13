'use client';

import { useState, useEffect } from 'react';
import { ClientProps } from '@/domain/entities/Client';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

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

    useEffect(() => {
        setIsEditing(false);
        setFormData({});
    }, [client?.id, isOpen]);

    if (!isOpen || !client) return null;

    const data = isEditing ? { ...client, ...formData } : client;

    const handleSave = () => {
        onSave?.(formData);
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Client Details</h2>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button size="sm" intent="primary" onClick={handleSave}>Save</Button>
                                <Button size="sm" intent="tertiary" onClick={() => setIsEditing(false)}>Cancel</Button>
                            </>
                        ) : (
                            <Button size="sm" intent="secondary" onClick={() => setIsEditing(true)}>Edit</Button>
                        )}
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center text-center">
                        <Avatar
                            src={client.photoUrl}
                            fallback={client.fullName}
                            size="2xl"
                            className="mb-4 h-24 w-24 text-2xl"
                        />
                        <h3 className="text-xl font-semibold text-gray-900">{client.fullName}</h3>
                        <p className="text-sm text-gray-500 mb-4">{client.email}</p>
                        <div className="flex gap-2">
                            <Badge intent="brand">{client.level}</Badge>
                            <Badge intent={client.lifeCycleStage === 'active' ? 'success' : 'gray'}>
                                {client.lifeCycleStage}
                            </Badge>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Sessions</div>
                            <div className="text-lg font-bold text-gray-900">{client.totalSessions}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Spent</div>
                            <div className="text-lg font-bold text-gray-900">{formatCurrency(client.totalSpent)}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">NPS</div>
                            <div className="text-lg font-bold text-gray-900">{client.npsScore || '-'}</div>
                        </div>
                    </div>

                    {/* Details Form */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">Personal Information</h4>
                        <div className="space-y-4">
                            <Input
                                label="Phone"
                                value={data.phone || ''}
                                disabled={!isEditing}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <Input
                                label="CPF"
                                value={data.cpf || ''}
                                disabled={!isEditing}
                                onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                            />
                            <Input
                                label="Birth Date"
                                type="date"
                                value={data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : ''}
                                disabled={!isEditing}
                                onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                            />
                            <Input
                                label="Profession"
                                value={data.profession || ''}
                                disabled={!isEditing}
                                onChange={e => setFormData({ ...formData, profession: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">Preferences</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Card padding="sm" className="bg-gray-50">
                                <span className="text-xs text-gray-500 block mb-1">Temperature</span>
                                <span className="font-medium text-gray-900">{client.preferences?.temperature || 35.5}°C</span>
                            </Card>
                            <Card padding="sm" className="bg-gray-50">
                                <span className="text-xs text-gray-500 block mb-1">Lighting</span>
                                <span className="font-medium text-gray-900">{client.preferences?.lighting ? 'ON' : 'OFF'}</span>
                            </Card>
                        </div>
                        {client.preferences?.claustrophobiaNotes && (
                            <div className="p-3 bg-warning-50 text-warning-800 text-sm rounded-lg border border-warning-200">
                                <strong className="block text-xs uppercase mb-1">Claustrophobia Alert</strong>
                                {client.preferences.claustrophobiaNotes}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
