import { useParams, useNavigate } from 'react-router-dom';
import { useVoid } from '@/contexts/VoidContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, Waves, Thermometer, Calendar, Clock, Zap,
  DollarSign, Hash, Gift, User, Wrench,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { TankStatus } from '@/types/void';

const safeDate = (d: unknown): Date => {
  const date = new Date(d as any);
  return isNaN(date.getTime()) ? new Date() : date;
};

const statusConfig: Record<TankStatus, { label: string; color: string; bgColor: string }> = {
  free: { label: 'Livre', color: 'text-status-free', bgColor: 'bg-status-free/10' },
  busy: { label: 'Em Sessão', color: 'text-status-busy', bgColor: 'bg-status-busy/10' },
  cleaning: { label: 'Limpeza', color: 'text-status-cleaning', bgColor: 'bg-status-cleaning/10' },
  night: { label: 'Noturno', color: 'text-muted-foreground', bgColor: 'bg-muted/50' },
  standby: { label: 'Repouso', color: 'text-muted-foreground', bgColor: 'bg-muted/50' },
};

export default function AdminTankDetail() {
  const { tankId } = useParams<{ tankId: string }>();
  const navigate = useNavigate();
  const { tanks } = useVoid();

  const tank = tanks.find((t) => t.id === tankId);

  if (!tank) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Banheira não encontrada</p>
        <Button variant="outline" onClick={() => navigate('/admin/tanks')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
      </div>
    );
  }

  const status = statusConfig[tank.status];
  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/tanks')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={cn('p-2.5 rounded-xl', status.bgColor)}>
              <Waves className={cn('h-5 w-5', status.color)} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{tank.name}</h1>
              <p className="text-sm text-muted-foreground capitalize">{tank.location.replace('-', ' ')}</p>
            </div>
            <Badge variant="outline" className={cn('ml-2', status.color, status.bgColor, 'border-transparent')}>
              {status.label}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-primary" />
          <span className="text-2xl font-mono font-bold">{tank.temperature.toFixed(1)}°C</span>
        </div>
      </div>

      <Separator />

      {/* Implementation Date */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>Implementada em {format(safeDate(tank.implementedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
      </div>

      {/* Current Client */}
      {tank.status === 'busy' && tank.currentClient && (
        <Card className="border-status-busy/30 bg-status-busy/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cliente em Sessão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-primary/20">
                <AvatarImage src={tank.currentClient.photoUrl} alt={tank.currentClient.name} />
                <AvatarFallback className="bg-primary/10 font-semibold">{getInitials(tank.currentClient.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{tank.currentClient.name}</p>
                  {tank.currentClient.isGift && (
                    <Badge variant="secondary" className="gap-1 text-xs"><Gift className="h-3 w-3" /> Presente</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-mono">{tank.currentClient.cpf}</p>
                <p className="text-sm text-muted-foreground">{tank.currentClient.email} · {tank.currentClient.phone}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-2xl font-bold text-status-busy font-mono">{tank.sessionTimeRemaining} min</p>
                <p className="text-xs text-muted-foreground">restantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Hash, label: 'Sessões', value: tank.totalSessions.toLocaleString(), color: 'text-primary' },
          { icon: Clock, label: 'Horas de uso', value: `${tank.totalUsageHours}h`, color: 'text-foreground' },
          { icon: Clock, label: 'Horas ociosas', value: `${tank.totalIdleHours}h`, color: 'text-muted-foreground' },
          { icon: Zap, label: 'Energia', value: `${tank.energyConsumedKwh} kWh`, color: 'text-status-cleaning' },
          { icon: DollarSign, label: 'Receita', value: `R$ ${tank.revenueGenerated.toLocaleString()}`, color: 'text-status-free' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card/50">
            <CardContent className="py-4 text-center space-y-1">
              <stat.icon className={cn('h-4 w-4 mx-auto', stat.color)} />
              <p className={cn('text-xl font-bold font-mono', stat.color)}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Parts */}
      {tank.parts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="h-4 w-4" /> Peças e Manutenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tank.parts.map((part) => (
                <div key={part.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div>
                    <p className="font-medium">{part.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{part.serialNumber}</p>
                  </div>
                  <Badge variant="outline">
                    Trocada em {format(safeDate(part.lastReplacedAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session History */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" /> Histórico de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tank.sessionHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Nenhum histórico disponível</p>
          ) : (
            <div className="space-y-2">
              {tank.sessionHistory.map((session) => (
                <div key={session.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.clientPhotoUrl} />
                    <AvatarFallback className="text-xs bg-primary/10">
                      {getInitials(session.clientName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{session.clientName}</p>
                      {session.isGift && (
                        <Gift className="h-3 w-3 text-accent shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{session.clientCpf}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium">{format(safeDate(session.date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    <p className="text-xs text-muted-foreground">{session.duration} min</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
