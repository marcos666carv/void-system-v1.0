'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import styles from './PurchaseForm.module.css'; // Will create this

interface Client {
    id: string;
    fullName: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    formattedPrice: string; // If available, or format manually
}

interface CartItem {
    productId: string;
    quantity: number;
}

export function PurchaseForm() {
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [cart, setCart] = useState<CartItem[]>([{ productId: '', quantity: 1 }]);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch clients and products
        Promise.all([
            fetch('/api/clients?limit=100').then(res => res.json()).then(data => data.data),
            fetch('/api/products?limit=100').then(res => res.json()).then(data => data.data)
        ]).then(([clientsData, productsData]) => {
            setClients(clientsData);
            setProducts(productsData);
        });
    }, []);

    const addItem = () => {
        setCart([...cart, { productId: '', quantity: 1 }]);
    };

    const updateItem = (index: number, field: keyof CartItem, value: any) => {
        const newCart = [...cart];
        newCart[index] = { ...newCart[index], [field]: value };
        setCart(newCart);
    };

    const removeItem = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const validItems = cart.filter(item => item.productId && item.quantity > 0);
            if (validItems.length === 0) return;

            const res = await fetch('/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: selectedClientId,
                    items: validItems,
                    paymentMethod,
                }),
            });

            if (res.ok) {
                router.push('/admin'); // Redirect to dashboard
            } else {
                alert('Erro ao registrar venda');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao processar venda');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card padding="lg">
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Nova Venda</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Cliente</label>
                    <select
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--background-elevated)', border: '1px solid var(--border-color)', color: 'var(--foreground)' }}
                        required
                        aria-label="Selecionar Cliente"
                    >
                        <option value="">Selecione um cliente</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.fullName}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Itens</label>
                    {cart.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                <select
                                    value={item.productId}
                                    onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--background-elevated)', border: '1px solid var(--border-color)', color: 'var(--foreground)' }}
                                    required
                                    aria-label={`Selecionar Produto ${index + 1}`}
                                >
                                    <option value="">Selecione um produto</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} - R$ {p.price.toFixed(2)}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ width: '100px' }}>
                                <Input
                                    type="number"
                                    min="1"
                                    value={String(item.quantity)}
                                    onChange={(value) => updateItem(index, 'quantity', parseInt(value))}
                                    isRequired
                                    aria-label={`Quantidade do item ${index + 1}`}
                                />
                            </div>
                            <Button color="tertiary" type="button" onClick={() => removeItem(index)} disabled={cart.length === 1}>
                                X
                            </Button>
                        </div>
                    ))}
                    <Button color="secondary" type="button" onClick={addItem} size="sm">
                        + Adicionar Item
                    </Button>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Método de Pagamento</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--background-elevated)', border: '1px solid var(--border-color)', color: 'var(--foreground)' }}
                        aria-label="Método de Pagamento"
                    >
                        <option value="credit_card">Cartão de Crédito</option>
                        <option value="debit_card">Cartão de Débito</option>
                        <option value="pix">PIX</option>
                        <option value="cash">Dinheiro</option>
                    </select>
                </div>

                <div style={{ padding: '1rem', background: 'var(--background-elevated)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>Total</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotal())}
                    </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <Button color="tertiary" type="button" onClick={() => router.back()}>Cancelar</Button>
                    <Button color="primary" type="submit" disabled={loading}>
                        {loading ? 'Processando...' : 'Finalizar Venda'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
