import { SaleProps } from '@/domain/entities/Sale';

const now = new Date();
const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(now); twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(now); threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

export const seedSales: SaleProps[] = [
    {
        id: 'sale_01',
        clientId: 'usr_cli_01',
        items: [{ productId: 'prod_voyager', quantity: 1, unitPrice: 349 }],
        totalAmount: 349,
        paymentMethod: 'credit_card',
        status: 'completed',
        createdAt: threeDaysAgo,
    },
    {
        id: 'sale_02',
        clientId: 'usr_cli_02',
        items: [{ productId: 'prod_float_60', quantity: 1, unitPrice: 150 }],
        totalAmount: 150,
        paymentMethod: 'pix',
        status: 'completed',
        createdAt: twoDaysAgo,
    },
    {
        id: 'sale_03',
        clientId: 'usr_cli_03',
        items: [{ productId: 'prod_gift', quantity: 2, unitPrice: 150 }],
        totalAmount: 300,
        paymentMethod: 'credit_card',
        status: 'completed',
        createdAt: yesterday,
    },
    {
        id: 'sale_04',
        clientId: 'usr_cli_04',
        items: [{ productId: 'prod_explorer', quantity: 1, unitPrice: 199 }],
        totalAmount: 199,
        paymentMethod: 'debit_card',
        status: 'completed',
        createdAt: now,
    },
];
