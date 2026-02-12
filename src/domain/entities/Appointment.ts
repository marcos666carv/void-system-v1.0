export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface AppointmentProps {
    id: string;
    clientId: string;
    serviceId: string;
    locationId?: string;
    tankId?: string;
    startTime: Date;
    endTime: Date;
    status: AppointmentStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Appointment {
    private constructor(private readonly props: AppointmentProps) { }

    static create(props: AppointmentProps): Appointment {
        if (props.endTime <= props.startTime) {
            throw new Error('End time must be after start time');
        }
        return new Appointment({ ...props });
    }

    static new(props: Pick<AppointmentProps, 'clientId' | 'serviceId' | 'startTime' | 'endTime' | 'notes'>): Appointment {
        if (props.endTime <= props.startTime) {
            throw new Error('End time must be after start time');
        }

        return new Appointment({
            ...props,
            id: crypto.randomUUID(),
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    get id() { return this.props.id; }
    get clientId() { return this.props.clientId; }
    get serviceId() { return this.props.serviceId; }
    get startTime() { return this.props.startTime; }
    get endTime() { return this.props.endTime; }
    get status() { return this.props.status; }
    get notes() { return this.props.notes; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }

    get durationMinutes(): number {
        return (this.props.endTime.getTime() - this.props.startTime.getTime()) / 60000;
    }

    get isPast(): boolean {
        return this.props.endTime < new Date();
    }

    get isToday(): boolean {
        const today = new Date();
        return this.props.startTime.toDateString() === today.toDateString();
    }

    get isCancellable(): boolean {
        return this.props.status === 'pending' || this.props.status === 'confirmed';
    }

    toJSON(): AppointmentProps {
        return { ...this.props };
    }
}
