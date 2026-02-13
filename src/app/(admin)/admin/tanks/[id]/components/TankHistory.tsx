import React from 'react';
import { Card, Button, Avatar, Badge } from '@/components/ui';
import { History, Calendar, User, ArrowRight } from 'lucide-react';
import { TankProps } from '@/domain/entities/Tank';

interface TankHistoryProps {
    history: TankProps['sessionHistory'];
}

export const TankHistory: React.FC<TankHistoryProps> = ({ history = [] }) => {
    return (
        <Card className="h-full flex flex-col p-0 overflow-hidden border-border-secondary">
            <div className="p-4 border-b border-border-secondary flex justify-between items-center bg-bg-secondary/30">
                <div className="flex items-center gap-2">
                    <History size={18} className="text-fg-brand-primary" />
                    <h3 className="text-sm font-bold text-fg-primary uppercase tracking-wider">histórico de sessões</h3>
                </div>
                <Button intent="tertiary" size="sm" className="text-xs h-8">ver tudo</Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="flex flex-col gap-3">
                    {history.map((session) => (
                        <div key={session.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-bg-secondary transition-colors border border-transparent hover:border-border-secondary">
                            <div className="flex items-center gap-3">
                                <Avatar
                                    src={session.clientPhotoUrl}
                                    fallback={session.clientName.slice(0, 2).toUpperCase()}
                                    size="sm"
                                    className="bg-bg-tertiary"
                                />
                                <div>
                                    <p className="text-sm font-bold text-fg-primary leading-tight">{session.clientName.toLowerCase()}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-fg-tertiary bg-bg-secondary px-1.5 py-0.5 rounded-md border border-border-secondary">
                                            <Calendar size={8} />
                                            {new Date(session.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toLowerCase()}
                                        </span>
                                        {session.isGift && (
                                            <Badge intent="brand" size="sm" className="text-[10px] px-1.5 h-auto py-0.5">
                                                presente
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-bold text-fg-primary">
                                        {session.duration} min
                                    </p>
                                    <p className="text-xs font-medium text-fg-tertiary">
                                        {new Date(session.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <ArrowRight size={14} className="text-fg-tertiary opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                            </div>
                        </div>
                    ))}
                    {history.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 text-fg-tertiary opacity-60">
                            <History size={24} className="mb-2" />
                            <p className="text-sm">nenhum histórico disponível.</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
