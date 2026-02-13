
import { NextResponse } from 'next/server';
import { DrizzleServiceRepository } from '@/infrastructure/database/repositories/DrizzleServiceRepository';

// Initialize repository (in a real app, use DI container)
const serviceRepo = new DrizzleServiceRepository();

export async function GET() {
    try {
        const services = await serviceRepo.findAll(true); // Active only
        return NextResponse.json(services);
    } catch (error) {
        console.error('Failed to fetch services:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
