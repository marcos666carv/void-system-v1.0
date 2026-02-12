import { NextResponse } from 'next/server';
import { z } from 'zod';
import { listProducts, createProduct } from '@/infrastructure/container';
import { paginationSchema } from '@/application/contracts';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';

const createProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().positive(),
    originalPrice: z.number().positive().optional(),
    promoPrice: z.number().positive().optional(),
    promoStartDate: z.string().datetime().optional(),
    promoEndDate: z.string().datetime().optional(),
    promoLabel: z.string().optional(),
    promoType: z.enum(['manual', 'scheduled', 'club_exclusive']).optional(),
    category: z.enum(['therapy', 'merchandise', 'gift_card', 'floatation', 'massage', 'combo', 'void_club']),
    durationMinutes: z.number().int().positive().optional(),
    locationId: z.string().optional(),
    creditType: z.enum(['float', 'massage']).optional(),
    creditAmount: z.number().int().positive().optional(),
    variations: z.array(z.object({
        id: z.string().optional(), // optional on creation
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().positive(),
        promoPrice: z.number().positive().optional(),
        sessions: z.number().int().positive().optional()
    })).optional(),
    active: z.boolean().default(true),
});

export const GET = withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const { page, limit } = paginationSchema.parse(Object.fromEntries(searchParams));
    const result = await listProducts.execute({ page, limit });
    return NextResponse.json(result);
});

export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const input = createProductSchema.parse(body);

    const product = await createProduct.execute({
        ...input,
        promoStartDate: input.promoStartDate ? new Date(input.promoStartDate) : undefined,
        promoEndDate: input.promoEndDate ? new Date(input.promoEndDate) : undefined,
        variations: input.variations?.map(v => ({
            ...v,
            id: v.id || crypto.randomUUID()
        }))
    });
    return NextResponse.json(product, { status: 201 });
});
