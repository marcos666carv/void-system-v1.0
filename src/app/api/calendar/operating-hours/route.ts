import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getOperatingHours, upsertOperatingHours } from '@/infrastructure/container';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';

const upsertOperatingHoursSchema = z.object({
    id: z.string().min(1),
    locationId: z.string().min(1),
    dayOfWeek: z.number().int().min(0).max(6),
    openTime: z.string().regex(/^\d{2}:\d{2}$/),
    closeTime: z.string().regex(/^\d{2}:\d{2}$/),
    active: z.boolean().default(true),
});

export const GET = withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');
    if (!locationId) return NextResponse.json({ error: 'Missing locationId' }, { status: 400 });
    return NextResponse.json(await getOperatingHours.execute(locationId));
});

export const PUT = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const input = upsertOperatingHoursSchema.parse(body);
    return NextResponse.json(await upsertOperatingHours.execute(input));
});
