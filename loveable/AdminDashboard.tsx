import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Waves,
  Calendar,
  AlertTriangle
} from 'lucide-react';

// Mock data
const salesMetrics = {
  totalRevenue: 45230,
  totalSessions: 312,
  averageTicket: 145,
  tankIdlePercentage: 18,
  peakHours: ['10:30', '14:00', '18:30'],
  topServices: [
    { service: 'Flutuação', count: 180 },
    { service: 'Massagem', count: 85 },
    { service: 'Combo', count: 47 },
  ],
};

const engagementActions = [
  { id: '1', title: '12 clientes inativos há 30+ dias', type: 'winback', priority: 'high' },
  { id: '2', title: '5 aniversariantes esta semana', type: 'birthday', priority: 'medium' },
  { id: '3', title: '8 clientes prontos para upgrade', type: 'upsell', priority: 'medium' },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Geral</h1>
        <p className="text-muted-foreground">Visão geral de vendas e operações</p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              R$ {salesMetrics.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sessões Realizadas
            </CardTitle>
            <Waves className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{salesMetrics.totalSessions}</p>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Médio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              R$ {salesMetrics.averageTicket}
            </p>
            <p className="text-xs text-muted-foreground">Por sessão</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo Ocioso
            </CardTitle>
            <Clock className="h-4 w-4 text-status-cleaning" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {salesMetrics.tankIdlePercentage}%
            </p>
            <p className="text-xs text-muted-foreground">Média das banheiras</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Horários de Pico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {salesMetrics.peakHours.map((hour) => (
                <div 
                  key={hour}
                  className="flex-1 p-4 rounded-lg bg-primary/10 border border-primary/30 text-center"
                >
                  <p className="text-2xl font-bold font-mono text-primary">{hour}</p>
                  <p className="text-xs text-muted-foreground">Alta demanda</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Serviços Mais Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {salesMetrics.topServices.map((item, index) => (
              <div key={item.service} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{item.service}</span>
                </div>
                <span className="font-bold text-foreground">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Engagement Actions */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-status-cleaning" />
            Ações de Engajamento Sugeridas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {engagementActions.map((action) => (
              <div 
                key={action.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <span className="text-foreground">{action.title}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  action.priority === 'high' 
                    ? 'bg-status-busy/20 text-status-busy' 
                    : 'bg-status-cleaning/20 text-status-cleaning'
                }`}>
                  {action.priority === 'high' ? 'Alta' : 'Média'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
