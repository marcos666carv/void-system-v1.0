import { LocationRepository } from '@/domain/ports/LocationRepository';
import { LocationProps } from '@/domain/entities/Location';
import { PaginationParams } from '@/domain/shared/pagination';

export class ListLocations {
    constructor(private readonly locationRepo: LocationRepository) { }
    async execute(pagination: PaginationParams) {
        return this.locationRepo.findMany({}, pagination);
    }
}

export class CreateLocation {
    constructor(private readonly locationRepo: LocationRepository) { }
    async execute(data: Omit<LocationProps, 'id' | 'createdAt' | 'updatedAt'>) {
        return this.locationRepo.create(data);
    }
}

export class UpdateLocation {
    constructor(private readonly locationRepo: LocationRepository) { }
    async execute(id: string, data: Partial<LocationProps>) {
        return this.locationRepo.update(id, data);
    }
}

export class DeleteLocation {
    constructor(private readonly locationRepo: LocationRepository) { }
    async execute(id: string) {
        return this.locationRepo.delete(id);
    }
}
