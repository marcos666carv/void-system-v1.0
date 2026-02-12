import { MaintenanceLogProps } from '@/domain/entities/MaintenanceLog';
import { MaintenanceLogRepository } from '@/domain/ports/MaintenanceLogRepository';
import { PaginatedResult, PaginationParams, paginate } from '@/domain/shared/pagination';

const logs: MaintenanceLogProps[] = [];

export class InMemoryMaintenanceLogRepository implements MaintenanceLogRepository {
    async findByTankId(tankId: string, pagination: PaginationParams): Promise<PaginatedResult<MaintenanceLogProps>> {
        const filtered = logs.filter(l => l.tankId === tankId).sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime());
        return paginate(filtered, pagination);
    }

    async create(data: Omit<MaintenanceLogProps, 'id' | 'createdAt'>): Promise<MaintenanceLogProps> {
        const log: MaintenanceLogProps = { ...data, id: crypto.randomUUID(), createdAt: new Date() };
        logs.push(log);
        return log;
    }
}
