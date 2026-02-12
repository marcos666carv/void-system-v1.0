import { describe, it, expect } from 'vitest';
import {
    EntityNotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
} from '@/domain/errors/DomainError';

describe('DomainError hierarchy', () => {
    it('EntityNotFoundError has 404 status', () => {
        const err = new EntityNotFoundError('Client', 'abc');
        expect(err.httpStatus).toBe(404);
        expect(err.code).toBe('ENTITY_NOT_FOUND');
        expect(err.message).toContain('Client');
        expect(err.message).toContain('abc');
    });

    it('ValidationError has 400 status and details', () => {
        const err = new ValidationError('Bad input', { email: ['invalid format'] });
        expect(err.httpStatus).toBe(400);
        expect(err.details.email).toContain('invalid format');
    });

    it('ValidationError toJSON includes details', () => {
        const err = new ValidationError('Bad', { field: ['err'] });
        const json = err.toJSON('corr-123');
        expect(json.details).toEqual({ field: ['err'] });
        expect(json.correlation_id).toBe('corr-123');
    });

    it('UnauthorizedError has 401 status', () => {
        const err = new UnauthorizedError();
        expect(err.httpStatus).toBe(401);
        expect(err.code).toBe('UNAUTHORIZED');
    });

    it('ForbiddenError has 403 status', () => {
        const err = new ForbiddenError('no access');
        expect(err.httpStatus).toBe(403);
        expect(err.code).toBe('FORBIDDEN');
    });

    it('ConflictError has 409 status', () => {
        const err = new ConflictError('duplicate');
        expect(err.httpStatus).toBe(409);
        expect(err.code).toBe('CONFLICT');
    });

    it('toJSON respects correlation_id', () => {
        const err = new EntityNotFoundError('Client', '123');
        const json = err.toJSON('req-abc');
        expect(json.correlation_id).toBe('req-abc');
    });

    it('toJSON omits correlation_id when not provided', () => {
        const err = new EntityNotFoundError('Client', '123');
        const json = err.toJSON();
        expect(json).not.toHaveProperty('correlation_id');
    });
});
