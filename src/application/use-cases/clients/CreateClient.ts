import { ConflictError } from '@/domain/errors/DomainError';
import { ClientRepository } from '@/domain/ports/ClientRepository';
import { Client } from '@/domain/entities/Client';
import { CreateClientInput } from '@/application/contracts/client.contracts';

export class CreateClient {
    constructor(private readonly clientRepo: ClientRepository) { }

    async execute(input: CreateClientInput) {
        const existing = await this.clientRepo.findByEmail(input.email);
        if (existing) {
            throw new ConflictError(`A client with email "${input.email}" already exists`);
        }

        return this.clientRepo.create(Client.new({
            id: crypto.randomUUID(),
            email: input.email,
            fullName: input.fullName,
            role: 'client',
            phone: input.phone,
            photoUrl: input.photoUrl,
        }).toJSON());
    }
}
