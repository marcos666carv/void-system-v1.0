import { NextResponse } from 'next/server';
import { z } from 'zod';
import { updateLocation, deleteLocation } from '@/infrastructure/container';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';

const updateLocationSchema = z.object({
    name: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    active: z.boolean().optional(),
});

export const PUT = withErrorHandler(async (request: Request, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const body = await request.json();
    const input = updateLocationSchema.parse(body);
    const result = await updateLocation.execute(id, input);
    if (!result) return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    return NextResponse.json(result);
});

export const DELETE = withErrorHandler(async (_request: Request, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const result = await deleteLocation.execute(id);
    if (!result) return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    return NextResponse.json({ success: true });
});
