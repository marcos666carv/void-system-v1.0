'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';

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
                }
            } catch (error) {
                console.error('Failed to fetch services', error);
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
                }
            } catch (error) {
                console.error('Failed to fetch availability', error);
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

            if (!clientRes.ok) throw new Error('Failed to create/fetch client');
            const clientData = await clientRes.json();
            const clientId = clientData.data ? clientData.data.id : clientData.id; // Handle wrapped or direct response

            // 2. Create Appointment
            // Calculate end time based on duration
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

            if (!appointmentRes.ok) throw new Error('Failed to create appointment');

            alert('Agendamento realizado com sucesso!');
            window.location.href = '/'; // Redirect to home or success page

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
        if (step === 3) return contactForm.name && contactForm.phone && contactForm.email;
        return true;
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: 'var(--space-7) var(--space-5)' }}>
            {/* Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-7)' }}>
                {steps.map((s, i) => (
                    <React.Fragment key={i}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                            cursor: i + 1 < step ? 'pointer' : 'default',
                        }}
                            onClick={() => i + 1 < step && setStep(i + 1)}
                        >
                            <div style={{
                                width: '28px', height: '28px', borderRadius: 'var(--radius-full)',
                                backgroundColor: i + 1 <= step ? 'var(--primary)' : 'var(--border)',
                                color: i + 1 <= step ? 'white' : 'var(--foreground)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 'var(--font-size-xs)', fontWeight: 600,
                                transition: 'all var(--duration-fast) var(--ease-antigravity)',
                            }}>
                                {i + 1 < step ? '✓' : i + 1}
                            </div>
                            <span style={{
                                fontSize: 'var(--font-size-xs)', fontWeight: 600,
                                opacity: i + 1 <= step ? 1 : 0.4,
                            }}>{s}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div style={{ flex: 1, height: '1px', backgroundColor: i + 1 < step ? 'var(--primary)' : 'var(--border)', transition: 'background-color var(--duration-fast)' }} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Step 1: Experience Selection */}
            {step === 1 && (
                <div>
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--space-6)' }}>escolha sua experiência</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {services.map(svc => {
                            const isSelected = selectedService === svc.id;
                            return (
                                <Card
                                    key={svc.id}

                                    padding="lg"
                                    onClick={() => setSelectedService(svc.id)}
                                    style={{
                                        cursor: 'pointer',
                                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                        backgroundColor: isSelected ? 'rgba(0,102,255,0.03)' : undefined,
                                        transition: 'all var(--duration-fast) var(--ease-antigravity)',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>{svc.name}</h3>
                                            <p style={{ fontSize: 'var(--font-size-xs)', opacity: 0.5, marginTop: 'var(--space-1)' }}>{svc.description}</p>
                                            <span style={{ fontSize: 'var(--font-size-xs)', opacity: 0.4, marginTop: 'var(--space-2)', display: 'inline-block' }}>{svc.duration}</span>
                                        </div>
                                        <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
                                            {formatCurrency(svc.price)}
                                        </span>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Step 2: Scheduling */}
            {step === 2 && (
                <div>
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--space-6)' }}>escolha data e horário</h2>

                    {/* Date picker */}
                    <div style={{ marginBottom: 'var(--space-6)' }}>
                        <h4 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.08em', marginBottom: 'var(--space-4)' }}>data</h4>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            {generateDates().map(d => {
                                const isSelected = selectedDate === d.value;
                                return (
                                    <button key={d.value} onClick={() => setSelectedDate(d.value)} style={{
                                        padding: 'var(--space-3) var(--space-4)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                        backgroundColor: isSelected ? 'rgba(0,102,255,0.06)' : 'var(--surface)',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        minWidth: '64px',
                                        transition: 'all var(--duration-fast)',
                                    }}>
                                        <span style={{ fontSize: '0.6rem', opacity: 0.4, display: 'block', textTransform: 'uppercase' }}>{d.weekday}</span>
                                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: isSelected ? 'var(--primary)' : 'var(--foreground)' }}>{d.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time slots */}
                    {selectedDate && (
                        <div>
                            <h4 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.08em', marginBottom: 'var(--space-4)' }}>horário</h4>
                            {isLoadingSlots ? (
                                <div style={{ opacity: 0.5 }}>Carregando horários...</div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
                                    {slots.length > 0 ? slots.map(slot => {
                                        const isSelected = selectedTime === slot.time;
                                        const available = slot.available;
                                        return (
                                            <button key={slot.time} onClick={() => available && setSelectedTime(slot.time)} disabled={!available} style={{
                                                padding: 'var(--space-3)',
                                                borderRadius: 'var(--radius-lg)',
                                                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                                backgroundColor: isSelected ? 'rgba(0,102,255,0.06)' : !available ? 'var(--border)' : 'var(--surface)',
                                                cursor: available ? 'pointer' : 'not-allowed',
                                                opacity: available ? 1 : 0.3,
                                                fontWeight: 600,
                                                fontSize: 'var(--font-size-sm)',
                                                color: isSelected ? 'var(--primary)' : 'var(--foreground)',
                                                transition: 'all var(--duration-fast)',
                                            }}>
                                                {slot.time}
                                            </button>
                                        );
                                    }) : (
                                        <div style={{ opacity: 0.5 }}>Nenhum horário disponível.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Personal Info */}
            {step === 3 && (
                <div>
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--space-6)' }}>suas informações</h2>
                    <Card padding="lg">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <Input label="nome completo" value={contactForm.name} onChange={val => setContactForm({ ...contactForm, name: val })} />
                            <Input label="telefone" type="tel" value={contactForm.phone} onChange={val => setContactForm({ ...contactForm, phone: val })} />
                            <Input label="e-mail" type="email" value={contactForm.email} onChange={val => setContactForm({ ...contactForm, email: val })} />
                        </div>
                    </Card>
                </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && service && (
                <div>
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--space-6)' }}>pagamento</h2>

                    {/* Order Summary */}
                    <Card padding="lg" style={{ marginBottom: 'var(--space-5)' }}>
                        <h4 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.08em', marginBottom: 'var(--space-4)' }}>resumo</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>
                            <span>{service.name}</span>
                            <span style={{ fontWeight: 600 }}>{formatCurrency(service.price)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', opacity: 0.5, marginBottom: 'var(--space-3)' }}>
                            <span>{selectedDate && new Date(selectedDate + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} às {selectedTime}</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 600 }}>total</span>
                            <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>{formatCurrency(service.price)}</span>
                        </div>
                    </Card>

                    {/* Payment Method */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                        {(['pix', 'credit_card'] as const).map(method => {
                            const isActive = paymentMethod === method;
                            return (
                                <button key={method} onClick={() => setPaymentMethod(method)} style={{
                                    padding: 'var(--space-4)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: isActive ? '2px solid var(--primary)' : '1px solid var(--border)',
                                    backgroundColor: isActive ? 'rgba(0,102,255,0.04)' : 'var(--surface)',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all var(--duration-fast)',
                                }}>
                                    <span style={{ fontSize: 'var(--font-size-xl)', display: 'block', marginBottom: 'var(--space-2)' }}>
                                        {method === 'pix' ? '◼' : '💳'}
                                    </span>
                                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                                        {method === 'pix' ? 'pix' : 'cartão de crédito'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {paymentMethod === 'pix' && (
                        <Card padding="lg" style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '160px', height: '160px',
                                backgroundColor: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                margin: '0 auto var(--space-4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 'var(--font-size-xs)', opacity: 0.3,
                            }}>
                                QR Code
                            </div>
                            <p style={{ fontSize: 'var(--font-size-xs)', opacity: 0.5 }}>escaneie o código com o app do seu banco</p>
                        </Card>
                    )}

                    {paymentMethod === 'credit_card' && (
                        <Card padding="lg">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <Input label="número do cartão" placeholder="0000 0000 0000 0000" />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <Input label="validade" placeholder="MM/AA" />
                                    <Input label="cvv" placeholder="123" />
                                </div>
                                <Input label="nome no cartão" placeholder="como impresso no cartão" />
                            </div>
                        </Card>
                    )}
                </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                {step > 1 && (
                    <Button color="secondary" size="lg" onClick={() => setStep(step - 1)} isDisabled={isSubmitting}>voltar</Button>
                )}
                <div style={{ flex: 1 }}>
                    {step < 4 ? (
                        <Button color="primary" size="lg" className="w-full" onClick={() => canProceed() && setStep(step + 1)} isDisabled={!canProceed()}>
                            continuar
                        </Button>
                    ) : (
                        <Button
                            color="primary"
                            size="lg"
                            className="w-full"
                            onClick={handleBooking}
                            isDisabled={isSubmitting}
                        >
                            {isSubmitting ? 'processando...' : `confirmar pagamento — ${service && formatCurrency(service.price)}`}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
