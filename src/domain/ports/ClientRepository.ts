import { ClientProps } from '../entities/Client';
import { VoidLevel } from '../value-objects/VoidLevel';
import { PaginatedResult, PaginationParams, SortParams } from '../shared/pagination';

export interface ClientFilters {
    search?: string;
    role?: string;
    membershipTier?: string;
    level?: VoidLevel;
    city?: string;
}


export interface ClientRepository {
    findById(id: string): Promise<ClientProps | null>;
    findByEmail(email: string): Promise<ClientProps | null>;
    findMany(
        filters: ClientFilters,
        pagination: PaginationParams,
        sort: SortParams,
    ): Promise<PaginatedResult<ClientProps>>;
    create(data: ClientProps): Promise<ClientProps>;
    update(id: string, data: Partial<ClientProps>): Promise<ClientProps>;
    count(filters?: ClientFilters): Promise<number>;
}
