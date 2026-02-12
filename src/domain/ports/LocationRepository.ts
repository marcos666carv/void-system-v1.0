import { LocationProps } from '../entities/Location';
import { PaginatedResult, PaginationParams } from '../shared/pagination';

export interface LocationFilters {
    city?: string;
    active?: boolean;
}

export interface LocationRepository {
    findById(id: string): Promise<LocationProps | null>;
    findMany(filters: LocationFilters, pagination: PaginationParams): Promise<PaginatedResult<LocationProps>>;
    create(data: Omit<LocationProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<LocationProps>;
    update(id: string, data: Partial<LocationProps>): Promise<LocationProps | null>;
    delete(id: string): Promise<boolean>;
}
