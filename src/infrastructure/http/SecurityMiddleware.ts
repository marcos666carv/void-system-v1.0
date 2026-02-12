import { NextResponse } from 'next/server';
import { logger } from '@/infrastructure/observability/logger';

interface RateLimitConfig {
    windowMs: number;
    max: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + config.windowMs });
        return true;
    }

    if (record.count >= config.max) {
        return false;
    }

    record.count++;
    return true;
}

type RouteHandler = (request: Request, context?: unknown) => Promise<NextResponse>;

export function withSecurity(handler: RouteHandler): RouteHandler {
    return async (request: Request, context?: unknown) => {
        // Basic Rate Limiting
        const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
        if (!rateLimit(ip, { windowMs: 60 * 1000, max: 100 })) {
            logger.warn('rate_limit_exceeded', { ip, url: request.url });
            return NextResponse.json(
                { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } },
                { status: 429 }
            );
        }

        const response = await handler(request, context);

        // Security Headers
        response.headers.set('X-Do-Not-Track', '1');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Note: CSP is better handled in next.config.js or middleware.ts for global effect,
        // but can be added here for specific API routes if needed.

        return response;
    };
}
