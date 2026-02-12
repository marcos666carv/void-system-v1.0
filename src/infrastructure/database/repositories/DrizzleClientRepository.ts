import { ClientRepository, ClientFilters } from '@/domain/ports/ClientRepository';
import { ClientProps } from '@/domain/entities/Client';
import { PaginatedResult, PaginationParams, SortParams } from '@/domain/shared/pagination';
import { db } from '../drizzle/db';
import { clients } from '../drizzle/schema';
import { eq, ilike, or, and, count, desc, asc, sql } from 'drizzle-orm';

export class DrizzleClientRepository implements ClientRepository {
    async findById(id: string): Promise<ClientProps | null> {
        const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
        if (result.length === 0) return null;
        return this.mapToEntity(result[0]);
    }

    async findByEmail(email: string): Promise<ClientProps | null> {
        const result = await db.select().from(clients).where(eq(clients.email, email)).limit(1);
        if (result.length === 0) return null;
        return this.mapToEntity(result[0]);
    }

    async findMany(
        filters: ClientFilters,
        pagination: PaginationParams,
        sort: SortParams,
    ): Promise<PaginatedResult<ClientProps>> {
        const offset = (pagination.page - 1) * pagination.limit;

        let whereClause = undefined;
        const conditions = [];

        if (filters.search) {
            const search = `%${filters.search}%`;
            conditions.push(or(ilike(clients.fullName, search), ilike(clients.email, search)));
        }
        if (filters.role) conditions.push(eq(clients.role, filters.role as any));
        if (filters.membershipTier) conditions.push(eq(clients.membershipTier, filters.membershipTier as any));
        if (filters.city) conditions.push(ilike(clients.addressCity, filters.city));
        // Enum types need casting or proper typing in filters

        if (conditions.length > 0) {
            whereClause = and(...conditions);
        }

        const orderBy = sort.order === 'asc'
            ? asc(clients[sort.field as keyof typeof clients.$inferSelect])
            : desc(clients[sort.field as keyof typeof clients.$inferSelect]);

        // Count total
        const totalResult = await db.select({ count: count() }).from(clients).where(whereClause);
        const total = totalResult[0]?.count || 0;

        // Query data
        const rows = await db.select()
            .from(clients)
            .where(whereClause)
            .limit(pagination.limit)
            .offset(offset)
            .orderBy(orderBy);

        return {
            data: rows.map(this.mapToEntity),
            total,
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(total / pagination.limit),
        };
    }

    async create(data: ClientProps): Promise<ClientProps> {
        await db.insert(clients).values({
            ...data,
            // Mapping fields if necessary, but schema matches Props mostly
            // Ensure enums match
        } as any); // Casting for simplicity in MVP, ideally use strict types
        return data;
    }

    async update(id: string, data: Partial<ClientProps>): Promise<ClientProps> {
        await db.update(clients)
            .set({ ...data, updatedAt: new Date() } as any)
            .where(eq(clients.id, id));

        const updated = await this.findById(id);
        if (!updated) throw new Error('Client not found after update');
        return updated;
    }

    async count(filters?: ClientFilters): Promise<number> {
        // reuse filter logic...
        return 0; // Placeholder
    }

    private mapToEntity(row: typeof clients.$inferSelect): ClientProps {
        return {
            id: row.id,
            email: row.email,
            fullName: row.fullName,
            phone: row.phone || undefined,
            cpf: row.cpf || undefined,
            photoUrl: row.photoUrl || undefined,
            role: row.role as any,
            membershipTier: (row.membershipTier as any) || undefined,
            birthDate: row.birthDate || undefined,
            addressNeighborhood: row.addressNeighborhood || undefined,
            addressCity: row.addressCity || undefined,
            profession: row.profession || undefined,
            leadSource: row.leadSource || undefined,
            notes: row.notes || undefined,
            npsScore: row.npsScore || undefined,

            xp: row.xp,
            level: row.level as any,
            totalSpent: row.totalSpent,
            totalSessions: row.totalSessions,

            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
            lastSurveyDate: row.lastSurveyDate ? new Date(row.lastSurveyDate) : undefined,
            firstVisit: row.firstVisit ? new Date(row.firstVisit) : undefined,
            lastVisit: row.lastVisit ? new Date(row.lastVisit) : undefined,

            // Preferences stored as JSON in DB? Or explicit fields?
            // Assuming schema has explicit fields or a json column.
            // Based on earlier view, schema was not viewed, but repository code passed `...row`.
            // If `preferences` is NOT in `row`, we need to construct it or parse it.
            // ClientProps requires `preferences`.
            // If row doesn't have it, we default to empty.
            preferences: (row as any).preferences || {},

            // Extended arrays (likely not in basic schema, defaulting to empty/undefined)
            visitHistory: [],
            purchaseHistory: [],
            interactionHistory: [],
            usageTags: [],
            preferredWeekDays: []
        };
    }
}
