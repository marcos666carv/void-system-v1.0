import { LocationRepository, LocationFilters } from '@/domain/ports/LocationRepository';
import { LocationProps } from '@/domain/entities/Location';
import { PaginatedResult, PaginationParams, paginate } from '@/domain/shared/pagination';
import { db } from '../drizzle/db';
import { locations } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';

export class DrizzleLocationRepository implements LocationRepository {
    async findById(id: string): Promise<LocationProps | null> {
        const result = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
        if (result.length === 0) return null;
        return this.mapToEntity(result[0]);
    }

    async findAll(): Promise<LocationProps[]> {
        const rows = await db.select().from(locations);
        return rows.map(this.mapToEntity);
    }

    async create(data: LocationProps): Promise<LocationProps> {
        await db.insert(locations).values(data);
        return data;
    }

    async update(id: string, data: Partial<LocationProps>): Promise<LocationProps | null> {
        await db.update(locations)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(locations.id, id));
        return this.findById(id);
    }

    async findMany(filters: LocationFilters, pagination: PaginationParams): Promise<PaginatedResult<LocationProps>> {
        const conditions = [];
        if (filters.city) conditions.push(eq(locations.city, filters.city));
        if (filters.active !== undefined) conditions.push(eq(locations.active, filters.active));

        let rows;
        if (conditions.length > 0) {
            rows = await db.select().from(locations).where(and(...conditions));
        } else {
            rows = await db.select().from(locations);
        }

        const entities = rows.map(row => this.mapToEntity(row));
        return paginate(entities, pagination);
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await db.delete(locations)
            .where(eq(locations.id, id))
            .returning({ id: locations.id });
        return deleted.length > 0;
    }

    private mapToEntity(row: typeof locations.$inferSelect): LocationProps {
        return {
            id: row.id,
            name: row.name,
            address: row.address,
            city: row.city,
            active: row.active,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
    }
}
