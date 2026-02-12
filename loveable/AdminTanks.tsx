import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVoid } from '@/contexts/VoidContext';
import { TankCard } from '@/components/TankCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Location } from '@/types/void';

export default function AdminTanks() {
  const { tanks, updateTank } = useVoid();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const locationFilter = (searchParams.get('location') as Location) || 'curitiba';
  
  const [sessionDialog, setSessionDialog] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [musicDuration, setMusicDuration] = useState(10);
  const [volume, setVolume] = useState([70]);

  const filteredTanks = tanks.filter((t) => t.location === locationFilter);

  const handleConfirmSession = () => {
    if (!sessionDialog) return;
    updateTank(sessionDialog, {
      status: 'busy',
      ledOn: true,
      soundOn: true,
      sessionTimeRemaining: sessionDuration,
    });
    toast.success('Sessão iniciada!');
    setSessionDialog(null);
  };

  const handleStartCleaning = (tankId: string) => {
    updateTank(tankId, { status: 'cleaning', cleaningTimeRemaining: 20 });
    toast.success('Ciclo de limpeza iniciado');
  };

  const freeTanks = filteredTanks.filter((t) => t.status === 'free').length;
  const busyTanks = filteredTanks.filter((t) => t.status === 'busy').length;
  const cleaningTanks = filteredTanks.filter((t) => t.status === 'cleaning').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Banheiras</h1>
          <p className="text-muted-foreground">Gerenciamento em tempo real</p>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-free" />
            <span className="text-muted-foreground">{freeTanks} Livre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-busy" />
            <span className="text-muted-foreground">{busyTanks} Em uso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-cleaning" />
            <span className="text-muted-foreground">{cleaningTanks} Limpeza</span>
          </div>
        </div>
      </div>

      <Tabs value={locationFilter} onValueChange={(v) => setSearchParams({ location: v })}>
        <TabsList>
          <TabsTrigger value="curitiba" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Curitiba
          </TabsTrigger>
          <TabsTrigger value="campo-largo" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Campo Largo
          </TabsTrigger>
        </TabsList>

        <TabsContent value={locationFilter} className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredTanks.map((tank) => (
              <TankCard
                key={tank.id}
                tank={tank}
                onStartSession={() => setSessionDialog(tank.id)}
                onStartCleaning={() => handleStartCleaning(tank.id)}
                onViewDetails={() => navigate(`/admin/tanks/${tank.id}`)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Session Dialog */}
      <Dialog open={!!sessionDialog} onOpenChange={() => setSessionDialog(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Iniciar Sessão</DialogTitle>
            <DialogDescription>Configure os parâmetros da sessão</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <Label>Duração da sessão (minutos)</Label>
              <Select value={sessionDuration.toString()} onValueChange={(v) => setSessionDuration(Number(v))}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[30, 45, 60, 75, 90].map((min) => (
                    <SelectItem key={min} value={min.toString()}>{min} minutos</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Duração da música inicial (minutos)</Label>
              <Select value={musicDuration.toString()} onValueChange={(v) => setMusicDuration(Number(v))}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20].map((min) => (
                    <SelectItem key={min} value={min.toString()}>{min} minutos</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Volume ({volume[0]}%)</Label>
              <Slider value={volume} onValueChange={setVolume} min={0} max={100} step={5} className="mt-2" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSessionDialog(null)}>Cancelar</Button>
            <Button variant="void" onClick={handleConfirmSession}>Iniciar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
