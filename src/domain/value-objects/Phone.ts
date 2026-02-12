import { ValidationError } from '../errors/DomainError';

export class Phone {
    private constructor(readonly value: string) { }

    static create(raw: string): Phone {
        const digits = raw.replace(/\D/g, '');

        if (digits.length < 10 || digits.length > 13) {
            throw new ValidationError('Invalid phone number', {
                phone: ['Phone must have between 10 and 13 digits'],
            });
        }

        return new Phone(digits);
    }

    static createOptional(raw?: string): Phone | undefined {
        if (!raw || raw.trim() === '') return undefined;
        return Phone.create(raw);
    }

    get formatted(): string {
        const d = this.value;
        if (d.length === 13) return `+${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 9)}-${d.slice(9)}`;
        if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
        if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
        return d;
    }

    equals(other: Phone): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.formatted;
    }
}
