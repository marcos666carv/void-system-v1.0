import { EntityNotFoundError } from '@/domain/errors/DomainError';
import { Appointment } from '@/domain/entities/Appointment';
import { AppointmentRepository } from '@/domain/ports/AppointmentRepository';
import { ClientRepository } from '@/domain/ports/ClientRepository';
import { CreateAppointmentInput } from '@/application/contracts/appointment.contracts';

export class CreateAppointment {
    constructor(
        private readonly appointmentRepo: AppointmentRepository,
        private readonly clientRepo: ClientRepository,
    ) { }

    async execute(input: CreateAppointmentInput) {
        const client = await this.clientRepo.findById(input.clientId);
        if (!client) {
            throw new EntityNotFoundError('Client', input.clientId);
        }

        return this.appointmentRepo.create(Appointment.new({
            clientId: input.clientId,
            serviceId: input.serviceId,
            startTime: new Date(input.startTime),
            endTime: new Date(input.endTime),
            notes: input.notes,
        }).toJSON());
    }
}
