import { NextResponse } from 'next/server';
import { z } from 'zod';
import { paginationSchema } from '@/application/contracts';
import { listSalesWithDetails, createSale } from '@/infrastructure/container';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';

const createSaleSchema = z.object({
    clientId: z.string().uuid(),
    items: z.array(z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
    })).min(1),
    paymentMethod: z.enum(['credit_card', 'debit_card', 'pix', 'cash']),
});

export const GET = withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const { page, limit } = paginationSchema.parse(Object.fromEntries(searchParams));
    const result = await listSalesWithDetails.execute({ page, limit });
    return NextResponse.json(result);
});

export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const input = createSaleSchema.parse(body);
    const sale = await createSale.execute(input);
    return NextResponse.json(sale, { status: 201 });
});
