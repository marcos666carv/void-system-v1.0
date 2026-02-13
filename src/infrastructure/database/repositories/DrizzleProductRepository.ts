import { ProductRepository, ProductFilters } from '@/domain/ports/ProductRepository';
import { ProductProps } from '@/domain/entities/Product';
import { PaginatedResult, PaginationParams, paginate } from '@/domain/shared/pagination';
import { db } from '../drizzle/db';
import { products } from '../drizzle/schema';
import { eq, and, sql, count } from 'drizzle-orm';

export class DrizzleProductRepository implements ProductRepository {
    async findById(id: string): Promise<ProductProps | null> {
        const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
        if (result.length === 0) return null;
        return this.mapToEntity(result[0]);
    }

    async findMany(
        filters: ProductFilters,
        pagination: PaginationParams,
    ): Promise<PaginatedResult<ProductProps>> {
        const offset = (pagination.page - 1) * pagination.limit;
        const conditions = [];

        if (filters.category) conditions.push(eq(products.category, filters.category));
        if (filters.active !== undefined) conditions.push(eq(products.active, filters.active));

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Count
        const totalResult = await db.select({ count: count() }).from(products).where(whereClause);
        const total = totalResult[0]?.count || 0;

        // Data
        const rows = await db.select()
            .from(products)
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

    async count(filters?: ProductFilters): Promise<number> {
        const conditions = [];
        if (filters?.category) conditions.push(eq(products.category, filters.category));
        if (filters?.active !== undefined) conditions.push(eq(products.active, filters.active));

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        const totalResult = await db.select({ count: count() }).from(products).where(whereClause);
        return totalResult[0]?.count || 0;
    }

    async create(data: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductProps> {
        const id = crypto.randomUUID();
        const now = new Date();
        const newProduct = {
            id,
            ...data,
            createdAt: now,
            updatedAt: now,
        };

        await db.insert(products).values(newProduct as any); // Casting due to jsonb variation complexity
        return newProduct as ProductProps;
    }

    async update(id: string, data: Partial<ProductProps>): Promise<ProductProps | null> {
        await db.update(products)
            .set({ ...data, updatedAt: new Date() } as any)
            .where(eq(products.id, id));

        return this.findById(id);
    }

    private mapToEntity(row: typeof products.$inferSelect): ProductProps {
        return {
            id: row.id,
            name: row.name,
            description: row.description || undefined,
            price: row.price,
            category: row.category as any,
            stock: row.stock,
            active: row.active,
            variations: (row.variations as any) || [],
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            // Defaults/Calculated fields handled by entity logic or mapper
        };
    }
}
