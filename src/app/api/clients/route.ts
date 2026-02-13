import { NextResponse } from 'next/server';
import { listClientsSchema, createClientSchema } from '@/application/contracts';
import { listClients, createClient } from '@/infrastructure/container';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';
import { withSecurity } from '@/infrastructure/http/SecurityMiddleware';
import { success, created } from '@/infrastructure/http/apiResponse';

export const GET = withSecurity(withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const input = listClientsSchema.parse(Object.fromEntries(searchParams));
    const result = await listClients.execute(input);
    return success(result);
}));

export const POST = withSecurity(withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const input = createClientSchema.parse(body);

    try {
        const client = await createClient.execute(input);
        return created(client);
    } catch (error: any) {
        if (error.constructor.name === 'ConflictError' || error.message.includes('already exists')) {
            // MVP Strategy: For Guest Checkout, if client exists, return it to allow booking.
            // TODO: Replace with proper Auth flow (Login/Magic Link)
            const existing = await listClients.execute({
                search: input.email,
                page: 1,
                limit: 1,
                sort: 'email',
                order: 'asc'
            });
            if (existing.data.length > 0) {
                return success(existing.data[0]);
            }
        }
        throw error;
    }
}));
