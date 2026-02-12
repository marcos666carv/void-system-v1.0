import { describe, it, expect } from 'vitest';
import { Phone } from '@/domain/value-objects/Phone';

describe('Phone', () => {
    it('creates from valid phone with formatting', () => {
        const phone = Phone.create('(11) 99999-8888');
        expect(phone.value).toBe('11999998888');
    });

    it('creates from digits only', () => {
        const phone = Phone.create('11999998888');
        expect(phone.value).toBe('11999998888');
    });

    it('rejects too short', () => {
        expect(() => Phone.create('123')).toThrow();
    });

    it('formats correctly', () => {
        const phone = Phone.create('11999998888');
        expect(phone.formatted).toMatch(/\(\d{2}\)\s\d{4,5}-\d{4}/);
    });

    it('equals works', () => {
        const a = Phone.create('(11) 99999-8888');
        const b = Phone.create('11999998888');
        expect(a.equals(b)).toBe(true);
    });
});
