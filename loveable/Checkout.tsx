import { useState } from 'react';
import { Header } from '@/components/Header';
import { useVoid } from '@/contexts/VoidContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Trash2, CreditCard, QrCode, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cart, removeFromCart, clearCart, user, setUser } = useVoid();
  const navigate = useNavigate();
  const [step, setStep] = useState<'cart' | 'contact' | 'payment'>('cart');
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('pix');

  const total = cart.reduce((sum, item) => sum + item.service.price * item.quantity, 0);

  const handleProceedToContact = () => {
    if (cart.length === 0) {
      toast.error('Seu carrinho está vazio');
      return;
    }
    setStep('contact');
  };

  const handleProceedToPayment = () => {
    if (!contactInfo.name || !contactInfo.phone) {
      toast.error('Preencha nome e telefone');
      return;
    }
    setStep('payment');
  };

  const handleFinishOrder = () => {
    // Simulate order completion
    const credits = cart.reduce((acc, item) => {
      if (item.service.type === 'flotation' || item.service.type === 'combo') {
        return { ...acc, flotations: acc.flotations + item.quantity };
      }
      if (item.service.type === 'massage') {
        return { ...acc, massages: acc.massages + item.quantity };
      }
      return acc;
    }, { flotations: 0, massages: 0 });

    if (user) {
      setUser({
        ...user,
        name: contactInfo.name,
        phone: contactInfo.phone,
        email: contactInfo.email,
        credits: {
          flotations: user.credits.flotations + credits.flotations,
          massages: user.credits.massages + credits.massages,
        },
      });
    }

    clearCart();
    toast.success('Compra realizada com sucesso!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {['Carrinho', 'Contato', 'Pagamento'].map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index <= ['cart', 'contact', 'payment'].indexOf(step)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
              <span className="text-sm text-muted-foreground hidden sm:inline">{label}</span>
              {index < 2 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {step === 'cart' && (
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Seu Carrinho</CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Seu carrinho está vazio
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.service.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
                        >
                          <div>
                            <p className="font-medium text-foreground">{item.service.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity}x R$ {item.service.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-bold text-primary">
                              R$ {(item.service.price * item.quantity).toFixed(2)}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.service.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === 'contact' && (
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Seus Dados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                      placeholder="Seu nome"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">WhatsApp</Label>
                    <Input
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (opcional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'payment' && (
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Pagamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={paymentMethod === 'pix' ? 'default' : 'outline'}
                      className="h-20 flex flex-col gap-2"
                      onClick={() => setPaymentMethod('pix')}
                    >
                      <QrCode className="h-6 w-6" />
                      <span>Pix</span>
                    </Button>
                    <Button
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      className="h-20 flex flex-col gap-2"
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard className="h-6 w-6" />
                      <span>Cartão</span>
                    </Button>
                  </div>

                  {paymentMethod === 'pix' && (
                    <div className="p-6 rounded-lg bg-muted/30 border border-border text-center">
                      <div className="w-48 h-48 mx-auto bg-foreground/10 rounded-lg flex items-center justify-center mb-4">
                        <QrCode className="h-32 w-32 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Escaneie o QR Code para pagar via Pix
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <Label>Número do Cartão</Label>
                        <Input placeholder="0000 0000 0000 0000" className="mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Validade</Label>
                          <Input placeholder="MM/AA" className="mt-1" />
                        </div>
                        <div>
                          <Label>CVV</Label>
                          <Input placeholder="123" className="mt-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-card/50 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.service.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.service.name}
                    </span>
                    <span className="text-foreground">
                      R$ {(item.service.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>

                {step === 'cart' && (
                  <Button variant="void" size="lg" className="w-full" onClick={handleProceedToContact}>
                    Continuar
                  </Button>
                )}
                {step === 'contact' && (
                  <Button variant="void" size="lg" className="w-full" onClick={handleProceedToPayment}>
                    Ir para Pagamento
                  </Button>
                )}
                {step === 'payment' && (
                  <Button variant="void" size="lg" className="w-full" onClick={handleFinishOrder}>
                    Finalizar Compra
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
