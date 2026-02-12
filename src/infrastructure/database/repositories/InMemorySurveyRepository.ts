import { SurveyProps } from '@/domain/entities/Survey';
import { SurveyRepository } from '@/domain/ports/SurveyRepository';
import { seedSurveys } from '@/infrastructure/seed/surveys';

const surveys: SurveyProps[] = [...seedSurveys];

export class InMemorySurveyRepository implements SurveyRepository {
    async findById(id: string): Promise<SurveyProps | null> {
        return surveys.find(s => s.id === id) ?? null;
    }

    async findByClientId(clientId: string): Promise<SurveyProps[]> {
        return surveys.filter(s => s.clientId === clientId);
    }

    async findByAppointmentId(appointmentId: string): Promise<SurveyProps | null> {
        return surveys.find(s => s.appointmentId === appointmentId) ?? null;
    }

    async create(data: Omit<SurveyProps, 'id' | 'createdAt'>): Promise<SurveyProps> {
        const newSurvey: SurveyProps = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date(),
        };
        surveys.push(newSurvey);
        return newSurvey;
    }

    async averageNps(): Promise<number> {
        if (surveys.length === 0) return 0;
        return surveys.reduce((sum, s) => sum + s.npsScore, 0) / surveys.length;
    }
}
