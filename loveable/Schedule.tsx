import { Header } from '@/components/Header';
import { ScheduleCalendar } from '@/components/ScheduleCalendar';

export default function Schedule() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">Agendar Sessão</h1>
        <p className="text-muted-foreground mb-8">
          Selecione uma data e horário para sua próxima experiência Void
        </p>

        <ScheduleCalendar />
      </main>
    </div>
  );
}
