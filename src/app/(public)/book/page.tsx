'use client';

import React, { useState } from 'react';
import { Gravity, Button, Card, Modal, ModalOverlay, Dialog, Input } from '@/components/ui';

// Mock slots
const MOCK_SLOTS = [
    { id: '1', time: '09:00', duration: '60 min', price: 'R$ 150' },
    { id: '2', time: '10:30', duration: '60 min', price: 'R$ 150' },
    { id: '3', time: '14:00', duration: '90 min', price: 'R$ 200' },
    { id: '4', time: '16:30', duration: '60 min', price: 'R$ 150' },
];

export default function BookPage() {
    const [selectedSlot, setSelectedSlot] = useState<typeof MOCK_SLOTS[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleBook = (slot: typeof MOCK_SLOTS[0]) => {
        setSelectedSlot(slot);
        setIsModalOpen(true);
    };

    const confirmBooking = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setIsModalOpen(false);
        alert('Agendamento confirmado com sucesso!');
    };

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{
                fontSize: '3rem',
                fontWeight: 800,
                marginBottom: '2rem',
                textAlign: 'center'
            }}>
                Agende sua Flutuação
            </h1>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {MOCK_SLOTS.map((slot) => (
                    <Gravity key={slot.id} strength={0.1} radius={200}>
                        <Card className="flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{slot.time}</div>
                                <div style={{ opacity: 0.7 }}>{slot.duration} • {slot.price}</div>
                            </div>
                            <Button onClick={() => handleBook(slot)}>Reservar</Button>
                        </Card>
                    </Gravity>
                ))}
            </div>

            <ModalOverlay isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal>
                    <Dialog className="outline-none">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Confirmar Agendamento</h2>
                            <p>
                                Você está agendando uma flutuação para <strong>{selectedSlot?.time}</strong>.
                            </p>
                            <Input label="Nome Completo" placeholder="Seu nome" />
                            <Input label="Email" placeholder="seu@email.com" type="email" />
                            <Button className="w-full" onClick={confirmBooking} isDisabled={isLoading}>
                                {isLoading ? 'Confirmando...' : 'Confirmar e Pagar'}
                            </Button>
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </div>
    );
}
