import { ServiceRepository } from '@/domain/ports/ServiceRepository';
import { ServiceProps } from '@/domain/entities/Service';
import { db } from '../drizzle/db';
import { services } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export class DrizzleServiceRepository implements ServiceRepository {
    async findById(id: string): Promise<ServiceProps | null> {
        const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
        if (result.length === 0) return null;
        return this.mapToEntity(result[0]);
    }

    async findAll(activeOnly?: boolean): Promise<ServiceProps[]> {
        let query = db.select().from(services);
        if (activeOnly) {
            query = query.where(eq(services.active, true)) as any;
        }
        const rows = await query;
        return rows.map(this.mapToEntity);
    }

    async create(data: Omit<ServiceProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceProps> {
        const id = crypto.randomUUID();
        const now = new Date();

        const newService = {
            id,
            ...data,
            createdAt: now,
            updatedAt: now,
        };

        await db.insert(services).values(newService);
        return newService;
    }

    async update(id: string, data: Partial<ServiceProps>): Promise<ServiceProps | null> {
        await db.update(services)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(services.id, id));

        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await db.delete(services).where(eq(services.id, id)).returning({ id: services.id });
        return result.length > 0;
    }

    private mapToEntity(row: typeof services.$inferSelect): ServiceProps {
        return {
            id: row.id,
            name: row.name,
            description: row.description || undefined,
            duration: row.duration,
            price: row.price,
            active: row.active,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
    }
}
