import { NextResponse } from 'next/server';

interface SuccessOptions {
    correlationId?: string;
}

interface ApiResponse<T> {
    success: true;
    data: T;
    meta?: Record<string, unknown>;
}

export function success<T>(data: T, options: SuccessOptions = {}) {
    const payload: ApiResponse<T> = { success: true, data };
    const response = NextResponse.json(payload);
    if (options.correlationId) {
        response.headers.set('x-correlation-id', options.correlationId);
    }
    return response;
}

export function created<T>(data: T, options: SuccessOptions = {}) {
    const payload: ApiResponse<T> = { success: true, data };
    const response = NextResponse.json(payload, { status: 201 });
    if (options.correlationId) {
        response.headers.set('x-correlation-id', options.correlationId);
    }
    return response;
}

