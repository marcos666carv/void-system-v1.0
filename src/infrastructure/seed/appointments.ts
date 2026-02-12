import { AppointmentProps } from '@/domain/entities/Appointment';

const now = new Date();
const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);

function timeAt(base: Date, hours: number, minutes = 0): Date {
    const d = new Date(base);
    d.setHours(hours, minutes, 0, 0);
    return d;
}

export const seedAppointments: AppointmentProps[] = [
    {
        id: 'appt_01',
        clientId: 'usr_cli_01',
        serviceId: 'prod_float_60',
        startTime: timeAt(now, 10, 0),
        endTime: timeAt(now, 11, 0),
        status: 'confirmed',
        createdAt: yesterday,
        updatedAt: yesterday,
    },
    {
        id: 'appt_02',
        clientId: 'usr_cli_02',
        serviceId: 'prod_float_90',
        startTime: timeAt(tomorrow, 14, 0),
        endTime: timeAt(tomorrow, 15, 30),
        status: 'confirmed',
        createdAt: yesterday,
        updatedAt: yesterday,
    },
    {
        id: 'appt_03',
        clientId: 'usr_cli_03',
        serviceId: 'prod_float_60',
        startTime: timeAt(now, 16, 0),
        endTime: timeAt(now, 17, 0),
        status: 'pending',
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 'appt_04',
        clientId: 'usr_cli_04',
        serviceId: 'prod_float_60',
        startTime: timeAt(yesterday, 18, 0),
        endTime: timeAt(yesterday, 19, 0),
        status: 'completed',
        createdAt: yesterday,
        updatedAt: yesterday,
    },
    {
        id: 'appt_05',
        clientId: 'usr_cli_05',
        serviceId: 'prod_float_90',
        startTime: timeAt(tomorrow, 9, 0),
        endTime: timeAt(tomorrow, 10, 30),
        status: 'confirmed',
        createdAt: now,
        updatedAt: now,
    },
];
