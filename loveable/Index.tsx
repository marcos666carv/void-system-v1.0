import { useState } from 'react';
import { Header } from '@/components/Header';
import { VoidLogo } from '@/components/VoidLogo';
import { ServiceSelection } from '@/components/ServiceSelection';
import { QuantitySelector } from '@/components/QuantitySelector';
import { ScheduleSelector } from '@/components/ScheduleSelector';
import { AuthForm } from '@/components/AuthForm';
import { PaymentForm } from '@/components/PaymentForm';
import { VoidClubForm } from '@/components/VoidClubForm';
import { Service } from '@/types/void';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Step = 'select' | 'quantity' | 'schedule' | 'auth' | 'payment' | 'voidclub' | 'success';

const services: Service[] = [
  {
    id: 'flotation',
    type: 'flotation',
    name: 'Flutuação',
    description: 'Experiência de isolamento sensorial em tanque de flutuação',
    price: 190,
    duration: '60 minutos',
    icon: 'waves',
  },
  {
    id: 'massage',
    type: 'massage',
    name: 'Massagem',
    description: 'Massagem relaxante para corpo e mente',
    price: 220,
    duration: '60 minutos',
    icon: 'hand',
  },
  {
    id: 'combo',
    type: 'combo',
    name: 'Combos',
    description: 'Flutuação + Massagem com desconto especial',
    price: 350,
    duration: '120 minutos',
    icon: 'package',
  },
  {
    id: 'giftcard',
    type: 'giftcard',
    name: 'Vale Presente',
    description: 'Presenteie alguém com uma experiência única',
    price: 190,
    icon: 'gift',
  },
  {
    id: 'voidclub',
    type: 'voidclub',
    name: 'Void Club',
    description: 'Assinatura exclusiva com benefícios especiais',
    price: 0,
    icon: 'sparkles',
    highlighted: true,
    comingSoon: false,
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('select');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    if (service.type === 'voidclub') {
      setStep('voidclub');
    } else {
      setStep('quantity');
    }
  };

  const handleQuantityConfirm = (qty: number) => {
    setQuantity(qty);
    // Flotation, massage, combo need scheduling
    if (selectedService?.type === 'flotation' || selectedService?.type === 'massage' || selectedService?.type === 'combo') {
      setStep('schedule');
    } else {
      // Gift card goes directly to auth
      setStep('auth');
    }
  };

  const handleScheduleConfirm = (date: Date, time: string) => {
    setScheduledDate(date);
    setScheduledTime(time);
    setStep('auth');
  };

  const handleAuthComplete = () => {
    setStep('payment');
  };

  const handlePaymentComplete = () => {
    setStep('success');
    toast.success('Compra realizada com sucesso!');
  };

  const handleReset = () => {
    setStep('select');
    setSelectedService(null);
    setQuantity(1);
    setScheduledDate(null);
    setScheduledTime(null);
  };

  const total = selectedService ? selectedService.price * quantity : 0;

  // Progress indicator
  const getProgress = () => {
    const steps = ['select', 'quantity', 'schedule', 'auth', 'payment'];
    const currentIndex = steps.indexOf(step);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-4xl">
        {/* Progress bar for purchase flow */}
        {step !== 'select' && step !== 'voidclub' && step !== 'success' && (
          <div className="mb-8">
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
        )}

        {step === 'select' && (
          <ServiceSelection services={services} onSelect={handleServiceSelect} />
        )}

        {step === 'quantity' && selectedService && (
          <QuantitySelector 
            service={selectedService} 
            onConfirm={handleQuantityConfirm}
            onBack={() => setStep('select')}
          />
        )}

        {step === 'schedule' && (
          <ScheduleSelector 
            onConfirm={handleScheduleConfirm}
            onBack={() => setStep('quantity')}
          />
        )}

        {step === 'auth' && (
          <AuthForm 
            onComplete={handleAuthComplete}
            onBack={() => selectedService?.type === 'giftcard' ? setStep('quantity') : setStep('schedule')}
          />
        )}

        {step === 'payment' && (
          <PaymentForm 
            total={total}
            onComplete={handlePaymentComplete}
            onBack={() => setStep('auth')}
          />
        )}

        {step === 'voidclub' && (
          <VoidClubForm 
            onComplete={handleReset}
            onBack={() => setStep('select')}
          />
        )}

        {step === 'success' && (
          <Card className="bg-primary/5 border-2 border-primary max-w-md mx-auto">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary/20 w-fit">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Compra confirmada!</h3>
              <p className="text-muted-foreground mb-6">
                Você receberá um email com os detalhes da sua compra.
              </p>
              <div className="space-y-3">
                <Button variant="void" className="w-full" onClick={() => navigate('/dashboard')}>
                  Ver meus créditos
                </Button>
                <Button variant="outline" className="w-full" onClick={handleReset}>
                  Fazer nova compra
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="border-t border-border py-8 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <VoidLogo size="sm" className="mb-4 block" />
          <p>© 2024 Void Float. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
