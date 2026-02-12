import { SurveyProps } from '../entities/Survey';

export interface SurveyRepository {
    findById(id: string): Promise<SurveyProps | null>;
    findByClientId(clientId: string): Promise<SurveyProps[]>;
    findByAppointmentId(appointmentId: string): Promise<SurveyProps | null>;
    create(data: Omit<SurveyProps, 'id' | 'createdAt'>): Promise<SurveyProps>;
    averageNps(): Promise<number>;
}
