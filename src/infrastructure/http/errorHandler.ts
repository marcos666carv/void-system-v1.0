import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { DomainError } from '@/domain/errors/DomainError';
import { toAppError, httpStatusFromError } from '@/application/errors/ApplicationError';
import { logger } from '@/infrastructure/observability/logger';

function getCorrelationId(request?: Request): string {
    return request?.headers.get('x-correlation-id') ?? crypto.randomUUID();
}

type RouteHandler = (request: Request, context?: unknown) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
    return async (request: Request, context?: unknown) => {
        const correlationId = getCorrelationId(request);
        const log = logger.withCorrelationId(correlationId);
        const { method, url } = request;

        log.info('request_start', { method, url });

        try {
            const response = await handler(request, context);
            response.headers.set('x-correlation-id', correlationId);

            log.info('request_end', { method, url, status: response.status });
            return response;
        } catch (error) {
            if (error instanceof ZodError) {
                const details: Record<string, string[]> = {};
                for (const e of error.issues) {
                    const path = e.path.join('.');
                    if (!details[path]) details[path] = [];
                    details[path].push(e.message);
                }

                log.warn('validation_error', { method, url, details });

                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: 'VALIDATION_ERROR',
                            message: 'Invalid request data',
                            details,
                            correlation_id: correlationId,
                        }
                    },
                    { status: 400, headers: { 'x-correlation-id': correlationId } },
                );
            }

            const status = httpStatusFromError(error);
            const appError = toAppError(error);

            if (status >= 500) {
                log.error('unhandled_error', { method, url, error: String(error) });
            } else {
                log.warn('domain_error', { method, url, code: appError.code, status });
            }

            return NextResponse.json({
                success: false,
                error: {
                    ...appError,
                    correlation_id: correlationId,
                }
            }, {
                status,
                headers: { 'x-correlation-id': correlationId },
            });
        }
    };
}
