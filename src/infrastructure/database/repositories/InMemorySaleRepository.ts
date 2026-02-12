import { SaleProps } from '@/domain/entities/Sale';
import { SaleRepository, SaleFilters, SaleWithDetails } from '@/domain/ports/SaleRepository';
import { PaginatedResult, PaginationParams, paginate } from '@/domain/shared/pagination';
import { seedSales } from '@/infrastructure/seed/sales';
import { seedClients } from '@/infrastructure/seed/clients';
import { seedProducts } from '@/infrastructure/seed/products';

const sales: SaleProps[] = [...seedSales];

export class InMemorySaleRepository implements SaleRepository {
    async findById(id: string): Promise<SaleProps | null> {
        return sales.find(s => s.id === id) ?? null;
    }

    async findMany(
        filters: SaleFilters,
        pagination: PaginationParams,
    ): Promise<PaginatedResult<SaleProps>> {
        let result = [...sales];
        if (filters.clientId) result = result.filter(s => s.clientId === filters.clientId);
        if (filters.status) result = result.filter(s => s.status === filters.status);
        return paginate(result, pagination);
    }

    async findManyWithDetails(
        filters: SaleFilters,
        pagination: PaginationParams,
    ): Promise<PaginatedResult<SaleWithDetails>> {
        const filtered = await this.findMany(filters, { page: 1, limit: 1000 });

        const detailed: SaleWithDetails[] = filtered.data.map(sale => {
            const client = seedClients.find(c => c.id === sale.clientId);
            const items = sale.items.map(item => {
                const product = seedProducts.find(p => p.id === item.productId);
                return { ...item, productName: product?.name ?? 'Unknown' };
            });
            return { ...sale, clientName: client?.fullName ?? 'Unknown', items };
        });

        return paginate(detailed, pagination);
    }

    async create(data: Omit<SaleProps, 'id' | 'createdAt'>): Promise<SaleProps> {
        const newSale: SaleProps = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date(),
        };
        sales.push(newSale);
        return newSale;
    }

    async sumRevenue(filters?: SaleFilters): Promise<number> {
        let result = sales.filter(s => s.status === 'completed');
        if (filters?.clientId) result = result.filter(s => s.clientId === filters.clientId);
        return result.reduce((sum, s) => sum + s.totalAmount, 0);
    }
}
