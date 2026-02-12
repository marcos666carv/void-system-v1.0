import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createMaintenanceLog, listMaintenanceLogs } from '@/infrastructure/container';
import { paginationSchema } from '@/application/contracts';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';

const createMaintenanceSchema = z.object({
    type: z.enum(['equipment_change', 'repair', 'inspection', 'cleaning']),
    description: z.string().min(1),
    performedBy: z.string().min(1),
    performedAt: z.string().datetime(),
});

export const GET = withErrorHandler(async (request: Request, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const { searchParams } = new URL(request.url);
    const { page, limit } = paginationSchema.parse(Object.fromEntries(searchParams));
    return NextResponse.json(await listMaintenanceLogs.execute(id, { page, limit }));
});

export const POST = withErrorHandler(async (request: Request, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const body = await request.json();
    const input = createMaintenanceSchema.parse(body);
    return NextResponse.json(await createMaintenanceLog.execute({
        tankId: id,
        ...input,
        performedAt: new Date(input.performedAt),
    }), { status: 201 });
});
