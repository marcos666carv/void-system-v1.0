import { z } from 'zod';
import { paginationSchema, sortSchema } from './common.contracts';

export const listClientsSchema = paginationSchema.merge(sortSchema).extend({
    search: z.string().optional(),
    role: z.enum(['client', 'admin', 'staff']).optional(),
    membershipTier: z.enum(['standard', 'void_club', 'vip']).optional(),
    city: z.string().optional(),
    sort: z.enum(['fullName', 'email', 'role', 'membershipTier', 'createdAt']).default('fullName'),
});

export const getClientByIdSchema = z.object({
    id: z.string().min(1, 'Client ID is required'),
});

export const createClientSchema = z.object({
    email: z.string().email('Invalid email format'),
    fullName: z.string().min(2, 'Name must be at least 2 characters').max(120),
    phone: z.string().optional(),
    role: z.enum(['client', 'admin', 'staff']).default('client'),
    membershipTier: z.enum(['standard', 'void_club', 'vip']).optional(),
    cpf: z.string().optional(),
    birthDate: z.string().optional(),
    addressNeighborhood: z.string().optional(),
    addressCity: z.string().optional(),
    profession: z.string().optional(),
    leadSource: z.string().optional(),
    notes: z.string().max(1000).optional(),
    photoUrl: z.string().url().optional(),
});

export type ListClientsInput = z.infer<typeof listClientsSchema>;
export type GetClientByIdInput = z.infer<typeof getClientByIdSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
