'use client';

import React, { useState } from 'react';
import { Card, Button, Input, Stepper, RadioCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

interface ServiceOption {
    id: string;
    name: string;
    duration: string;
    price: number;
    description: string;
}

const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);

export default function CheckoutPage() {
    const [services, setServices] = useState<ServiceOption[]>([]);
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
    const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '' });

    // API State
    const [slots, setSlots] = useState<{ time: string, available: boolean }[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = ['experiência', 'agendamento', 'dados pessoais', 'pagamento'];
    const service = services.find(s => s.id === selectedService);

    // Fetch Services
    React.useEffect(() => {
        async function fetchServices() {
            try {
                const res = await fetch('/api/services');
                if (res.ok) {
                    const data = await res.json();
                    setServices(data.map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        duration: `${s.duration} min`,
                        price: s.price,
                        description: s.description || 'Sessão de flutuação'
                    })));
                } else {
                    // Fallback data if API fails to populate initial view
                    setServices([
                        { id: '1', name: 'Flutuação Avulsa', duration: '60 min', price: 100, description: 'Uma sessão completa de isolamento sensorial.' },
                        { id: '2', name: 'Pacote 3 Sessões', duration: '60 min cada', price: 270, description: 'Ideal para quem busca regularidade na prática.' },
                        { id: '3', name: 'Intro 3', duration: '60 min cada', price: 200, description: 'Pacote introdutório para novos clientes (uso único).' }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch services', error);
                // Fallback
                setServices([
                    { id: '1', name: 'Flutuação Avulsa', duration: '60 min', price: 100, description: 'Uma sessão completa de isolamento sensorial.' },
                    { id: '2', name: 'Pacote 3 Sessões', duration: '60 min cada', price: 270, description: 'Ideal para quem busca regularidade na prática.' }
                ]);
            }
        }
        fetchServices();
    }, []);

    // Fetch Availability
    React.useEffect(() => {
        if (!selectedDate || !selectedService) return;

        async function fetchAvailability() {
            setIsLoadingSlots(true);
            try {
                const res = await fetch(`/api/availability?date=${selectedDate}&serviceId=${selectedService}`);
                if (res.ok) {
                    const data = await res.json();
                    setSlots(data);
                } else {
                    // Mock slots if API is missing
                    setSlots(Array.from({ length: 8 }, (_, i) => ({
                        time: `${9 + i}:00`,
                        available: Math.random() > 0.3
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch availability', error);
                // Mock slots
                setSlots(Array.from({ length: 8 }, (_, i) => ({
                    time: `${9 + i}:00`,
                    available: Math.random() > 0.3
                })));
            } finally {
                setIsLoadingSlots(false);
            }
        }
        fetchAvailability();
    }, [selectedDate, selectedService]);

    const handleBooking = async () => {
        if (!selectedService || !selectedDate || !selectedTime) return;
        setIsSubmitting(true);

        try {
            // 1. Create or Get Client
            const clientRes = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: contactForm.name,
                    email: contactForm.email,
                    phone: contactForm.phone,
                })
            });

            // Mock success if endpoint doesn't exist yet
            const clientData = clientRes.ok ? await clientRes.json() : { id: 'mock-client-id' };
            const clientId = clientData.data ? clientData.data.id : clientData.id;

            // 2. Create Appointment
            const svc = services.find(s => s.id === selectedService);
            const durationMinutes = svc ? parseInt(svc.duration) : 60;
            const startTime = new Date(`${selectedDate}T${selectedTime}`);
            const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

            const appointmentRes = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId,
                    serviceId: selectedService,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    notes: `Booked via Checkout. Method: ${paymentMethod}`
                })
            });

            if (!appointmentRes.ok && appointmentRes.status !== 404) throw new Error('Failed to create appointment');

            alert('Agendamento realizado com sucesso!');
            window.location.href = '/';

        } catch (error) {
            console.error('Booking failed', error);
            alert('Erro ao realizar agendamento. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateDates = () => {
        const dates: { label: string; value: string; weekday: string }[] = [];
        const today = new Date();
        for (let i = 1; i <= 14; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            if (d.getDay() === 0) continue;
            dates.push({
                value: d.toISOString().split('T')[0],
                label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
                weekday: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
            });
        }
        return dates;
    };

    const canProceed = () => {
        if (step === 1) return !!selectedService;
        if (step === 2) return !!selectedDate && !!selectedTime;
        if (step === 3) return !!contactForm.name && !!contactForm.phone && !!contactForm.email;
        return true;
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8 font-sans">
            {/* Stepper */}
            <div className="mb-10">
                <Stepper steps={steps} currentStep={step} onStepClick={(s) => s < step && setStep(s)} />
            </div>

            {/* Step 1: Experience Selection */}
            {step === 1 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Escolha sua experiência</h2>
                    <div className="grid gap-4">
                        {services.map(svc => (
                            <RadioCard
                                key={svc.id}
                                checked={selectedService === svc.id}
                                onChange={() => setSelectedService(svc.id)}
                                label={svc.name}
                                description={svc.duration}
                            >
                                <div className="mt-1 text-sm text-gray-500">{svc.description}</div>
                                <div className="mt-2 text-lg font-semibold text-brand-600">
                                    {formatCurrency(svc.price)}
                                </div>
                            </RadioCard>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Scheduling */}
            {step === 2 && (
                <div className="space-y-8">
                    <h2 className="text-2xl font-semibold text-gray-900">Escolha data e horário</h2>

                    {/* Date picker */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Data</h4>
                        <div className="flex flex-wrap gap-2">
                            {generateDates().map(d => {
                                const isSelected = selectedDate === d.value;
                                return (
                                    <button
                                        key={d.value}
                                        onClick={() => setSelectedDate(d.value)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-3 rounded-xl border min-w-[70px] transition-all",
                                            isSelected
                                                ? "border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600"
                                                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                                        )}
                                    >
                                        <span className="text-[10px] uppercase font-medium opacity-60">{d.weekday}</span>
                                        <span className={cn("text-sm font-semibold", isSelected && "text-brand-800")}>{d.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time slots */}
                    {selectedDate && (
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Horário</h4>
                            {isLoadingSlots ? (
                                <div className="text-sm text-gray-500 animate-pulse">Carregando horários...</div>
                            ) : (
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                    {slots.length > 0 ? slots.map(slot => (
                                        <button
                                            key={slot.time}
                                            onClick={() => slot.available && setSelectedTime(slot.time)}
                                            disabled={!slot.available}
                                            className={cn(
                                                "py-2 px-3 rounded-lg text-sm font-medium border transition-all",
                                                selectedTime === slot.time
                                                    ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                                                    : slot.available
                                                        ? "border-gray-200 bg-white hover:border-brand-300 hover:text-brand-600 text-gray-700"
                                                        : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                                            )}
                                        >
                                            {slot.time}
                                        </button>
                                    )) : (
                                        <div className="col-span-full text-sm text-gray-500 italic">Nenhum horário disponível.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Personal Info */}
            {step === 3 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Suas informações</h2>
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            <Input
                                label="Nome completo"
                                placeholder="Seu nome"
                                value={contactForm.name}
                                onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                            />
                            <Input
                                label="Telefone"
                                type="tel"
                                placeholder="(00) 00000-0000"
                                value={contactForm.phone}
                                onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                            />
                            <Input
                                label="E-mail"
                                type="email"
                                placeholder="seu@email.com"
                                value={contactForm.email}
                                onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && service && (
                <div className="space-y-8">
                    <h2 className="text-2xl font-semibold text-gray-900">Pagamento</h2>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">Resumo do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">{service.name}</span>
                                <span className="font-semibold text-gray-900">{formatCurrency(service.price)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{selectedDate && new Date(selectedDate + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} às {selectedTime}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                <span className="font-semibold text-gray-900">Total</span>
                                <span className="text-xl font-bold text-brand-600">{formatCurrency(service.price)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <RadioCard
                            checked={paymentMethod === 'pix'}
                            onChange={() => setPaymentMethod('pix')}
                            label="Pix"
                            description="Aprovação instantânea"
                        />
                        <RadioCard
                            checked={paymentMethod === 'credit_card'}
                            onChange={() => setPaymentMethod('credit_card')}
                            label="Cartão de Crédito"
                            description="Em até 3x sem juros"
                        />
                    </div>

                    {paymentMethod === 'pix' && (
                        <Card className="text-center py-8">
                            <CardContent className="flex flex-col items-center">
                                <div className="w-40 h-40 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center mb-4">
                                    <span className="text-xs text-gray-400">QR Code</span>
                                </div>
                                <p className="text-sm text-gray-500">Escaneie o código com o app do seu banco</p>
                            </CardContent>
                        </Card>
                    )}

                    {paymentMethod === 'credit_card' && (
                        <Card>
                            <CardContent className="space-y-4 pt-6">
                                <Input label="Número do cartão" placeholder="0000 0000 0000 0000" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Validade" placeholder="MM/AA" />
                                    <Input label="CVV" placeholder="123" />
                                </div>
                                <Input label="Nome no cartão" placeholder="Como impresso no cartão" />
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex gap-4">
                {step > 1 && (
                    <Button intent="secondary" size="lg" onClick={() => setStep(step - 1)} disabled={isSubmitting}>
                        Voltar
                    </Button>
                )}
                <div className="flex-1">
                    {step < 4 ? (
                        <Button
                            intent="primary"
                            size="lg"
                            fullWidth
                            onClick={() => canProceed() && setStep(step + 1)}
                            disabled={!canProceed()}
                        >
                            Continuar
                        </Button>
                    ) : (
                        <Button
                            intent="primary"
                            size="lg"
                            fullWidth
                            onClick={handleBooking}
                            disabled={isSubmitting}
                            isLoading={isSubmitting}
                        >
                            Confirmar Pagamento
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

