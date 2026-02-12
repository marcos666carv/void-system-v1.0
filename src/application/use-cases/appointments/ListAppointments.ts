import { AppointmentRepository } from '@/domain/ports/AppointmentRepository';
import { ListAppointmentsInput } from '@/application/contracts/appointment.contracts';

export class ListAppointments {
    constructor(private readonly appointmentRepo: AppointmentRepository) { }

    async execute(input: ListAppointmentsInput) {
        return this.appointmentRepo.findMany(
            {
                clientId: input.clientId,
                status: input.status,
                startDate: input.startDate,
                endDate: input.endDate,
            },
            { page: input.page, limit: input.limit },
        );
    }
}
