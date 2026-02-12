import { ProductProps } from '@/domain/entities/Product';

const now = new Date();

export const seedProducts: ProductProps[] = [
    // 1. FLUTUAÇÃO (Floatation)
    {
        id: 'prod_floatation',
        name: 'Flutuação',
        description: 'Isolamento sensorial profundo.',
        price: 150, // Base/Starting price for sorting
        category: 'floatation',
        durationMinutes: 60,
        active: true,
        createdAt: now,
        updatedAt: now,
        variations: [
            { id: 'v_float_1', name: 'Sessão Única', price: 150, sessions: 1 },
            { id: 'v_float_3', name: '3 Sessões', price: 420, sessions: 3 },
            { id: 'v_float_5', name: '5 Sessões', price: 650, sessions: 5 },
            { id: 'v_float_10', name: '10 Sessões', price: 1200, sessions: 10 }
        ]
    },
    // 2. MASSAGEM (Massage)
    {
        id: 'prod_massage',
        name: 'Massagem',
        description: 'Equilíbrio muscular e mental.',
        price: 180,
        category: 'massage',
        durationMinutes: 60,
        active: true,
        createdAt: now,
        updatedAt: now,
        variations: [
            { id: 'v_mass_1', name: 'Sessão Única', price: 180, sessions: 1 },
            { id: 'v_mass_3', name: '3 Sessões', price: 510, sessions: 3 },
            { id: 'v_mass_5', name: '5 Sessões', price: 800, sessions: 5 },
            { id: 'v_mass_10', name: '10 Sessões', price: 1500, sessions: 10 }
        ]
    },
    // 3. COMBOS
    {
        id: 'prod_combo',
        name: 'Combos',
        description: 'O reset total: flutuação + massagem.',
        price: 290,
        category: 'combo',
        active: true,
        createdAt: now,
        updatedAt: now,
        variations: [
            { id: 'v_combo_01', name: 'Combo 01', description: '1 Flutuação + 1 Massagem', price: 290, sessions: 1 },
            { id: 'v_combo_03', name: 'Combo 03', description: '3 Flutuações + 3 Massagens', price: 820, sessions: 3 }
        ]
    },
    // 4. VALE PRESENTE (Gift Card)
    {
        id: 'prod_gift',
        name: 'Vale Presente',
        description: 'Presenteie com uma experiência única.',
        price: 150,
        category: 'gift_card',
        active: true,
        createdAt: now,
        updatedAt: now,
        variations: [
            { id: 'v_gift_float', name: 'Vale Flutuação', price: 150 },
            { id: 'v_gift_mass', name: 'Vale Massagem', price: 180 },
            { id: 'v_gift_combo', name: 'Vale Combo', price: 290 }
        ]
    },
    // 5. VOID CLUB
    {
        id: 'prod_void_club',
        name: 'Void Club',
        description: 'Assinatura mensal para bio-hackers.',
        price: 0, // Membership usually has structured pricing or just "Join Waitlist"
        category: 'void_club',
        active: true,
        createdAt: now,
        updatedAt: now,
        promoLabel: 'Exclusive Access'
    }
];
