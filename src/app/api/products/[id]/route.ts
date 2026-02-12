import { NextResponse } from 'next/server';
import { z } from 'zod';
import { updateProduct, deleteProduct } from '@/infrastructure/container';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';

const updateProductSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    originalPrice: z.number().positive().optional(),
    promoPrice: z.number().positive().optional(),
    promoStartDate: z.string().datetime().optional(),
    promoEndDate: z.string().datetime().optional(),
    promoLabel: z.string().optional(),
    promoType: z.enum(['manual', 'scheduled', 'club_exclusive']).optional(),
    category: z.enum(['therapy', 'merchandise', 'gift_card', 'floatation', 'massage', 'combo', 'void_club']).optional(),
    durationMinutes: z.number().int().positive().optional(),
    locationId: z.string().optional(),
    variations: z.array(z.object({
        id: z.string().optional(),
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().positive(),
        promoPrice: z.number().positive().optional(),
        sessions: z.number().int().positive().optional()
    })).optional(),
    active: z.boolean().optional(),
});

export const PUT = withErrorHandler(async (request: Request, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const body = await request.json();
    const input = updateProductSchema.parse(body);

    // Process variations to ensure they have IDs
    const variations = input.variations?.map(v => ({
        ...v,
        id: v.id || crypto.randomUUID()
    }));

    const result = await updateProduct.execute(id, {
        ...input,
        promoStartDate: input.promoStartDate ? new Date(input.promoStartDate) : undefined,
        promoEndDate: input.promoEndDate ? new Date(input.promoEndDate) : undefined,
        variations: variations
    });
    if (!result) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(result);
});

export const DELETE = withErrorHandler(async (_request: Request, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const result = await deleteProduct.execute(id);
    if (!result) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true });
});
