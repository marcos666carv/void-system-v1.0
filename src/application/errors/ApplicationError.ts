import { DomainError } from '../../domain/errors/DomainError';

export interface AppErrorJSON {
    code: string;
    message: string;
    correlation_id?: string;
    details?: Record<string, unknown>;
}

export function toAppError(error: unknown, correlationId?: string): AppErrorJSON {
    if (error instanceof DomainError) {
        return error.toJSON(correlationId);
    }

    console.error('[UNEXPECTED_ERROR]', error);

    return {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        ...(correlationId && { correlation_id: correlationId }),
    };
}

export function httpStatusFromError(error: unknown): number {
    if (error instanceof DomainError) {
        return error.httpStatus;
    }
    return 500;
}
