import { NextResponse } from 'next/server';
import { UnauthorizedError, ForbiddenError } from '@/domain/errors/DomainError';

type UserRole = 'client' | 'admin' | 'staff';

interface SessionUser {
    id: string;
    email: string;
    role: UserRole;
}

/**
 * Extracts user session from request.
 * In Phase 2 this uses header-based mock auth.
 * Phase 3 will swap to NextAuth.js v5 JWT verification.
 */
export function getSessionUser(request: Request): SessionUser | null {
    const authHeader = request.headers.get('x-user-id');
    if (!authHeader) return null;

    return {
        id: authHeader,
        email: request.headers.get('x-user-email') ?? '',
        role: (request.headers.get('x-user-role') as UserRole) ?? 'client',
    };
}

export function requireAuth(request: Request): SessionUser {
    const user = getSessionUser(request);
    if (!user) {
        throw new UnauthorizedError();
    }
    return user;
}

export function requireRole(request: Request, ...roles: UserRole[]): SessionUser {
    const user = requireAuth(request);
    if (!roles.includes(user.role)) {
        throw new ForbiddenError('Insufficient permissions for this action');
    }
    return user;
}
