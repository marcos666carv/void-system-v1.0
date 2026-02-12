import { describe, it, expect } from 'vitest';
import { Email } from '@/domain/value-objects/Email';

describe('Email', () => {
    it('creates from valid email', () => {
        const email = Email.create('Test@Example.COM');
        expect(email.value).toBe('test@example.com');
    });

    it('trims whitespace', () => {
        const email = Email.create('  user@void.com  ');
        expect(email.value).toBe('user@void.com');
    });

    it('rejects invalid email', () => {
        expect(() => Email.create('not-an-email')).toThrow('Invalid email format');
    });

    it('rejects empty string', () => {
        expect(() => Email.create('')).toThrow();
    });

    it('equals works', () => {
        const a = Email.create('a@b.com');
        const b = Email.create('A@B.COM');
        expect(a.equals(b)).toBe(true);
    });

    it('toString returns value', () => {
        const email = Email.create('user@void.com');
        expect(email.toString()).toBe('user@void.com');
    });
});
