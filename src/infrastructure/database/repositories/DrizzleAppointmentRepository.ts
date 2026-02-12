import { AppointmentRepository, AppointmentFilters } from '@/domain/ports/AppointmentRepository';
import { AppointmentProps, Appointment } from '@/domain/entities/Appointment';
import { PaginatedResult, PaginationParams, paginate } from '@/domain/shared/pagination';
import { db } from '../drizzle/db';
import { appointments } from '../drizzle/schema';
import { eq, and, gte, lte, count, desc, asc } from 'drizzle-orm';

export class DrizzleAppointmentRepository implements AppointmentRepository {
    async findById(id: string): Promise<AppointmentProps | null> {
        const result = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
        if (result.length === 0) return null;
        return this.mapToEntity(result[0]);
    }

    async findMany(
        filters: AppointmentFilters,
        pagination: PaginationParams,
    ): Promise<PaginatedResult<AppointmentProps>> {
        const offset = (pagination.page - 1) * pagination.limit;

        const conditions = [];

        if (filters.clientId) conditions.push(eq(appointments.clientId, filters.clientId));
        if (filters.status) conditions.push(eq(appointments.status, filters.status as any));

        if (filters.startDate && filters.endDate) {
            conditions.push(
                and(
                    gte(appointments.startTime, filters.startDate),
                    lte(appointments.startTime, filters.endDate)
                )
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Count total
        const totalResult = await db.select({ count: count() }).from(appointments).where(whereClause);
        const total = totalResult[0]?.count || 0;

        // Query data
        const rows = await db.select()
            .from(appointments)
            .where(whereClause)
            .limit(pagination.limit)
            .offset(offset)
            .orderBy(desc(appointments.startTime));

        return {
            data: rows.map(this.mapToEntity),
            total,
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(total / pagination.limit),
        };
    }

    async create(data: AppointmentProps): Promise<AppointmentProps> {
        await db.insert(appointments).values({
            ...data,
            // Ensure types match schema
        } as any);
        return data;
    }

    async update(id: string, data: Partial<AppointmentProps>): Promise<AppointmentProps> {
        await db.update(appointments)
            .set({ ...data, updatedAt: new Date() } as any)
            .where(eq(appointments.id, id));

        const updated = await this.findById(id);
        if (!updated) throw new Error('Appointment not found after update');
        return updated;
    }

    async countByDate(date: Date): Promise<number> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const result = await db.select({ count: count() })
            .from(appointments)
            .where(and(
                gte(appointments.startTime, startOfDay),
                lte(appointments.startTime, endOfDay)
            ));

        return result[0]?.count || 0;
    }

    private mapToEntity(row: typeof appointments.$inferSelect): AppointmentProps {
        return {
            ...row,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
            startTime: new Date(row.startTime),
            endTime: new Date(row.endTime),
            status: row.status as any,
            locationId: row.locationId || undefined,
            tankId: row.tankId || undefined,
            notes: row.notes || undefined,
        };
    }
}
