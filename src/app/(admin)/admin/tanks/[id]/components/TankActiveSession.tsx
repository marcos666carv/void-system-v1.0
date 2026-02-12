import React from 'react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { Users, Phone, Star, MessageSquare } from 'lucide-react';
import { TankProps } from '@/domain/entities/Tank';
import { VOID_LEVEL_CONFIG, VoidLevel } from '@/domain/value-objects/VoidLevel';
import s from './TankActiveSession.module.css';

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
        <Card className={s.card}>
            {/* Background Gradient/Image Effect */}
            <div className={s.backgroundEffect} />

            <div className={s.content}>
                <div className={s.header}>
                    <div className={s.statusTag}>
                        <div className={s.pulseDot} />
                        <span style={{ marginBottom: '2px' }}>sessão ativa</span>
                    </div>
                    <div className={s.timerWrapper}>
                        <p className={s.timerLabel}>tempo restante</p>
                        <p className={s.timerValue}>
                            {tank.sessionTimeRemaining}:00
                        </p>
                    </div>
                </div>

                <div className={s.mainInfo}>
                    <div className={s.avatarContainer}>
                        {currentClient.photoUrl ? (
                            <img src={currentClient.photoUrl} alt={currentClient.name} className={s.avatarImg} />
                        ) : (
                            <div className={s.placeholderAvatar}>
                                <Users size={40} />
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className={s.clientName}>{currentClient.name.toLowerCase()}</h2>

                        <div className={s.clientMeta}>
                            {currentClient.cpf && <p className={s.metaText}>{currentClient.cpf}</p>}
                            <p className={s.metaText}>
                                {currentClient.email} &bull; {currentClient.phone}
                            </p>
                        </div>

                        <div className={s.badges}>
                            {currentClient.isGift && (
                                <span className={s.giftBadge}>
                                    presente
                                </span>
                            )}
                            <span
                                className={s.memberBadge}
                                style={{
                                    backgroundColor: `${levelConfig.color}20`,
                                    color: levelConfig.color,
                                    borderColor: `${levelConfig.color}40`
                                }}
                            >
                                <Star size={12} fill="currentColor" />
                                <span>{levelConfig.label.toLowerCase()}</span>
                            </span>
                        </div>
                    </div>

                    <div className={s.statsGrid}>
                        <div className={s.statBox}>
                            <span className={s.statLabel}>total gasto</span>
                            <span className={s.statValue}>R$ 3.450</span>
                        </div>
                        <div className={s.statBox}>
                            <span className={s.statLabel}>flutuações</span>
                            <span className={s.statValue}>12</span>
                        </div>
                    </div>
                </div>

                <div className={s.footer}>
                    <Button color="tertiary" className={s.outlineButton}>
                        <Phone size={14} className="mr-2" />
                        ligar
                    </Button>
                    <Button color="tertiary" className={s.outlineButton}>
                        <MessageSquare size={14} className="mr-2" />
                        whats
                    </Button>
                </div>

                <div className={s.footerAction}>
                    <Button color="primary" onClick={onEndSession} className={`${s.dangerButton} w-full`}>
                        encerrar sessão
                    </Button>
                </div>
            </div>
        </Card>
    );
};
