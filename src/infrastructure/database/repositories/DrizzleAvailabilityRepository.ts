import { AvailabilityRepository, TimeSlot } from '@/domain/ports/AvailabilityRepository';
import { db } from '../drizzle/db';
import { appointments, tanks, services } from '../drizzle/schema';
import { eq, and, gte, lt, or } from 'drizzle-orm';

export class DrizzleAvailabilityRepository implements AvailabilityRepository {
    async checkAvailability(date: Date, serviceId: string): Promise<TimeSlot[]> {
        // Defines the opening hours (e.g., 08:00 to 22:00)
        const startHour = 8;
        const endHour = 22;
        const slots: TimeSlot[] = [];

        // 1. Get service duration
        const service = await db.select().from(services).where(eq(services.id, serviceId)).limit(1);
        if (!service.length) return [];
        const durationMinutes = service[0].duration;

        // 2. Count total tanks (resources)
        const allTanks = await db.select().from(tanks).where(eq(tanks.active, true));
        const totalResources = allTanks.length;

        if (totalResources === 0) return [];

        // 3. Normalize date to start of day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // 4. Fetch existing appointments for the day
        const dayAppointments = await db.select()
            .from(appointments)
            .where(
                and(
                    gte(appointments.startTime, startOfDay),
                    lt(appointments.startTime, endOfDay)
                )
            );

        // 5. Generate slots
        for (let hour = startHour; hour < endHour; hour++) {
            // Check hour and half-hour
            for (let minute of [0, 30]) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

                const slotStart = new Date(startOfDay);
                slotStart.setHours(hour, minute, 0, 0);

                const slotEnd = new Date(slotStart);
                slotEnd.setMinutes(slotStart.getMinutes() + durationMinutes);

                // Check how many appointments overlap with this slot
                const overlapping = dayAppointments.filter(app => {
                    const appStart = new Date(app.startTime);
                    const appEnd = new Date(app.endTime);

                    return (
                        (slotStart >= appStart && slotStart < appEnd) || // Slot starts during app
                        (slotEnd > appStart && slotEnd <= appEnd) ||     // Slot ends during app
                        (slotStart <= appStart && slotEnd >= appEnd)     // Slot engulfs app
                    );
                });

                // If overlapping appointments < total resources, slot is available
                // Note: deeply assuming any tank can serve any service for MVP. 
                // Refinements: check tank compatibility with service.
                const isAvailable = overlapping.length < totalResources;

                slots.push({
                    time: timeString,
                    available: isAvailable
                });
            }
        }

        return slots;
    }
}
