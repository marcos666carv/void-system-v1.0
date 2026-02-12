import { GoogleCalendarService, CalendarEvent } from '@/domain/ports/GoogleCalendarService';

export class StubGoogleCalendarService implements GoogleCalendarService {
    async listEvents(startTime: Date, endTime: Date): Promise<CalendarEvent[]> {
        console.log('Stub: listEvents', startTime, endTime);
        return [];
    }

    async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<string> {
        console.log('Stub: createEvent', event);
        return 'stub_event_id_' + Date.now();
    }

    async updateEvent(id: string, event: Partial<CalendarEvent>): Promise<void> {
        console.log('Stub: updateEvent', id, event);
    }

    async deleteEvent(id: string): Promise<void> {
        console.log('Stub: deleteEvent', id);
    }

    getAuthUrl(): string {
        return 'http://localhost:3000/admin/calendar/oauth-callback'; // details to be implemented
    }

    async handleCallback(code: string): Promise<void> {
        console.log('Stub: handleCallback', code);
    }
}
