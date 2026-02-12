import { BlockedSlotProps } from '../entities/BlockedSlot';
import { PaginatedResult, PaginationParams } from '../shared/pagination';

export interface BlockedSlotFilters {
    locationId?: string;
    tankId?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface BlockedSlotRepository {
    findMany(filters: BlockedSlotFilters, pagination: PaginationParams): Promise<PaginatedResult<BlockedSlotProps>>;
    create(data: Omit<BlockedSlotProps, 'id' | 'createdAt'>): Promise<BlockedSlotProps>;
    delete(id: string): Promise<boolean>;
}
