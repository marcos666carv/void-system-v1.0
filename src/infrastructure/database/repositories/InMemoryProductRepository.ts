import { ProductProps } from '@/domain/entities/Product';
import { ProductRepository, ProductFilters } from '@/domain/ports/ProductRepository';
import { PaginatedResult, PaginationParams, paginate } from '@/domain/shared/pagination';
import { seedProducts } from '@/infrastructure/seed/products';

declare global {
    var _productStore: ProductProps[] | undefined;
}

if (!global._productStore) {
    global._productStore = [...seedProducts];
}
const products = global._productStore!;

export class InMemoryProductRepository implements ProductRepository {
    async findById(id: string): Promise<ProductProps | null> {
        return products.find(p => p.id === id) ?? null;
    }

    async findMany(
        filters: ProductFilters,
        pagination: PaginationParams,
    ): Promise<PaginatedResult<ProductProps>> {
        let result = [...products];
        if (filters.category) result = result.filter(p => p.category === filters.category);
        if (filters.active !== undefined) result = result.filter(p => p.active === filters.active);
        return paginate(result, pagination);
    }

    async count(filters?: ProductFilters): Promise<number> {
        let result = products;
        if (filters?.category) result = result.filter(p => p.category === filters.category);
        if (filters?.active !== undefined) result = result.filter(p => p.active === filters.active);
        return result.length;
    }

    async create(data: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductProps> {
        const newProduct: ProductProps = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        products.push(newProduct);
        return newProduct;
    }

    async update(id: string, data: Partial<ProductProps>): Promise<ProductProps | null> {
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;

        const updatedProduct: ProductProps = {
            ...products[index],
            ...data,
            updatedAt: new Date(),
        };
        products[index] = updatedProduct;
        return updatedProduct;
    }
}
