export abstract class DomainError extends Error {
    abstract readonly code: string;
    abstract readonly httpStatus: number;

    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }

    toJSON(correlationId?: string) {
        return {
            code: this.code,
            message: this.message,
            ...(correlationId && { correlation_id: correlationId }),
        };
    }
}

export class EntityNotFoundError extends DomainError {
    readonly code = 'ENTITY_NOT_FOUND';
    readonly httpStatus = 404;

    constructor(entity: string, id: string) {
        super(`${entity} with id "${id}" not found`);
    }
}

export class ValidationError extends DomainError {
    readonly code = 'VALIDATION_ERROR';
    readonly httpStatus = 400;
    readonly details: Record<string, string[]>;

    constructor(message: string, details: Record<string, string[]> = {}) {
        super(message);
        this.details = details;
    }

    toJSON(correlationId?: string) {
        return {
            ...super.toJSON(correlationId),
            details: this.details,
        };
    }
}

export class UnauthorizedError extends DomainError {
    readonly code = 'UNAUTHORIZED';
    readonly httpStatus = 401;

    constructor(message = 'Authentication required') {
        super(message);
    }
}

export class ForbiddenError extends DomainError {
    readonly code = 'FORBIDDEN';
    readonly httpStatus = 403;

    constructor(message = 'Insufficient permissions') {
        super(message);
    }
}

export class ConflictError extends DomainError {
    readonly code = 'CONFLICT';
    readonly httpStatus = 409;

    constructor(message: string) {
        super(message);
    }
}
