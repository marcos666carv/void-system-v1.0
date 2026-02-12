import { ProductProps } from '@/domain/entities/Product';
import { PaginatedResult, PaginationParams } from '@/domain/shared/pagination';

export interface ProductFilters {
    category?: string;
    active?: boolean;
}

export interface ProductRepository {
    findById(id: string): Promise<ProductProps | null>;
    findMany(filters: ProductFilters, pagination: PaginationParams): Promise<PaginatedResult<ProductProps>>;
    count(filters?: ProductFilters): Promise<number>;
    create(data: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductProps>;
    update(id: string, data: Partial<ProductProps>): Promise<ProductProps | null>;
}
