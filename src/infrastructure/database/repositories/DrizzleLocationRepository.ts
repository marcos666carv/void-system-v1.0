import { LocationRepository } from '@/domain/ports/LocationRepository';
import { LocationProps } from '@/domain/entities/Location';
import { db } from '../drizzle/db';
import { locations } from '../drizzle/schema';
import { eq, count, and } from 'drizzle-orm';
import { LocationFilters } from '@/domain/ports/LocationRepository'; // Also needed filters import adjustment if not present

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

    // Adding method to handle missing implementation in port if necessary, 
    // assuming port matches InMemoryLocationRepository structure.

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
