import { ClientRepository } from '@/domain/ports/ClientRepository';
import { ListClientsInput } from '@/application/contracts/client.contracts';

export class ListClients {
    constructor(private readonly clientRepo: ClientRepository) { }

    async execute(input: ListClientsInput) {
        return this.clientRepo.findMany(
            {
                search: input.search,
                role: input.role,
                membershipTier: input.membershipTier,
                city: input.city,
            },
            { page: input.page, limit: input.limit },
            { field: input.sort, order: input.order },
        );
    }
}
