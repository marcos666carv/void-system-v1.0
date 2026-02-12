import { NextResponse } from 'next/server';
import { z } from 'zod';
import { listTanks, createTank } from '@/infrastructure/container';
import { paginationSchema } from '@/application/contracts';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';

const createTankSchema = z.object({
    name: z.string().min(1),
    locationId: z.string().min(1),
    status: z.enum(['ready', 'in_use', 'maintenance', 'offline']).default('ready'),
    temperature: z.number().optional(),
    active: z.boolean().default(true),
});

export const GET = withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const { page, limit } = paginationSchema.parse(Object.fromEntries(searchParams));
    const locationId = searchParams.get('locationId') || undefined;
    return NextResponse.json(await listTanks.execute({ locationId }, { page, limit }));
});

export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const input = createTankSchema.parse(body);
    return NextResponse.json(await createTank.execute({
        ...input,
        ledsOn: true,
        musicOn: false,
        heaterOn: true,
        pumpOn: true,
        maintenanceMode: false,
    }), { status: 201 });
});
