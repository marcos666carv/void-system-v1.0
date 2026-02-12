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
    const client = await createClient.execute(input);
    return created(client);
}));
