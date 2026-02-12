import { BlockedSlotProps } from '@/domain/entities/BlockedSlot';
import { BlockedSlotRepository, BlockedSlotFilters } from '@/domain/ports/BlockedSlotRepository';
import { PaginatedResult, PaginationParams, paginate } from '@/domain/shared/pagination';

const blockedSlots: BlockedSlotProps[] = [];

export class InMemoryBlockedSlotRepository implements BlockedSlotRepository {
    async findMany(filters: BlockedSlotFilters, pagination: PaginationParams): Promise<PaginatedResult<BlockedSlotProps>> {
        let result = [...blockedSlots];
        if (filters.locationId) result = result.filter(s => s.locationId === filters.locationId);
        if (filters.tankId) result = result.filter(s => s.tankId === filters.tankId);
        if (filters.startDate) result = result.filter(s => s.endTime >= filters.startDate!);
        if (filters.endDate) result = result.filter(s => s.startTime <= filters.endDate!);
        return paginate(result, pagination);
    }

    async create(data: Omit<BlockedSlotProps, 'id' | 'createdAt'>): Promise<BlockedSlotProps> {
        const slot: BlockedSlotProps = { ...data, id: crypto.randomUUID(), createdAt: new Date() };
        blockedSlots.push(slot);
        return slot;
    }

    async delete(id: string): Promise<boolean> {
        const idx = blockedSlots.findIndex(s => s.id === id);
        if (idx === -1) return false;
        blockedSlots.splice(idx, 1);
        return true;
    }
}
