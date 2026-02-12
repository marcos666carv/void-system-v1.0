import { SurveyProps } from '@/domain/entities/Survey';

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

export const seedSurveys: SurveyProps[] = [
    {
        id: 'surv_01',
        clientId: 'usr_cli_01',
        appointmentId: 'appt_01',
        npsScore: 10,
        waterTempRating: 'perfect',
        afterFeeling: 'Relaxado e sem dores',
        comments: 'Experiência incrível!',
        createdAt: yesterday,
    },
    {
        id: 'surv_02',
        clientId: 'usr_cli_03',
        appointmentId: 'appt_04',
        npsScore: 9,
        waterTempRating: 'perfect',
        afterFeeling: 'Energizada',
        createdAt: threeDaysAgo,
    },
];
