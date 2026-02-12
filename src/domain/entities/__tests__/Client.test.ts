import { describe, it, expect } from 'vitest';
import { Client } from '@/domain/entities/Client';

describe('Client', () => {
    const validProps = {
        id: 'cli_01',
        fullName: 'Ana Silva',
        email: 'ana@void.com',
        phone: '11999991234',
        role: 'client' as const,
        membershipTier: 'void_club' as const,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        xp: 0,
        level: 'iniciado' as const,
        totalSpent: 0,
        totalSessions: 0,
        preferences: {},
    };

    it('creates from valid props', () => {
        const client = Client.create(validProps);
        expect(client.id).toBe('cli_01');
        expect(client.fullName).toBe('Ana Silva');
        expect(client.email).toBe('ana@void.com');
    });

    it('isVoidClub returns true for void_club tier', () => {
        const client = Client.create(validProps);
        expect(client.isVoidClub).toBe(true);
    });

    it('isVoidClub returns true for vip tier', () => {
        const client = Client.create({ ...validProps, membershipTier: 'vip' });
        expect(client.isVoidClub).toBe(true);
    });

    it('isVoidClub returns false for standard tier', () => {
        const client = Client.create({ ...validProps, membershipTier: 'standard' });
        expect(client.isVoidClub).toBe(false);
    });

    it('serializes to JSON with all props', () => {
        const client = Client.create(validProps);
        const json = client.toJSON();
        expect(json).toHaveProperty('id', 'cli_01');
        expect(json).toHaveProperty('fullName', 'Ana Silva');
        expect(json).toHaveProperty('email', 'ana@void.com');
        expect(json).toHaveProperty('membershipTier', 'void_club');
    });

    it('exposes all getters', () => {
        const client = Client.create({ ...validProps, cpf: '52998224725', profession: 'engineer' });
        expect(client.cpf).toBe('52998224725');
        expect(client.profession).toBe('engineer');
        expect(client.role).toBe('client');
    });
});
