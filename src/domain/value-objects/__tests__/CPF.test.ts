import { describe, it, expect } from 'vitest';
import { CPF } from '@/domain/value-objects/CPF';

describe('CPF', () => {
    it('creates from valid CPF with formatting', () => {
        const cpf = CPF.create('529.982.247-25');
        expect(cpf.value).toBe('52998224725');
    });

    it('creates from valid CPF digits only', () => {
        const cpf = CPF.create('52998224725');
        expect(cpf.value).toBe('52998224725');
    });

    it('rejects CPF with all same digits', () => {
        expect(() => CPF.create('111.111.111-11')).toThrow();
    });

    it('rejects CPF with wrong check digits', () => {
        expect(() => CPF.create('529.982.247-00')).toThrow();
    });

    it('rejects CPF with wrong length', () => {
        expect(() => CPF.create('1234')).toThrow();
    });

    it('formats correctly', () => {
        const cpf = CPF.create('52998224725');
        expect(cpf.formatted).toBe('529.982.247-25');
    });

    it('masks for PII protection', () => {
        const cpf = CPF.create('52998224725');
        expect(cpf.masked).toBe('***.982.247-**');
    });

    it('equals works', () => {
        const a = CPF.create('529.982.247-25');
        const b = CPF.create('52998224725');
        expect(a.equals(b)).toBe(true);
    });
});
