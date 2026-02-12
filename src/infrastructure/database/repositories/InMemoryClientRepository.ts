import { ClientProps } from '@/domain/entities/Client';
import { ClientRepository, ClientFilters } from '@/domain/ports/ClientRepository';
import { PaginatedResult, PaginationParams, SortParams, paginate } from '@/domain/shared/pagination';
import { seedClients } from '@/infrastructure/seed/clients';

const clients: ClientProps[] = [...seedClients];

export class InMemoryClientRepository implements ClientRepository {
    async findById(id: string): Promise<ClientProps | null> {
        return clients.find(c => c.id === id) ?? null;
    }

    async findByEmail(email: string): Promise<ClientProps | null> {
        return clients.find(c => c.email === email.toLowerCase()) ?? null;
    }

    async findMany(
        filters: ClientFilters,
        pagination: PaginationParams,
        sort: SortParams,
    ): Promise<PaginatedResult<ClientProps>> {
        let result = clients.filter(c => c.role === 'client');

        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(c =>
                c.fullName.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q),
            );
        }

        if (filters.membershipTier) {
            result = result.filter(c => c.membershipTier === filters.membershipTier);
        }

        if (filters.city) {
            result = result.filter(c => c.addressCity?.toLowerCase() === filters.city!.toLowerCase());
        }

        if (filters.level) {
            result = result.filter(c => c.level === filters.level);
        }


        result.sort((a, b) => {
            const field = sort.field as keyof ClientProps;
            const valA = String(a[field] ?? '');
            const valB = String(b[field] ?? '');
            return sort.order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });

        return paginate(result, pagination);
    }

    async create(data: ClientProps): Promise<ClientProps> {
        clients.push(data);
        return data;
    }

    async update(id: string, data: Partial<ClientProps>): Promise<ClientProps> {
        const index = clients.findIndex(c => c.id === id);
        if (index === -1) throw new Error(`Client ${id} not found`);
        clients[index] = { ...clients[index], ...data, updatedAt: new Date() };
        return clients[index];
    }

    async count(filters?: ClientFilters): Promise<number> {
        let result = clients;
        if (filters?.role) {
            result = result.filter(c => c.role === filters.role);
        }
        return result.length;
    }
}
