import { SaleProps } from '../entities/Sale';
import { PaginatedResult, PaginationParams } from '../shared/pagination';

export interface SaleWithDetails extends SaleProps {
    clientName: string;
    items: Array<SaleProps['items'][number] & { productName: string }>;
}

export interface SaleFilters {
    clientId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface SaleRepository {
    findById(id: string): Promise<SaleProps | null>;
    findMany(
        filters: SaleFilters,
        pagination: PaginationParams,
    ): Promise<PaginatedResult<SaleProps>>;
    findManyWithDetails(
        filters: SaleFilters,
        pagination: PaginationParams,
    ): Promise<PaginatedResult<SaleWithDetails>>;
    create(data: Omit<SaleProps, 'id' | 'createdAt'>): Promise<SaleProps>;
    sumRevenue(filters?: SaleFilters): Promise<number>;
}
