import { useState } from 'react';
import { Header } from '@/components/Header';
import { TankCard } from '@/components/TankCard';
import { useVoid } from '@/contexts/VoidContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

export default function Admin() {
  const { tanks, updateTank } = useVoid();
  const [sessionDialog, setSessionDialog] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [musicDuration, setMusicDuration] = useState(10);
  const [volume, setVolume] = useState([70]);
  const [delayStart, setDelayStart] = useState(5);

  const handleStartSession = (tankId: string) => {
    setSessionDialog(tankId);
  };

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
    updateTank(tankId, {
      status: 'cleaning',
      cleaningTimeRemaining: 20,
    });
    toast.success('Ciclo de limpeza iniciado');
  };

  const freeTanks = tanks.filter((t) => t.status === 'free').length;
  const busyTanks = tanks.filter((t) => t.status === 'busy').length;
  const cleaningTanks = tanks.filter((t) => t.status === 'cleaning').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Controle de Tanques</h1>
            <p className="text-muted-foreground">Dashboard administrativo</p>
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tanks.map((tank) => (
            <TankCard
              key={tank.id}
              tank={tank}
              onStartSession={() => handleStartSession(tank.id)}
              onStartCleaning={() => handleStartCleaning(tank.id)}
            />
          ))}
        </div>
      </main>

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
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[30, 45, 60, 75, 90].map((min) => (
                    <SelectItem key={min} value={min.toString()}>
                      {min} minutos
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Duração da música inicial (minutos)</Label>
              <Select value={musicDuration.toString()} onValueChange={(v) => setMusicDuration(Number(v))}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20].map((min) => (
                    <SelectItem key={min} value={min.toString()}>
                      {min} minutos
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Volume ({volume[0]}%)</Label>
              <Slider
                value={volume}
                onValueChange={setVolume}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Delay para início (minutos)</Label>
              <Select value={delayStart.toString()} onValueChange={(v) => setDelayStart(Number(v))}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 2, 5, 7, 10].map((min) => (
                    <SelectItem key={min} value={min.toString()}>
                      {min} minutos
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSessionDialog(null)}>
              Cancelar
            </Button>
            <Button variant="void" onClick={handleConfirmSession}>
              Iniciar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
