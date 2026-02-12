import { EntityNotFoundError } from '@/domain/errors/DomainError';
import { ClientRepository } from '@/domain/ports/ClientRepository';
import { SurveyRepository } from '@/domain/ports/SurveyRepository';
import { AppointmentRepository } from '@/domain/ports/AppointmentRepository';
import { SaleRepository } from '@/domain/ports/SaleRepository';

export class GetClientById {
    constructor(
        private readonly clientRepo: ClientRepository,
        private readonly appointmentRepo: AppointmentRepository,
        private readonly saleRepo: SaleRepository,
        private readonly surveyRepo: SurveyRepository,
    ) { }

    async execute(id: string) {
        const client = await this.clientRepo.findById(id);

        if (!client || client.role !== 'client') {
            throw new EntityNotFoundError('Client', id);
        }

        const [appointments, sales, surveys] = await Promise.all([
            this.appointmentRepo.findMany({ clientId: id }, { page: 1, limit: 50 }),
            this.saleRepo.findManyWithDetails({ clientId: id }, { page: 1, limit: 50 }),
            this.surveyRepo.findByClientId(id),
        ]);

        return {
            ...client,
            appointments: appointments.data,
            sales: sales.data,
            surveys,
        };
    }
}
