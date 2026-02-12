'use client';

import React from 'react';
import { PurchaseForm } from '@/components/features/sales/PurchaseForm';

export default function NewSalePage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <PurchaseForm />
        </div>
    );
}
