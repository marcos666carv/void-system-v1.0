
'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Input } from '@/components/ui';

interface Service {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
}

interface TimeSlot {
    time: string;
    available: boolean;
}

export default function BookPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState<TimeSlot[]>([]);

    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingSlots, setIsFetchingSlots] = useState(false);

    // Fetch services on mount
    useEffect(() => {
        async function fetchServices() {
            try {
                const res = await fetch('/api/products?active=true&limit=100');
                if (res.ok) {
                    const json = await res.json();
                    const products = json.data || [];
                    // Map Product to Service interface
                    const mappedServices = products.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        description: p.description || '',
                        duration: p.durationMinutes || 60,
                        price: p.price
                    }));
                    setServices(mappedServices);
                    if (mappedServices.length > 0) setSelectedService(mappedServices[0]);
                }
            } catch (error) {
                console.error('Failed to fetch services', error);
            }
        }
        fetchServices();
    }, []);

    // Fetch availability when service or date changes
    useEffect(() => {
        if (!selectedService || !selectedDate) return;

        async function fetchAvailability() {
            setIsFetchingSlots(true);
            try {
                const res = await fetch(`/api/availability?date=${selectedDate}&serviceId=${selectedService?.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setSlots(data);
                }
            } catch (error) {
                console.error('Failed to fetch availability', error);
            } finally {
                setIsFetchingSlots(false);
            }
        }
        fetchAvailability();
    }, [selectedService, selectedDate]);

    const handleBook = (slot: TimeSlot) => {
        setSelectedSlot(slot);
        setIsModalOpen(true);
    };

    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');

    const confirmBooking = async () => {
        if (!clientName || !clientEmail || !selectedService || !selectedDate || !selectedSlot) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Create or Get Client
            const clientRes = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: clientName,
                    email: clientEmail
                })
            });

            if (!clientRes.ok) throw new Error('Falha ao registrar cliente');
            const clientData = await clientRes.json();
            const client = clientData.data || clientData; // Handle wrapped or direct response

            // 2. Create Appointment
            const startTime = new Date(`${selectedDate}T${selectedSlot.time}`);
            const endTime = new Date(startTime.getTime() + selectedService.duration * 60000);

            const appointmentRes = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: client.id,
                    serviceId: selectedService.id,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                })
            });

            if (!appointmentRes.ok) throw new Error('Falha ao criar agendamento');

            alert('Agendamento confirmado com sucesso! Verifique seu email.');
            setIsModalOpen(false);

            // Reset form
            setClientName('');
            setClientEmail('');
            setSelectedSlot(null);

        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro ao processar seu agendamento. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (cents: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
    };

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="text-4xl font-bold mb-8 text-center text-void-obsidian dark:text-void-white">
                Agende sua Flutuação
            </h1>

            {/* Service Selection */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
                {services.map(service => (
                    <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap ${selectedService?.id === service.id
                            ? 'bg-void-obsidian text-white border-void-obsidian'
                            : 'bg-transparent text-void-obsidian border-gray-300 hover:border-void-obsidian'
                            }`}
                    >
                        {service.name} ({service.duration} min)
                    </button>
                ))}
            </div>

            {/* Date Selection */}
            <div className="mb-8">
                <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    label="Selecione a Data"
                />
            </div>

            {/* Slots Grid */}
            <div className="grid gap-4">
                {isFetchingSlots ? (
                    <div className="text-center py-8 opacity-50">Carregando horários...</div>
                ) : slots.length > 0 ? (
                    slots.filter(s => s.available).map((slot) => (
                        <div key={slot.time}>
                            <Card className="flex items-center justify-between p-4">
                                <div>
                                    <div className="text-xl font-semibold">{slot.time}</div>
                                    <div className="opacity-70 text-sm">
                                        {selectedService?.duration} min • {selectedService && formatPrice(selectedService.price)}
                                    </div>
                                </div>
                                <Button onClick={() => handleBook(slot)}>Reservar</Button>
                            </Card>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 opacity-50">Nenhum horário disponível para esta data.</div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="outline-none max-w-md w-full p-6 bg-white dark:bg-void-obsidian rounded-xl shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold">Confirmar Agendamento</h2>
                            <p className="opacity-80">
                                Você está agendando <strong>{selectedService?.name}</strong> para <strong>{selectedDate} às {selectedSlot?.time}</strong>.
                            </p>
                            <Input
                                label="Nome Completo"
                                placeholder="Seu nome"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                            />
                            <Input
                                label="Email"
                                placeholder="seu@email.com"
                                type="email"
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                            />
                            <Button className="w-full bg-void-obsidian text-white hover:bg-gray-800" onClick={confirmBooking} disabled={isLoading}>
                                {isLoading ? 'Confirmando...' : 'Confirmar e Pagar'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
