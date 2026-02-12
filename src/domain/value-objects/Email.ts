import { ValidationError } from '../errors/DomainError';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
    private constructor(readonly value: string) { }

    static create(raw: string): Email {
        const normalized = raw.trim().toLowerCase();
        if (!EMAIL_REGEX.test(normalized)) {
            throw new ValidationError('Invalid email format', {
                email: [`"${raw}" is not a valid email address`],
            });
        }
        return new Email(normalized);
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
