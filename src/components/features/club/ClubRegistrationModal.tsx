'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';

interface ClubRegistrationModalProps {
    tier: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const ClubRegistrationModal: React.FC<ClubRegistrationModalProps> = ({ tier, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onSuccess();
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', minWidth: '300px' }}>
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                <p style={{ opacity: 0.7 }}>You are signing up for:</p>
                <h3 style={{ fontSize: '1.5rem', color: '#CCB0F0' }}>{tier}</h3>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Full Name</label>
                <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email Address</label>
                <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Phone Number</label>
                <Input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(XX) XXXXX-XXXX"
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="button" onClick={onCancel} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>Cancel</Button>
                <Button type="submit" disabled={loading} style={{ flex: 1 }}>
                    {loading ? 'Processing...' : 'Confirm Subscription'}
                </Button>
            </div>
        </form>
    );
};
