import { BlockedSlotRepository, BlockedSlotFilters } from '@/domain/ports/BlockedSlotRepository';
import { BlockedSlotProps } from '@/domain/entities/BlockedSlot';
import { OperatingHoursRepository } from '@/domain/ports/OperatingHoursRepository';
import { OperatingHoursProps } from '@/domain/entities/OperatingHours';
import { AppointmentRepository } from '@/domain/ports/AppointmentRepository';
import { AppointmentProps } from '@/domain/entities/Appointment';
import { PaginationParams } from '@/domain/shared/pagination';

export class ListBlockedSlots {
    constructor(private readonly blockedSlotRepo: BlockedSlotRepository) { }
    async execute(filters: BlockedSlotFilters, pagination: PaginationParams) {
        return this.blockedSlotRepo.findMany(filters, pagination);
    }
}

export class CreateBlockedSlot {
    constructor(private readonly blockedSlotRepo: BlockedSlotRepository) { }
    async execute(data: Omit<BlockedSlotProps, 'id' | 'createdAt'>) {
        return this.blockedSlotRepo.create(data);
    }
}

export class DeleteBlockedSlot {
    constructor(private readonly blockedSlotRepo: BlockedSlotRepository) { }
    async execute(id: string) {
        return this.blockedSlotRepo.delete(id);
    }
}

export class GetOperatingHours {
    constructor(private readonly operatingHoursRepo: OperatingHoursRepository) { }
    async execute(locationId: string) {
        return this.operatingHoursRepo.findByLocation(locationId);
    }
}

export class UpsertOperatingHours {
    constructor(private readonly operatingHoursRepo: OperatingHoursRepository) { }
    async execute(data: OperatingHoursProps) {
        return this.operatingHoursRepo.upsert(data);
    }
}

export class RescheduleAppointment {
    constructor(private readonly appointmentRepo: AppointmentRepository) { }
    async execute(id: string, data: Partial<AppointmentProps>) {
        return this.appointmentRepo.update(id, data);
    }
}
