import { TankProps } from '@/domain/entities/Tank';
import { TankRepository, TankFilters } from '@/domain/ports/TankRepository';
import { PaginatedResult, PaginationParams, paginate } from '@/domain/shared/pagination';
import { seedTanks } from '@/infrastructure/seed/tanks';

const tanks: TankProps[] = [...seedTanks];

export class InMemoryTankRepository implements TankRepository {
    async findById(id: string): Promise<TankProps | null> {
        return tanks.find(t => t.id === id) ?? null;
    }

    async findMany(filters: TankFilters, pagination: PaginationParams): Promise<PaginatedResult<TankProps>> {
        let result = [...tanks];
        if (filters.locationId) result = result.filter(t => t.locationId === filters.locationId);
        if (filters.status) result = result.filter(t => t.status === filters.status);
        if (filters.active !== undefined) result = result.filter(t => t.active === filters.active);
        return paginate(result, pagination);
    }

    async create(data: Omit<TankProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<TankProps> {
        const tank: TankProps = { ...data, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
        tanks.push(tank);
        return tank;
    }

    async update(id: string, data: Partial<TankProps>): Promise<TankProps | null> {
        const idx = tanks.findIndex(t => t.id === id);
        if (idx === -1) return null;
        tanks[idx] = { ...tanks[idx], ...data, updatedAt: new Date() };
        return tanks[idx];
    }
}
