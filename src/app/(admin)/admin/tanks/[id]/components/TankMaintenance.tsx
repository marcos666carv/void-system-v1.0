import React from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { Settings, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { TankPart } from '@/domain/entities/Tank';
import { cn } from '@/lib/utils/cn';

interface TankMaintenanceProps {
    parts: TankPart[];
    onIntervene: (partId: string) => void;
}

export const TankMaintenance: React.FC<TankMaintenanceProps> = ({ parts, onIntervene }) => {
    return (
        <Card className="flex flex-col p-0 overflow-hidden border-border-secondary h-full">
            <div className="p-4 border-b border-border-secondary flex justify-between items-center bg-bg-secondary/30">
                <div className="flex items-center gap-2">
                    <Settings size={18} className="text-fg-primary" />
                    <h3 className="text-sm font-bold text-fg-primary uppercase tracking-wider">manutenção de peças</h3>
                </div>
                <Button intent="tertiary" size="sm" className="text-xs h-8">ver histórico</Button>
            </div>

            <div className="flex-1 p-4">
                <div className="flex flex-col gap-3">
                    {parts.map((part) => (
                        <div key={part.id} className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary/20 border border-border-secondary">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    part.status === 'ok' ? "bg-bg-success-secondary text-fg-success-primary" :
                                        part.status === 'warning' ? "bg-bg-warning-secondary text-fg-warning-primary" :
                                            "bg-bg-error-secondary text-fg-error-primary"
                                )}>
                                    {part.status === 'ok' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-fg-primary leading-tight lowercase">{part.name}</p>
                                    <p className="text-[10px] font-mono font-medium text-fg-tertiary mt-0.5">
                                        s/n: {part.serialNumber}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 min-w-[30%] justify-end">
                                <div className="flex flex-col items-end w-full max-w-[120px]">
                                    <div className="flex justify-between w-full mb-1">
                                        <p className="text-[10px] font-bold text-fg-secondary">vida útil</p>
                                        <p className="text-[10px] font-bold text-fg-primary">{Math.round((part.currentHours / part.lifespanHours) * 100)}%</p>
                                    </div>
                                    <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-all duration-500",
                                                part.status === 'ok' ? "bg-fg-success-primary" :
                                                    part.status === 'warning' ? "bg-fg-warning-primary" :
                                                        "bg-fg-error-primary"
                                            )}
                                            style={{ width: `${Math.min(100, (part.currentHours / part.lifespanHours) * 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-fg-tertiary mt-1 text-right">
                                        trocado em {new Date(part.lastReplacedAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>

                                <Button
                                    intent="secondary"
                                    size="sm"
                                    onClick={() => onIntervene(part.id)}
                                    className="h-8 text-xs shrink-0"
                                >
                                    intervir
                                </Button>
                            </div>
                        </div>
                    ))}

                    {parts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 text-fg-tertiary opacity-60">
                            <Settings size={24} className="mb-2" />
                            <p className="text-sm">nenhuma peça cadastrada.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-3 bg-bg-brand-secondary/10 border-t border-border-secondary text-center">
                <p className="text-xs text-fg-secondary">
                    próxima manutenção geral em <strong className="text-fg-primary">5 dias</strong>
                </p>
            </div>
        </Card>
    );
};
