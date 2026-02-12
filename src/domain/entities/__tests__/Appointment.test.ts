import { describe, it, expect } from 'vitest';
import { Appointment } from '@/domain/entities/Appointment';

describe('Appointment', () => {
    const now = new Date();
    const future = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const futureEnd = new Date(future.getTime() + 60 * 60 * 1000);
    const pastStart = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const pastEnd = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    const validProps = {
        id: 'appt_01',
        clientId: 'cli_01',
        serviceId: 'svc_01',
        startTime: future,
        endTime: futureEnd,
        status: 'confirmed' as const,
        createdAt: now,
        updatedAt: now,
    };

    it('creates from valid props', () => {
        const appt = Appointment.create(validProps);
        expect(appt.id).toBe('appt_01');
        expect(appt.serviceId).toBe('svc_01');
    });

    it('rejects endTime before startTime', () => {
        expect(() => Appointment.create({
            ...validProps,
            startTime: futureEnd,
            endTime: future,
        })).toThrow('End time must be after start time');
    });

    it('rejects equal start and end time', () => {
        expect(() => Appointment.create({
            ...validProps,
            startTime: future,
            endTime: future,
        })).toThrow();
    });

    it('calculates duration in minutes', () => {
        const appt = Appointment.create(validProps);
        expect(appt.durationMinutes).toBe(60);
    });

    it('isPast returns true for past appointments', () => {
        const appt = Appointment.create({
            ...validProps,
            startTime: pastStart,
            endTime: pastEnd,
        });
        expect(appt.isPast).toBe(true);
    });

    it('isPast returns false for future appointments', () => {
        const appt = Appointment.create(validProps);
        expect(appt.isPast).toBe(false);
    });

    it('isCancellable is true for confirmed future', () => {
        const appt = Appointment.create(validProps);
        expect(appt.isCancellable).toBe(true);
    });

    it('isCancellable is true for pending', () => {
        const appt = Appointment.create({ ...validProps, status: 'pending' });
        expect(appt.isCancellable).toBe(true);
    });

    it('isCancellable is false for cancelled', () => {
        const appt = Appointment.create({ ...validProps, status: 'cancelled' });
        expect(appt.isCancellable).toBe(false);
    });

    it('isCancellable is false for completed', () => {
        const appt = Appointment.create({ ...validProps, status: 'completed' });
        expect(appt.isCancellable).toBe(false);
    });

    it('serializes to JSON', () => {
        const appt = Appointment.create(validProps);
        const json = appt.toJSON();
        expect(json).toHaveProperty('id', 'appt_01');
        expect(json).toHaveProperty('clientId', 'cli_01');
        expect(json).toHaveProperty('serviceId', 'svc_01');
    });
});
