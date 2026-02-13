'use client';

import { Button, Card } from '@/components/ui';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    promoPrice?: number;
    promoLabel?: string;
    category: string;
    formattedPrice?: string;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('/api/products?active=true&limit=100');
                const data = await res.json();
                setServices(data.data || []);
            } catch (error) {
                console.error('Failed to fetch services:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    };

    if (loading) {
        return (
            <div style={{ display: 'grid', placeItems: 'center', minHeight: '50vh', opacity: 0.5 }}>
                <p>carregando serviços...</p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--space-7)',
            padding: 'var(--space-7) var(--space-5)',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 600,
                textAlign: 'center',
                fontFamily: 'var(--font-display)'
            }}>
                nossos serviços
            </h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--space-5)'
            }}>
                {services.map((service) => (
                    <div key={service.id}>
                        <Card style={{ height: '100%', display: 'grid', gridTemplateRows: '1fr auto', gap: 'var(--space-5)', padding: 'var(--space-6)' }}>
                            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.05em',
                                        opacity: 0.6
                                    }}>
                                        {service.category}
                                    </span>
                                    {service.promoLabel && (
                                        <span style={{
                                            fontSize: '0.65rem',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '100px',
                                            backgroundColor: 'var(--void-neon-green)',
                                            color: 'black',
                                            fontWeight: 700
                                        }}>
                                            {service.promoLabel}
                                        </span>
                                    )}
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{service.name}</h2>
                                <p style={{ opacity: 0.8 }}>{service.description}</p>
                                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }}>
                                    {service.promoPrice ? (
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '1rem', textDecoration: 'line-through', opacity: 0.5 }}>
                                                {formatPrice(service.price)}
                                            </span>
                                            <span style={{ color: 'var(--void-neon-green)' }}>
                                                {formatPrice(service.promoPrice)}
                                            </span>
                                        </div>
                                    ) : (
                                        formatPrice(service.price)
                                    )}
                                </div>
                            </div>
                            <Link href="/book" className="w-full">
                                <Button className="w-full" intent="secondary">agendar</Button>
                            </Link>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
