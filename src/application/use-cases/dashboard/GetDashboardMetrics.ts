import { ClientRepository } from '@/domain/ports/ClientRepository';
import { AppointmentRepository } from '@/domain/ports/AppointmentRepository';
import { SaleRepository } from '@/domain/ports/SaleRepository';
import { SurveyRepository } from '@/domain/ports/SurveyRepository';

export interface DashboardMetrics {
    totalClients: number;
    totalAppointments: number;
    todayAppointments: number;
    totalRevenue: number;
    averageNps: number;
    averageTicket: number;
    tankIdlePercentage: number;
}

export class GetDashboardMetrics {
    constructor(
        private readonly clientRepo: ClientRepository,
        private readonly appointmentRepo: AppointmentRepository,
        private readonly saleRepo: SaleRepository,
        private readonly surveyRepo: SurveyRepository,
    ) { }

    async execute(): Promise<DashboardMetrics> {
        const [
            totalClients,
            totalAppointments,
            todayAppointments,
            totalRevenue,
            averageNps,
        ] = await Promise.all([
            this.clientRepo.count({ role: 'client' }),
            this.appointmentRepo.findMany({}, { page: 1, limit: 1 }).then(r => r.total),
            this.appointmentRepo.countByDate(new Date()),
            this.saleRepo.sumRevenue(),
            this.surveyRepo.averageNps(),
        ]);

        const averageTicket = totalAppointments > 0 ? totalRevenue / totalAppointments : 0;

        // Mock idle percentage for now (requires complex tank availability logic)
        const tankIdlePercentage = 18; // Placeholder

        return {
            totalClients,
            totalAppointments,
            todayAppointments,
            totalRevenue,
            averageNps,
            averageTicket,
            tankIdlePercentage,
        };
    }
}
