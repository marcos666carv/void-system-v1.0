import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rescheduleAppointment } from '@/infrastructure/container';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';

const rescheduleSchema = z.object({
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show']).optional(),
    notes: z.string().optional(),
    tankId: z.string().optional(),
    locationId: z.string().optional(),
});

export const PUT = withErrorHandler(async (request: Request, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const body = await request.json();
    const input = rescheduleSchema.parse(body);
    const result = await rescheduleAppointment.execute(id, {
        ...input,
        startTime: input.startTime ? new Date(input.startTime) : undefined,
        endTime: input.endTime ? new Date(input.endTime) : undefined,
    });
    return NextResponse.json(result);
});
