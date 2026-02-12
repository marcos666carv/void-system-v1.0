import { NextResponse } from 'next/server';
import { listAppointmentsSchema, createAppointmentSchema } from '@/application/contracts';
import { listAppointments, createAppointment } from '@/infrastructure/container';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';

export const GET = withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const input = listAppointmentsSchema.parse(Object.fromEntries(searchParams));
    const result = await listAppointments.execute(input);
    return NextResponse.json(result);
});

export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const input = createAppointmentSchema.parse(body);
    const appointment = await createAppointment.execute(input);
    return NextResponse.json(appointment, { status: 201 });
});
