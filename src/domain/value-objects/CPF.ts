import { ValidationError } from '../errors/DomainError';

export class CPF {
    private constructor(readonly value: string) { }

    static create(raw: string): CPF {
        const digits = raw.replace(/\D/g, '');

        if (digits.length !== 11) {
            throw new ValidationError('Invalid CPF', {
                cpf: ['CPF must have 11 digits'],
            });
        }

        if (!CPF.isValid(digits)) {
            throw new ValidationError('Invalid CPF', {
                cpf: ['CPF check digits are invalid'],
            });
        }

        return new CPF(digits);
    }

    static createOptional(raw?: string): CPF | undefined {
        if (!raw || raw.trim() === '') return undefined;
        return CPF.create(raw);
    }

    get formatted(): string {
        return `${this.value.slice(0, 3)}.${this.value.slice(3, 6)}.${this.value.slice(6, 9)}-${this.value.slice(9)}`;
    }

    /** Masked for display: ***.456.789-** */
    get masked(): string {
        return `***.${this.value.slice(3, 6)}.${this.value.slice(6, 9)}-**`;
    }

    equals(other: CPF): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.formatted;
    }

    private static isValid(digits: string): boolean {
        if (/^(\d)\1{10}$/.test(digits)) return false;

        const calcDigit = (slice: string, factor: number): number => {
            let sum = 0;
            for (let i = 0; i < slice.length; i++) {
                sum += parseInt(slice[i]) * (factor - i);
            }
            const remainder = sum % 11;
            return remainder < 2 ? 0 : 11 - remainder;
        };

        const d1 = calcDigit(digits.slice(0, 9), 10);
        const d2 = calcDigit(digits.slice(0, 10), 11);

        return d1 === parseInt(digits[9]) && d2 === parseInt(digits[10]);
    }
}
