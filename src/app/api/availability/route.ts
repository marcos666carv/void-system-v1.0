
import { NextRequest, NextResponse } from 'next/server';
import { DrizzleAvailabilityRepository } from '@/infrastructure/database/repositories/DrizzleAvailabilityRepository';

const availabilityRepo = new DrizzleAvailabilityRepository();

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!dateStr || !serviceId) {
        return NextResponse.json({ error: 'Missing date or serviceId' }, { status: 400 });
    }

    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
        }

        const slots = await availabilityRepo.checkAvailability(date, serviceId);
        return NextResponse.json(slots);
    } catch (error) {
        console.error('Failed to check availability:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
