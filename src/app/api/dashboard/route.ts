import { NextResponse } from 'next/server';
import { getDashboardMetrics } from '@/infrastructure/container';
import { withErrorHandler } from '@/infrastructure/http/errorHandler';

export const GET = withErrorHandler(async () => {
    const metrics = await getDashboardMetrics.execute();
    return NextResponse.json(metrics);
});
