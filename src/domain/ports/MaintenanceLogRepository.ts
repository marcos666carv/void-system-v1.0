import { MaintenanceLogProps } from '../entities/MaintenanceLog';
import { PaginatedResult, PaginationParams } from '../shared/pagination';

export interface MaintenanceLogFilters {
    tankId?: string;
    type?: string;
}

export interface MaintenanceLogRepository {
    findByTankId(tankId: string, pagination: PaginationParams): Promise<PaginatedResult<MaintenanceLogProps>>;
    create(data: Omit<MaintenanceLogProps, 'id' | 'createdAt'>): Promise<MaintenanceLogProps>;
}
