import { OperatingHoursProps } from '@/domain/entities/OperatingHours';
import { OperatingHoursRepository } from '@/domain/ports/OperatingHoursRepository';

const hours: OperatingHoursProps[] = [];

export class InMemoryOperatingHoursRepository implements OperatingHoursRepository {
    async findByLocation(locationId: string): Promise<OperatingHoursProps[]> {
        return hours.filter(h => h.locationId === locationId);
    }

    async upsert(data: OperatingHoursProps): Promise<OperatingHoursProps> {
        const idx = hours.findIndex(h => h.locationId === data.locationId && h.dayOfWeek === data.dayOfWeek);
        if (idx !== -1) {
            hours[idx] = data;
        } else {
            hours.push(data);
        }
        return data;
    }
}
