import { NextResponse } from 'next/server';
import { z } from 'zod';
import { listLocations, createLocation } from '@/infrastructure/container';
import { paginationSchema } from '@/application/contracts';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';

const createLocationSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    active: z.boolean().default(true),
});

export const GET = withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const { page, limit } = paginationSchema.parse(Object.fromEntries(searchParams));
    return NextResponse.json(await listLocations.execute({ page, limit }));
});

export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const input = createLocationSchema.parse(body);
    return NextResponse.json(await createLocation.execute(input), { status: 201 });
});
