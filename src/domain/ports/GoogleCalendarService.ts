export interface CalendarEvent {
    id: string;
    summary: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    location?: string;
}

export interface GoogleCalendarService {
    listEvents(startTime: Date, endTime: Date): Promise<CalendarEvent[]>;
    createEvent(event: Omit<CalendarEvent, 'id'>): Promise<string>; // returns event ID
    updateEvent(id: string, event: Partial<CalendarEvent>): Promise<void>;
    deleteEvent(id: string): Promise<void>;
    getAuthUrl(): string;
    handleCallback(code: string): Promise<void>;
}
