import { Header } from '@/components/Header';
import { PreferencesForm } from '@/components/PreferencesForm';
import { useVoid } from '@/contexts/VoidContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone } from 'lucide-react';

export default function Profile() {
  const { user } = useVoid();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Meu Perfil</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* User Info */}
          <Card className="bg-card/50 backdrop-blur-sm h-fit">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                    {user?.name?.charAt(0) || 'V'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xl font-bold text-foreground">{user?.name || 'Visitante'}</p>
                  <p className="text-sm text-muted-foreground">Cliente Void</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground">{user?.email || 'Não informado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="text-foreground">{user?.phone || 'Não informado'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <PreferencesForm />
        </div>
      </main>
    </div>
  );
}
