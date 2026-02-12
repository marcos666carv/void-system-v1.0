import { LifecycleTable } from '@/components/LifecycleTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { VOID_LEVELS, VoidLevel } from '@/types/void';
import { Users, TrendingUp, RefreshCw, Star, Award, Sparkles } from 'lucide-react';

// Mock stats with KPI values
const lifecycleStats = [
  { level: 'iniciado' as VoidLevel, count: 145, percentage: 48.3, kpiValue: '67%', kpiChange: '+5%' },
  { level: 'explorador' as VoidLevel, count: 89, percentage: 29.7, kpiValue: 'R$ 285', kpiChange: '+12%' },
  { level: 'habitue' as VoidLevel, count: 42, percentage: 14.0, kpiValue: '8%', kpiChange: '-2%' },
  { level: 'mestre' as VoidLevel, count: 18, percentage: 6.0, kpiValue: '72', kpiChange: '+8' },
  { level: 'voidwalker' as VoidLevel, count: 6, percentage: 2.0, kpiValue: '24', kpiChange: '+3' },
];

const levelDescriptions: Record<VoidLevel, { who: string; action: string }> = {
  iniciado: { 
    who: 'Fez a 1ª flutuação',
    action: 'E-mail de boas-vindas educativo'
  },
  explorador: { 
    who: 'Comprou pacote ou voltou 3x',
    action: 'Desconto 5% em Gift Cards'
  },
  habitue: { 
    who: 'Assinante do Club ou mensal',
    action: 'Prioridade agenda + Massagem aniversário'
  },
  mestre: { 
    who: 'Evangelizador da marca',
    action: 'Sessões Experimentais + Kit Void'
  },
  voidwalker: { 
    who: 'Topo da pirâmide',
    action: 'Placa física + Jantar com fundadores'
  },
};

export default function AdminLifecycle() {
  const totalCustomers = lifecycleStats.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ciclo de Vida</h1>
          <p className="text-muted-foreground">
            Void Points e distribuição de clientes por nível
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-semibold text-primary">{totalCustomers} clientes</span>
        </div>
      </div>

      {/* Lifecycle Table */}
      <LifecycleTable stats={lifecycleStats} totalCustomers={totalCustomers} />

      {/* Level Benefits Grid */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Detalhes por Nível</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Object.entries(VOID_LEVELS).map(([key, level]) => {
            const desc = levelDescriptions[key as VoidLevel];
            const stat = lifecycleStats.find(s => s.level === key);
            
            return (
              <Card 
                key={key}
                className="bg-card/50 backdrop-blur-sm border-2 transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 group"
                style={{ 
                  borderColor: `${level.color}30`,
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full transition-transform group-hover:scale-125"
                      style={{ backgroundColor: level.color }}
                    />
                    <CardTitle className="text-base">{level.name}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {level.minXp.toLocaleString()} - {level.maxXp === Infinity ? '∞' : level.maxXp.toLocaleString()} XP
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Quem é</p>
                    <p className="text-sm text-foreground">{desc.who}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Benefício</p>
                    <p className="text-sm text-foreground">{level.benefit}</p>
                  </div>
                  <div 
                    className="pt-3 border-t flex items-center justify-between"
                    style={{ borderColor: `${level.color}20` }}
                  >
                    <span className="text-xs text-muted-foreground">Clientes</span>
                    <span 
                      className="text-lg font-bold"
                      style={{ color: level.color }}
                    >
                      {stat?.count || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
