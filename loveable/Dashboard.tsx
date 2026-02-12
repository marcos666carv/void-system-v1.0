import { Header } from '@/components/Header';
import { useVoid } from '@/contexts/VoidContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Waves, Hand, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useVoid();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">Olá, {user?.name || 'Visitante'}!</h1>
        <p className="text-muted-foreground mb-8">Gerencie seus créditos e agendamentos</p>

        {/* Credits */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Meus Créditos</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">Flutuações</CardTitle>
                  <Waves className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-primary mb-2">
                  {user?.credits.flotations || 0}
                </p>
                <p className="text-sm text-muted-foreground">sessões disponíveis</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">Massagens</CardTitle>
                  <Hand className="h-6 w-6 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-accent mb-2">
                  {user?.credits.massages || 0}
                </p>
                <p className="text-sm text-muted-foreground">sessões disponíveis</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 hover:border-primary/50 transition-colors">
            <CardContent className="py-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Pronto para flutuar?</h3>
              <p className="text-muted-foreground mb-6">
                Agende sua próxima sessão e desconecte-se do mundo
              </p>
              <Button variant="void" size="xl" asChild>
                <Link to="/schedule">
                  Agendar Sessão
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Upcoming Bookings */}
        {user && user.bookings.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-6">Próximos Agendamentos</h2>
            <div className="space-y-4">
              {user.bookings.map((booking) => (
                <Card key={booking.id} className="bg-card/50 backdrop-blur-sm">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/20">
                        <Waves className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Flutuação</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
