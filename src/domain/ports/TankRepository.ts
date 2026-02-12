import { TankProps } from '../entities/Tank';
import { PaginatedResult, PaginationParams } from '../shared/pagination';

export interface TankFilters {
    locationId?: string;
    status?: string;
    active?: boolean;
}

export interface TankRepository {
    findById(id: string): Promise<TankProps | null>;
    findMany(filters: TankFilters, pagination: PaginationParams): Promise<PaginatedResult<TankProps>>;
    create(data: Omit<TankProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<TankProps>;
    update(id: string, data: Partial<TankProps>): Promise<TankProps | null>;
}
