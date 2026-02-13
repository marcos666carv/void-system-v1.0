import { TankRepository } from '@/domain/ports/TankRepository';
import { TankProps } from '@/domain/entities/Tank';
import { db } from '../drizzle/db';
import { tanks } from '../drizzle/schema';
import { eq, count, and } from 'drizzle-orm';
import { TankFilters } from '@/domain/ports/TankRepository';
import { PaginatedResult, PaginationParams } from '@/domain/shared/pagination';

export class DrizzleTankRepository implements TankRepository {
    async findById(id: string): Promise<TankProps | null> {
        const result = await db.select().from(tanks).where(eq(tanks.id, id)).limit(1);
        if (result.length === 0) return null;
        return this.mapToEntity(result[0]);
    }

    async findByLocation(locationId: string): Promise<TankProps[]> {
        const rows = await db.select().from(tanks).where(eq(tanks.locationId, locationId));
        return rows.map(this.mapToEntity);
    }

    async findMany(filters: TankFilters, pagination: PaginationParams): Promise<PaginatedResult<TankProps>> {
        const offset = (pagination.page - 1) * pagination.limit;
        const conditions = [];

        if (filters.locationId) conditions.push(eq(tanks.locationId, filters.locationId));
        if (filters.status) conditions.push(eq(tanks.status, filters.status));
        if (filters.active !== undefined) conditions.push(eq(tanks.active, filters.active));

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Count
        const totalResult = await db.select({ count: count() }).from(tanks).where(whereClause);
        const total = totalResult[0]?.count || 0;

        const rows = await db.select()
            .from(tanks)
            .where(whereClause)
            .limit(pagination.limit)
            .offset(offset);

        return {
            data: rows.map(this.mapToEntity),
            total,
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(total / pagination.limit),
        };
    }

    async findAll(): Promise<TankProps[]> {
        const rows = await db.select().from(tanks);
        return rows.map(this.mapToEntity);
    }

    async create(data: TankProps): Promise<TankProps> {
        await db.insert(tanks).values({
            id: data.id,
            name: data.name,
            locationId: data.locationId!, // Assuming not null in simplified schema
            status: data.status,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
        return data;
    }

    async update(id: string, data: Partial<TankProps>): Promise<TankProps | null> {
        await db.update(tanks)
            .set({
                name: data.name,
                status: data.status,
                updatedAt: new Date()
            } as any)
            .where(eq(tanks.id, id));

        return this.findById(id);
    }

    private mapToEntity(row: typeof tanks.$inferSelect): TankProps {
        return {
            id: row.id,
            name: row.name,
            locationId: row.locationId!,
            status: row.status as any,

            // Defaults for fields not yet in DB schema or managed by IoT state
            ledsOn: false,
            musicOn: false,
            heaterOn: true,
            pumpOn: true,
            active: true,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,

            // Placeholder for extended stats
            totalSessions: 0,
            totalUsageHours: 0,
            energyConsumedKwh: 0,
        };
    }
}
