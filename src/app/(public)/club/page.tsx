'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { ClubRegistrationModal } from '@/components/features/club/ClubRegistrationModal';

export default function ClubPage() {
    const [selectedTier, setSelectedTier] = useState<string | null>(null);

    const handleSubscribe = (tier: string) => {
        setSelectedTier(tier);
    };

    const handleSuccess = () => {
        setSelectedTier(null);
        alert('Welcome to the Void Club! Check your email for confirmation.');
    };

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 800,
                    marginBottom: '1rem',
                    background: 'linear-gradient(to right, #CCB0F0, #E3E3D9)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Void Club
                </h1>
                <p style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
                    Torne a flutuação parte da sua rotina. Benefícios exclusivos para membros.
                </p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {/* Standard Tier */}
                <div className="h-full">
                    <Card className="h-full flex flex-col justify-between" style={{ height: '100%', borderColor: 'rgba(227,227,217,0.2)' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Explorer</h2>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem', color: '#CCB0F0' }}>
                                R$ 199<span style={{ fontSize: '1rem', opacity: 0.6 }}>/mês</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, opacity: 0.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <li>✓ 1 Flutuação por mês</li>
                                <li>✓ 10% de desconto em extras</li>
                                <li>✓ Acesso prioritário à agenda</li>
                            </ul>
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            <Button className="w-full" intent="secondary" onClick={() => handleSubscribe('Explorer')}>Assinar Explorer</Button>
                        </div>
                    </Card>
                </div>

                {/* Premium Tier */}
                <div className="h-full">
                    <Card className="h-full flex flex-col justify-between" style={{ height: '100%', borderColor: '#CCB0F0', backgroundColor: 'rgba(204,176,240,0.05)' }}>
                        <div>
                            <div style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.5rem',
                                backgroundColor: '#CCB0F0',
                                color: '#08283B',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                marginBottom: '1rem'
                            }}>
                                MAIS POPULAR
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Voyager</h2>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem', color: '#CCB0F0' }}>
                                R$ 349<span style={{ fontSize: '1rem', opacity: 0.6 }}>/mês</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, opacity: 0.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <li>✓ 2 Flutuações por mês</li>
                                <li>✓ 20% de desconto em extras</li>
                                <li>✓ Acesso prioritário à agenda</li>
                                <li>✓ Convite para eventos exclusivos</li>
                            </ul>
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            <Button className="w-full" intent="primary" onClick={() => handleSubscribe('Voyager')}>Assinar Voyager</Button>
                        </div>
                    </Card>
                </div>

                {/* VIP Tier */}
                <div className="h-full">
                    <Card className="h-full flex flex-col justify-between" style={{ height: '100%', borderColor: 'rgba(227,227,217,0.2)' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Transcendent</h2>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem', color: '#CCB0F0' }}>
                                R$ 599<span style={{ fontSize: '1rem', opacity: 0.6 }}>/mês</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, opacity: 0.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <li>✓ 4 Flutuações por mês</li>
                                <li>✓ 25% de desconto em extras</li>
                                <li>✓ Agenda VIP dedicada</li>
                                <li>✓ Gift Card mensal para amigo</li>
                            </ul>
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            <Button className="w-full" intent="secondary" onClick={() => handleSubscribe('Transcendent')}>Assinar Transcendent</Button>
                        </div>
                    </Card>
                </div>
            </div>

            {selectedTier && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="outline-none max-w-md w-full p-6 bg-white dark:bg-void-obsidian rounded-xl shadow-2xl relative">
                        <button
                            onClick={() => setSelectedTier(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Join Void Club</h2>
                        <ClubRegistrationModal
                            tier={selectedTier}
                            onSuccess={handleSuccess}
                            onCancel={() => setSelectedTier(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
