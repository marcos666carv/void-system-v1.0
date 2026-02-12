import { NextResponse } from 'next/server';
import { z } from 'zod';
import { updateTank, getTankById } from '@/infrastructure/container';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';

const updateTankSchema = z.object({
    name: z.string().min(1).optional(),
    status: z.enum(['ready', 'in_use', 'maintenance', 'offline']).optional(),
    temperature: z.number().optional(),
    active: z.boolean().optional(),
});

export const GET = withErrorHandler(async (request: Request, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const tank = await getTankById.execute(id);
    if (!tank) return NextResponse.json({ error: 'Tank not found' }, { status: 404 });
    return NextResponse.json(tank);
});

export const PUT = withErrorHandler(async (request: Request, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const body = await request.json();
    const input = updateTankSchema.parse(body);
    const result = await updateTank.execute(id, input);
    if (!result) return NextResponse.json({ error: 'Tank not found' }, { status: 404 });
    return NextResponse.json(result);
});
