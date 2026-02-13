
'use client';

import React, { useState, useEffect } from 'react';
import { Gravity, Button, Card, Modal, ModalOverlay, Dialog, Input } from '@/components/ui';

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
                const res = await fetch('/api/services');
                if (res.ok) {
                    const data = await res.json();
                    setServices(data);
                    if (data.length > 0) setSelectedService(data[0]);
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

    const confirmBooking = async () => {
        setIsLoading(true);
        // Simulate API call for booking creation (TODO: implement POST /api/appointments)
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setIsModalOpen(false);
        alert('Agendamento confirmado com sucesso!');
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
                    onChange={(value) => setSelectedDate(String(value))}
                    label="Selecione a Data"
                />
            </div>

            {/* Slots Grid */}
            <div className="grid gap-4">
                {isFetchingSlots ? (
                    <div className="text-center py-8 opacity-50">Carregando horários...</div>
                ) : slots.length > 0 ? (
                    slots.filter(s => s.available).map((slot) => (
                        <Gravity key={slot.time} strength={0.1} radius={200}>
                            <Card className="flex items-center justify-between p-4">
                                <div>
                                    <div className="text-xl font-semibold">{slot.time}</div>
                                    <div className="opacity-70 text-sm">
                                        {selectedService?.duration} min • {selectedService && formatPrice(selectedService.price)}
                                    </div>
                                </div>
                                <Button onClick={() => handleBook(slot)}>Reservar</Button>
                            </Card>
                        </Gravity>
                    ))
                ) : (
                    <div className="text-center py-8 opacity-50">Nenhum horário disponível para esta data.</div>
                )}
            </div>

            <ModalOverlay isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal>
                    <Dialog className="outline-none max-w-md w-full p-6 bg-white dark:bg-void-obsidian rounded-xl shadow-2xl">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold">Confirmar Agendamento</h2>
                            <p className="opacity-80">
                                Você está agendando <strong>{selectedService?.name}</strong> para <strong>{selectedDate} às {selectedSlot?.time}</strong>.
                            </p>
                            <Input label="Nome Completo" placeholder="Seu nome" />
                            <Input label="Email" placeholder="seu@email.com" type="email" />
                            <Button className="w-full bg-void-obsidian text-white hover:bg-gray-800" onClick={confirmBooking} isDisabled={isLoading}>
                                {isLoading ? 'Confirmando...' : 'Confirmar e Pagar'}
                            </Button>
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </div>
    );
}
