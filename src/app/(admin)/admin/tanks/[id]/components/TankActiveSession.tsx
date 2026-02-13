import React from 'react';
import { Card, Button, Avatar, Badge } from '@/components/ui';
import { Phone, MessageSquare, Star } from 'lucide-react';
import { TankProps } from '@/domain/entities/Tank';
import { VOID_LEVEL_CONFIG, VoidLevel } from '@/domain/value-objects/VoidLevel';

interface TankActiveSessionProps {
    tank: TankProps;
    onEndSession: () => void;
}

export const TankActiveSession: React.FC<TankActiveSessionProps> = ({ tank, onEndSession }) => {
    if (tank.status !== 'in_use' || !tank.currentClient) return null;

    const { currentClient } = tank;
    const level = (currentClient.level as VoidLevel) || 'iniciado';
    const levelConfig = VOID_LEVEL_CONFIG[level];

    return (
        <Card className="relative overflow-hidden border-border-secondary p-0 h-full">
            {/* Background Gradient/Image Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-bg-brand-secondary/30 to-transparent pointer-events-none" />

            <div className="relative z-10 p-6 flex flex-col h-full gap-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fg-error-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-fg-error-primary"></span>
                        </span>
                        <span className="text-xs font-bold text-fg-error-primary uppercase tracking-wider">sessão ativa</span>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center gap-4">
                    <Avatar
                        src={currentClient.photoUrl}
                        fallback={currentClient.name.slice(0, 2).toUpperCase()}
                        size="2xl"
                        className="border-4 border-surface shadow-xl"
                    />

                    <div>
                        <h2 className="text-2xl font-bold text-fg-primary font-display">{currentClient.name.toLowerCase()}</h2>
                        <div className="flex items-center justify-center gap-2 text-sm text-fg-secondary mt-1">
                            <span>{currentClient.email}</span>
                            <span className="text-fg-quaternary">•</span>
                            <span>{currentClient.phone}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {currentClient.isGift && (
                            <Badge intent="brand">presente</Badge>
                        )}
                        <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
                            style={{
                                backgroundColor: `${levelConfig.color}15`,
                                color: levelConfig.color,
                                borderColor: `${levelConfig.color}30`
                            }}
                        >
                            <Star size={12} fill="currentColor" />
                            <span>{levelConfig.label.toLowerCase()}</span>
                        </span>
                    </div>
                </div>

                {/* Timer Large */}
                <div className="p-6 bg-surface/50 rounded-2xl border border-border-secondary text-center backdrop-blur-sm">
                    <p className="text-xs font-bold text-fg-tertiary uppercase tracking-wider mb-2">tempo restante</p>
                    <p className="text-5xl font-bold text-fg-primary font-display tabular-nums tracking-tight">
                        {tank.sessionTimeRemaining}<span className="text-2xl text-fg-tertiary ml-1">min</span>
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <Button intent="secondary" className="justify-center w-full">
                        <Phone size={14} className="mr-2" />
                        Ligar
                    </Button>
                    <Button intent="secondary" className="justify-center w-full">
                        <MessageSquare size={14} className="mr-2" />
                        Whats
                    </Button>
                </div>

                <Button
                    intent="primary"
                    onClick={onEndSession}
                    className="w-full justify-center bg-bg-error-solid hover:bg-bg-error-solid_hover border-border-error-solid text-white"
                >
                    Encerrar Sessão
                </Button>
            </div>
        </Card>
    );
};
