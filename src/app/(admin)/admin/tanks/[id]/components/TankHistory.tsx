import React from 'react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { History, Calendar, User, ArrowRight } from 'lucide-react';
import { TankProps } from '@/domain/entities/Tank';
import s from './TankHistory.module.css';

interface TankHistoryProps {
    history: TankProps['sessionHistory'];
}

export const TankHistory: React.FC<TankHistoryProps> = ({ history = [] }) => {
    return (
        <Card className={s.card}>
            <div className={s.header}>
                <div className={s.titleWrapper}>
                    <History size={18} className="text-[var(--primary)]" />
                    <h3 className={s.title}>histórico de sessões</h3>
                </div>
                <Button color="tertiary" size="sm" className="text-xs h-8">ver tudo</Button>
            </div>

            <div className={s.content}>
                <div className={s.list}>
                    {history.map((session) => (
                        <div key={session.id} className={s.item}>
                            <div className={s.itemLeft}>
                                <div className={s.avatarContainer}>
                                    {session.clientPhotoUrl ? (
                                        <img src={session.clientPhotoUrl} alt="" className={s.avatarImg} />
                                    ) : (
                                        <User size={14} className="opacity-40" />
                                    )}
                                </div>
                                <div className={s.clientInfo}>
                                    <p className={s.clientName}>{session.clientName.toLowerCase()}</p>
                                    <p className={s.clientCpf}>{session.clientCpf}</p>
                                    <div className={s.metaRow}>
                                        <span className={s.dateBadge}>
                                            <Calendar size={8} />
                                            {new Date(session.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toLowerCase()}
                                        </span>
                                        {session.isGift && (
                                            <span className={s.giftBadge}>
                                                presente
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={s.itemRight}>
                                <div className={s.durationInfo}>
                                    <p className={s.duration}>
                                        {session.duration} min
                                    </p>
                                    <p className={s.time}>
                                        {new Date(session.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <ArrowRight size={14} className={s.arrowIcon} />
                            </div>
                        </div>
                    ))}
                    {history.length === 0 && (
                        <div className={s.emptyState}>
                            nenhum histórico disponível.
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
