import React from 'react';
import { TankProps, TankStatus } from '@/domain/entities/Tank';
import { Button, Badge, Avatar } from '@/components/ui';
import { Users, Play, Power, Droplets, Thermometer, Waves } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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

const statusBadgeIntent: Record<TankStatus, "success" | "error" | "warning" | "gray" | "brand"> = {
    ready: 'success',
    in_use: 'error',
    cleaning: 'warning',
    maintenance: 'error',
    offline: 'gray',
    night_mode: 'brand'
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
    onToggleDevice,
    onViewDetails
}) => {
    // Helper to render device toggle
    const renderToggle = (label: string, isOn: boolean, device: 'leds' | 'music' | 'heater' | 'pump', disabled: boolean = false) => (
        <div className="flex justify-between items-center bg-bg-secondary/50 px-3 py-2 rounded-lg border border-border-secondary">
            <span className="text-xs font-semibold text-fg-secondary">{label}</span>
            <button
                onClick={(e) => { e.stopPropagation(); if (!disabled) onToggleDevice(device); }}
                className={cn(
                    "w-9 h-5 rounded-full relative transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-1",
                    isOn ? "bg-bg-brand-solid" : "bg-bg-tertiary",
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                )}
            >
                <div className={cn(
                    "w-4 h-4 rounded-full bg-white absolute top-0.5 shadow-sm transition-all duration-200",
                    isOn ? "left-[18px]" : "left-0.5"
                )} />
            </button>
        </div>
    );

    const isSession = tank.status === 'in_use';
    const isCleaning = tank.status === 'cleaning';
    const isReady = tank.status === 'ready';
    const isNight = tank.status === 'night_mode';

    const cardBorderClass = isSession ? 'border-border-error' :
        isReady ? 'border-border-success' :
            isCleaning ? 'border-border-warning' :
                isNight ? 'border-border-brand' :
                    'border-border-secondary';

    return (
        <div className={cn(
            "bg-surface rounded-xl border-2 p-5 flex flex-col gap-5 h-full relative transition-all duration-200 hover:shadow-md",
            cardBorderClass
        )}>
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "p-1.5 rounded-lg",
                            isSession ? "bg-bg-error-secondary text-fg-error-primary" :
                                isReady ? "bg-bg-success-secondary text-fg-success-primary" :
                                    isCleaning ? "bg-bg-warning-secondary text-fg-warning-primary" :
                                        isNight ? "bg-bg-brand-secondary text-fg-brand-primary" :
                                            "bg-bg-secondary text-fg-secondary"
                        )}>
                            <Waves size={18} />
                        </div>
                        <h3 className="text-lg font-bold text-fg-primary font-display">{tank.name}</h3>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 bg-bg-secondary px-2 py-1 rounded-md border border-border-secondary">
                    <Thermometer size={14} className="text-fg-tertiary" />
                    <span className="text-sm font-bold text-fg-primary">{tank.temperature?.toFixed(1) || '--'}°C</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Badge intent={statusBadgeIntent[tank.status]} size="md">
                    {statusLabels[tank.status]}
                </Badge>
                {/* Optional: Add connection status dot if needed */}
            </div>

            {/* Content Body */}
            <div className="flex-1">
                {isSession ? (
                    <div className="flex flex-col gap-4">
                        {/* Client Info */}
                        <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-xl border border-border-secondary">
                            <Avatar
                                src={tank.currentClient?.photoUrl}
                                fallback={tank.currentClient?.name?.slice(0, 2).toUpperCase() || 'CL'}
                                size="md"
                            />
                            <div>
                                <p className="text-sm font-bold text-fg-primary">{tank.currentClient?.name || 'Cliente'}</p>
                                <p className="text-xs text-fg-tertiary">{tank.totalSessions || 0} flutuações</p>
                            </div>
                        </div>
                        {/* Timer */}
                        <div className="bg-bg-error-secondary rounded-xl p-4 text-center border border-border-error-secondary">
                            <p className="text-xs text-fg-error-primary font-semibold mb-1">Tempo restante</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-2xl font-bold text-fg-error-primary font-display">{tank.sessionTimeRemaining}</span>
                                <span className="text-sm font-semibold text-fg-error-primary">min</span>
                            </div>
                        </div>
                    </div>
                ) : isCleaning ? (
                    <div className="bg-bg-warning-secondary rounded-xl p-5 text-center border border-border-warning-secondary flex flex-col justify-center h-full">
                        <p className="text-sm text-fg-warning-primary font-semibold">Limpeza em andamento</p>
                        <div className="flex items-baseline justify-center gap-1 mt-2">
                            <span className="text-2xl font-bold text-fg-warning-primary font-display">{tank.cleaningTimeRemaining}</span>
                            <span className="text-sm font-semibold text-fg-warning-primary">min</span>
                        </div>
                    </div>
                ) : (
                    <div className="h-full min-h-[120px] flex items-center justify-center text-center p-4 rounded-xl border border-dashed border-border-secondary bg-bg-secondary/20">
                        <p className="text-sm text-fg-tertiary">Tanque pronto para uso</p>
                    </div>
                )}
            </div>

            {/* Device Controls */}
            <div className="grid grid-cols-2 gap-2">
                {renderToggle('LEDs', tank.ledsOn, 'leds')}
                {renderToggle('Som', tank.musicOn, 'music')}
                {renderToggle('Bomba', tank.pumpOn, 'pump', isSession)}
                {renderToggle('Aquecedor', tank.heaterOn, 'heater')}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-border-secondary">
                <button
                    onClick={onViewDetails}
                    className="w-full py-2.5 rounded-lg border border-border-secondary bg-transparent text-fg-secondary text-sm font-semibold hover:bg-bg-secondary transition-colors flex items-center justify-center gap-2"
                >
                    <Play size={14} /> Ver detalhes
                </button>

                {(isReady || isNight) && (
                    <div className="grid grid-cols-2 gap-2">
                        <Button intent="primary" onClick={onStartSession} className="justify-center w-full">
                            <Play size={16} className="mr-2" /> Iniciar
                        </Button>
                        <Button intent="secondary" onClick={onStartCleaning} className="justify-center w-full">
                            <Droplets size={16} className="mr-2" /> Limpeza
                        </Button>
                    </div>
                )}

                {isSession && (
                    <Button
                        onClick={onStopSession}
                        intent="primary"
                        className="justify-center bg-bg-error-solid hover:bg-bg-error-solid_hover border-border-error-solid text-white w-full"
                    >
                        <Power size={16} className="mr-2" /> Encerrar Sessão
                    </Button>
                )}

                {isCleaning && (
                    <Button intent="secondary" onClick={onStopCleaning} className="justify-center w-full">
                        <Power size={16} className="mr-2" /> Finalizar Limpeza
                    </Button>
                )}
            </div>
        </div>
    );
};

