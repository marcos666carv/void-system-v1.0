import { AppointmentProps } from '@/domain/entities/Appointment';
import { AppointmentRepository, AppointmentFilters } from '@/domain/ports/AppointmentRepository';
import { PaginatedResult, PaginationParams, paginate } from '@/domain/shared/pagination';
import { seedAppointments } from '@/infrastructure/seed/appointments';

const appointments: AppointmentProps[] = [...seedAppointments];

export class InMemoryAppointmentRepository implements AppointmentRepository {
    async findById(id: string): Promise<AppointmentProps | null> {
        return appointments.find(a => a.id === id) ?? null;
    }

    async findMany(
        filters: AppointmentFilters,
        pagination: PaginationParams,
    ): Promise<PaginatedResult<AppointmentProps>> {
        let result = [...appointments];

        if (filters.clientId) {
            result = result.filter(a => a.clientId === filters.clientId);
        }
        if (filters.status) {
            result = result.filter(a => a.status === filters.status);
        }
        if (filters.startDate && filters.endDate) {
            result = result.filter(a => {
                const t = new Date(a.startTime).getTime();
                return t >= filters.startDate!.getTime() && t <= filters.endDate!.getTime();
            });
        }

        return paginate(result, pagination);
    }

    async create(data: AppointmentProps): Promise<AppointmentProps> {
        appointments.push(data);
        return data;
    }

    async update(id: string, data: Partial<AppointmentProps>): Promise<AppointmentProps> {
        const index = appointments.findIndex(a => a.id === id);
        if (index === -1) throw new Error(`Appointment ${id} not found`);
        appointments[index] = { ...appointments[index], ...data, updatedAt: new Date() };
        return appointments[index];
    }

    async countByDate(date: Date): Promise<number> {
        const dateStr = date.toDateString();
        return appointments.filter(a => new Date(a.startTime).toDateString() === dateStr).length;
    }
}
