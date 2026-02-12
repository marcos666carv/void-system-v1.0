import { LocationProps } from '@/domain/entities/Location';

const now = new Date();

export const seedLocations: LocationProps[] = [
    { id: 'loc_curitiba', name: 'Void Float Curitiba', address: 'Curitiba, PR', city: 'Curitiba', active: true, createdAt: now, updatedAt: now },
    { id: 'loc_campo_largo', name: 'Void Float Campo Largo', address: 'Campo Largo, PR', city: 'Campo Largo', active: true, createdAt: now, updatedAt: now },
];
