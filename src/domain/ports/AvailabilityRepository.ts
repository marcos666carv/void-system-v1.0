export interface TimeSlot {
    time: string;
    available: boolean;
}

export interface AvailabilityRepository {
    checkAvailability(date: Date, serviceId: string): Promise<TimeSlot[]>;
}
