import React from 'react';
import { TankProps, TankStatus } from '@/domain/entities/Tank';
import { Button } from '@/components/ui';
import { Users, AlertCircle, Play, Power, Moon, Droplets, Thermometer, Volume2, Lightbulb, Waves } from 'lucide-react';

interface TankCardProps {
    tank: TankProps;
    onStartSession: () => void;
    onStopSession: () => void;
    onStartCleaning: () => void;
    onStopCleaning: () => void;
    onToggleNightMode: () => void;
    onToggleDevice: (device: 'leds' | 'music' | 'heater' | 'pump') => void;
    onViewDetails: () => void;
}

const statusColors: Record<TankStatus, string> = {
    ready: '#10B981', // Green
    in_use: '#EF4444', // Red
    cleaning: '#F59E0B', // Amber
    maintenance: '#DC2626', // Red
    offline: '#64748B', // Slate
    night_mode: '#8B5CF6' // Purple
};

const statusBg: Record<TankStatus, string> = {
    ready: '#DCFCE7',
    in_use: '#FEE2E2',
    cleaning: '#FEF3C7',
    maintenance: '#FEE2E2',
    offline: '#F1F5F9',
    night_mode: '#F3E8FF'
};

const statusLabels: Record<TankStatus, string> = {
    ready: 'Livre',
    in_use: 'Em Sessão',
    cleaning: 'Limpeza',
    maintenance: 'Manutenção',
    offline: 'Offline',
    night_mode: 'Modo Noturno'
};

export const TankCard: React.FC<TankCardProps> = ({
    tank,
    onStartSession,
    onStopSession,
    onStartCleaning,
    onStopCleaning,
    onToggleNightMode,
    onToggleDevice,
    onViewDetails
}) => {
    // Helper to render device toggle
    const renderToggle = (label: string, isOn: boolean, device: 'leds' | 'music' | 'heater' | 'pump', disabled: boolean = false) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.03)', padding: '8px 12px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>{label}</span>
            <button
                onClick={(e) => { e.stopPropagation(); if (!disabled) onToggleDevice(device); }}
                style={{
                    width: '36px', height: '20px', borderRadius: '100px',
                    backgroundColor: isOn ? '#0F172A' : '#E2E8F0',
                    position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer', border: 'none',
                    opacity: disabled ? 0.5 : 1, transition: 'all 0.2s'
                }}
            >
                <div style={{
                    width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white',
                    position: 'absolute', top: '2px', left: isOn ? '18px' : '2px', transition: 'all 0.2s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }} />
            </button>
        </div>
    );

    const isSession = tank.status === 'in_use';
    const isCleaning = tank.status === 'cleaning';
    const isReady = tank.status === 'ready';
    const isNight = tank.status === 'night_mode';

    const cardBorderColor = isSession ? '#FCA5A5' : isReady ? '#86EFAC' : isCleaning ? '#FCD34D' : '#E2E8F0';

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: `2px solid ${cardBorderColor}`,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            height: '100%',
            position: 'relative',
            transition: 'all 0.2s ease'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: statusBg[tank.status], color: statusColors[tank.status] }}>
                            <Waves size={18} />
                        </div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A' }}>{tank.name}</h3>
                    </div>
                    <span style={{
                        fontSize: '0.75rem', fontWeight: 600, color: statusColors[tank.status],
                        backgroundColor: statusBg[tank.status], padding: '2px 8px', borderRadius: '4px',
                        alignSelf: 'flex-start', marginLeft: '40px'
                    }}>
                        {statusLabels[tank.status]}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F1F5F9', padding: '4px 8px', borderRadius: '6px' }}>
                    <Thermometer size={14} color="#64748B" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>{tank.temperature}°C</span>
                </div>
            </div>

            {/* Content Body */}
            <div style={{ flex: 1 }}>
                {isSession ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Client Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E2E8F0', overflow: 'hidden', flexShrink: 0 }}>
                                {tank.currentClient?.photoUrl ? (
                                    <img src={tank.currentClient.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : <Users size={20} className="m-auto mt-2.5 opacity-40" />}
                            </div>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>{tank.currentClient?.name || 'Cliente'}</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748B' }}>{tank.totalSessions || 0} flutuações</p>
                            </div>
                        </div>
                        {/* Timer */}
                        <div style={{ backgroundColor: '#FEF2F2', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #FECACA' }}>
                            <p style={{ fontSize: '0.75rem', color: '#7F1D1D', fontWeight: 600, marginBottom: '4px' }}>Tempo restante</p>
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#DC2626' }}>{tank.sessionTimeRemaining}</span>
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#DC2626' }}>min</span>
                            </div>
                        </div>
                    </div>
                ) : isCleaning ? (
                    <div style={{ backgroundColor: '#FFFBEB', borderRadius: '12px', padding: '20px', textAlign: 'center', border: '1px solid #FDE68A', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <p style={{ fontSize: '0.875rem', color: '#92400E', fontWeight: 600 }}>Limpeza em andamento</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', marginTop: '8px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#D97706' }}>{tank.cleaningTimeRemaining}</span>
                            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#D97706' }}>min</span>
                        </div>
                    </div>
                ) : (
                    <div style={{ height: '100%', minHeight: '120px' }} />
                )}
            </div>

            {/* Device Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {renderToggle('LEDs', tank.ledsOn, 'leds')}
                {renderToggle('Som', tank.musicOn, 'music')}
                {renderToggle('Bomba', tank.pumpOn, 'pump', isSession)} {/* Pump locked during session */}
                {renderToggle('Aquecedor', tank.heaterOn, 'heater')}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                <button
                    onClick={onViewDetails}
                    style={{
                        width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0',
                        backgroundColor: 'transparent', color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                >
                    <Play size={14} /> Ver mais detalhes
                </button>

                {isReady && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <Button color="primary" onClick={onStartSession} style={{ justifyContent: 'center' }}>
                            <Play size={16} style={{ marginRight: '8px' }} /> Iniciar Sessão
                        </Button>
                        <Button color="secondary" onClick={onStartCleaning} style={{ justifyContent: 'center' }}>
                            <Droplets size={16} style={{ marginRight: '8px' }} /> Ciclo Limpeza
                        </Button>
                    </div>
                )}

                {isSession && (
                    <Button
                        onClick={onStopSession}
                        style={{ backgroundColor: '#DC2626', color: 'white', justifyContent: 'center', border: 'none' }}
                    >
                        <Power size={16} style={{ marginRight: '8px' }} /> Encerrar Sessão
                    </Button>
                )}

                {isCleaning && (
                    <Button color="secondary" onClick={onStopCleaning} style={{ justifyContent: 'center' }}>
                        <Power size={16} style={{ marginRight: '8px' }} /> Finalizar Limpeza
                    </Button>
                )}

                {isNight && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <Button color="primary" onClick={onStartSession} style={{ justifyContent: 'center' }}>
                            <Play size={16} style={{ marginRight: '8px' }} /> Iniciar Sessão
                        </Button>
                        <Button color="secondary" onClick={onStartCleaning} style={{ justifyContent: 'center' }}>
                            <Droplets size={16} style={{ marginRight: '8px' }} /> Ciclo Limpeza
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
