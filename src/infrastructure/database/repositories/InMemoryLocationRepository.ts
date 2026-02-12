import { LocationProps } from '@/domain/entities/Location';
import { LocationRepository, LocationFilters } from '@/domain/ports/LocationRepository';
import { PaginatedResult, PaginationParams, paginate } from '@/domain/shared/pagination';
import { seedLocations } from '@/infrastructure/seed/locations';

const locations: LocationProps[] = [...seedLocations];

export class InMemoryLocationRepository implements LocationRepository {
    async findById(id: string): Promise<LocationProps | null> {
        return locations.find(l => l.id === id) ?? null;
    }

    async findMany(filters: LocationFilters, pagination: PaginationParams): Promise<PaginatedResult<LocationProps>> {
        let result = [...locations];
        if (filters.city) result = result.filter(l => l.city === filters.city);
        if (filters.active !== undefined) result = result.filter(l => l.active === filters.active);
        return paginate(result, pagination);
    }

    async create(data: Omit<LocationProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<LocationProps> {
        const loc: LocationProps = { ...data, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
        locations.push(loc);
        return loc;
    }

    async update(id: string, data: Partial<LocationProps>): Promise<LocationProps | null> {
        const idx = locations.findIndex(l => l.id === id);
        if (idx === -1) return null;
        locations[idx] = { ...locations[idx], ...data, updatedAt: new Date() };
        return locations[idx];
    }

    async delete(id: string): Promise<boolean> {
        const idx = locations.findIndex(l => l.id === id);
        if (idx === -1) return false;
        locations.splice(idx, 1);
        return true;
    }
}
