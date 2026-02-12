import { TankRepository } from '@/domain/ports/TankRepository';
import { TankProps } from '@/domain/entities/Tank';
import { MaintenanceLogRepository } from '@/domain/ports/MaintenanceLogRepository';
import { MaintenanceLogProps } from '@/domain/entities/MaintenanceLog';
import { PaginationParams } from '@/domain/shared/pagination';

export class ListTanks {
    constructor(private readonly tankRepo: TankRepository) { }
    async execute(filters: { locationId?: string }, pagination: PaginationParams) {
        return this.tankRepo.findMany(filters, pagination);
    }
}

export class CreateTank {
    constructor(private readonly tankRepo: TankRepository) { }
    async execute(data: Omit<TankProps, 'id' | 'createdAt' | 'updatedAt'>) {
        return this.tankRepo.create(data);
    }
}

export class UpdateTank {
    constructor(private readonly tankRepo: TankRepository) { }
    async execute(id: string, data: Partial<TankProps>) {
        return this.tankRepo.update(id, data);
    }
}

export class CreateMaintenanceLog {
    constructor(private readonly maintenanceRepo: MaintenanceLogRepository) { }
    async execute(data: Omit<MaintenanceLogProps, 'id' | 'createdAt'>) {
        return this.maintenanceRepo.create(data);
    }
}

export class ListMaintenanceLogs {
    constructor(private readonly maintenanceRepo: MaintenanceLogRepository) { }
    async execute(tankId: string, pagination: PaginationParams) {
        return this.maintenanceRepo.findByTankId(tankId, pagination);
    }
}

export class GetTankById {
    constructor(private readonly tankRepo: TankRepository) { }
    async execute(id: string) {
        return this.tankRepo.findById(id);
    }
}
