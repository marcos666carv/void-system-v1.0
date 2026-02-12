import React from 'react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import { TankPart } from '@/domain/entities/Tank';
import s from './TankMaintenance.module.css';

interface TankMaintenanceProps {
    parts: TankPart[];
    onIntervene: (partId: string) => void;
}

export const TankMaintenance: React.FC<TankMaintenanceProps> = ({ parts, onIntervene }) => {
    return (
        <Card className={s.card}>
            <div className={s.header}>
                <div className={s.titleWrapper}>
                    <Settings size={18} className="text-[var(--primary)]" />
                    <h3 className={s.title}>manutenção de peças</h3>
                </div>
                <Button color="tertiary" size="sm" className="text-xs h-8">ver histórico</Button>
            </div>

            <div className={s.content}>
                <div className={s.list}>
                    {parts.map((part) => (
                        <div key={part.id} className={s.item}>
                            <div className={s.itemLeft}>
                                <div className={`${s.iconBox} ${part.status === 'ok' ? s.statusOk : part.status === 'warning' ? s.statusWarning : s.statusCritical}`}>
                                    {part.status === 'ok' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                                </div>
                                <div>
                                    <p className={s.itemName}>{part.name}</p>
                                    <p className={s.itemSerial}>
                                        s/n: {part.serialNumber}
                                    </p>
                                </div>
                            </div>

                            <div className={s.itemRight}>
                                <div className={s.stats}>
                                    <p className={s.lifeText}>
                                        {Math.round((part.currentHours / part.lifespanHours) * 100)}% vida útil
                                    </p>
                                    <div className={s.progressBar}>
                                        <div
                                            className={`${s.progressFill} ${part.status === 'ok' ? s.bgOk : part.status === 'warning' ? s.bgWarning : s.bgCritical}`}
                                            style={{ width: `${Math.min(100, (part.currentHours / part.lifespanHours) * 100)}%` }}
                                        />
                                    </div>
                                    <p className={s.replaceDate}>
                                        trocado em {new Date(part.lastReplacedAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>

                                <div className={s.actionBtn}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onIntervene(part.id)}
                                        style={{ height: '32px', fontSize: '0.75rem' }}
                                    >
                                        intervir
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {parts.length === 0 && (
                        <div className={s.emptyState}>
                            nenhuma peça cadastrada.
                        </div>
                    )}
                </div>
            </div>
            <div className={s.footer}>
                <p className={s.footerText}>
                    próxima manutenção geral em <strong style={{ color: 'var(--foreground)' }}>5 dias</strong>
                </p>
            </div>
        </Card>
    );
};
