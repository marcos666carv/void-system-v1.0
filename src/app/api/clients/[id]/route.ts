import { NextResponse } from 'next/server';
import { getClientByIdSchema } from '@/application/contracts';
import { getClientById } from '@/infrastructure/container';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';

export const GET = withErrorHandler(async (
    request: Request,
    context: unknown,
) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const input = getClientByIdSchema.parse({ id });
    const result = await getClientById.execute(input.id);
    return NextResponse.json(result);
});
