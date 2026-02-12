import { OperatingHoursProps } from '../entities/OperatingHours';

export interface OperatingHoursRepository {
    findByLocation(locationId: string): Promise<OperatingHoursProps[]>;
    upsert(data: OperatingHoursProps): Promise<OperatingHoursProps>;
}
