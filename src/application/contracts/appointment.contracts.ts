import { z } from 'zod';
import { paginationSchema } from './common.contracts';

export const listAppointmentsSchema = paginationSchema.extend({
    clientId: z.string().optional(),
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show']).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
});

export const createAppointmentSchema = z.object({
    clientId: z.string().min(1, 'Client ID is required'),
    serviceId: z.string().min(1, 'Service ID is required'),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    notes: z.string().max(500).optional(),
}).refine(
    data => data.endTime > data.startTime,
    { message: 'End time must be after start time', path: ['endTime'] },
);

export type ListAppointmentsInput = z.infer<typeof listAppointmentsSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
