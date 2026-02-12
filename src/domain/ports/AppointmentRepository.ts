import { AppointmentProps } from '../entities/Appointment';
import { PaginatedResult, PaginationParams } from '../shared/pagination';

export interface AppointmentFilters {
    clientId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface AppointmentRepository {
    findById(id: string): Promise<AppointmentProps | null>;
    findMany(
        filters: AppointmentFilters,
        pagination: PaginationParams,
    ): Promise<PaginatedResult<AppointmentProps>>;
    create(data: AppointmentProps): Promise<AppointmentProps>;
    update(id: string, data: Partial<AppointmentProps>): Promise<AppointmentProps>;
    countByDate(date: Date): Promise<number>;
}
