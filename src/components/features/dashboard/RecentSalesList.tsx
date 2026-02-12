'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui';

interface Sale {
    id: string;
    clientName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: { productName: string; quantity: number }[];
}

export function RecentSalesList() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/sales?page=1&limit=10')
            .then(res => res.json())
            .then(data => {
                setSales(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Carregando vendas...</div>;

    return (
        <Card  padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Últimas Vendas</h3>
                <a href="/sales/new" style={{ fontSize: '0.875rem', color: 'var(--void-neon-green)', textDecoration: 'none', fontWeight: 600 }}>+ Nova Venda</a>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem', opacity: 0.7 }}>Data</th>
                            <th style={{ padding: '0.75rem', opacity: 0.7 }}>Cliente</th>
                            <th style={{ padding: '0.75rem', opacity: 0.7 }}>Itens</th>
                            <th style={{ padding: '0.75rem', opacity: 0.7, textAlign: 'right' }}>Total</th>
                            <th style={{ padding: '0.75rem', opacity: 0.7 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map(sale => (
                            <tr key={sale.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '0.75rem' }}>{new Date(sale.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '0.75rem', fontWeight: 500 }}>{sale.clientName}</td>
                                <td style={{ padding: '0.75rem', opacity: 0.8 }}>
                                    {sale.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                                </td>
                                <td style={{ padding: '0.75rem', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.totalAmount)}
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        backgroundColor: sale.status === 'completed' ? 'var(--void-neon-green)' : 'var(--void-obsidian)',
                                        color: sale.status === 'completed' ? '#000' : '#fff'
                                    }}>
                                        {sale.status === 'completed' ? 'Concluído' : sale.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {sales.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>Nenhuma venda registrada.</div>}
            </div>
        </Card>
    );
}
