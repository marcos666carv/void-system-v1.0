import { NextResponse } from 'next/server';
import { z } from 'zod';
import { listBlockedSlots, createBlockedSlot, deleteBlockedSlot } from '@/infrastructure/container';
import { paginationSchema } from '@/application/contracts';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';

const createBlockedSlotSchema = z.object({
    locationId: z.string().min(1),
    tankId: z.string().optional(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    reason: z.string().min(1),
    recurring: z.boolean().default(false),
});

export const GET = withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const { page, limit } = paginationSchema.parse(Object.fromEntries(searchParams));
    const locationId = searchParams.get('locationId') || undefined;
    return NextResponse.json(await listBlockedSlots.execute({ locationId }, { page, limit }));
});

export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const input = createBlockedSlotSchema.parse(body);
    return NextResponse.json(await createBlockedSlot.execute({
        ...input,
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime),
    }), { status: 201 });
});

export const DELETE = withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const result = await deleteBlockedSlot.execute(id);
    if (!result) return NextResponse.json({ error: 'Blocked slot not found' }, { status: 404 });
    return NextResponse.json({ success: true });
});
