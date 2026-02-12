export interface OperatingHoursProps {
    id: string;
    locationId: string;
    dayOfWeek: number; // 0=Sunday, 6=Saturday
    openTime: string;  // "09:00"
    closeTime: string; // "21:00"
    active: boolean;
}

export class OperatingHours {
    private constructor(private readonly props: OperatingHoursProps) { }

    static create(props: OperatingHoursProps): OperatingHours {
        if (props.dayOfWeek < 0 || props.dayOfWeek > 6) throw new Error('Invalid day of week');
        if (!props.openTime || !props.closeTime) throw new Error('Operating hours are required');
        return new OperatingHours({ ...props });
    }

    get id() { return this.props.id; }
    get locationId() { return this.props.locationId; }
    get dayOfWeek() { return this.props.dayOfWeek; }
    get openTime() { return this.props.openTime; }
    get closeTime() { return this.props.closeTime; }
    get active() { return this.props.active; }

    toJSON(): OperatingHoursProps { return { ...this.props }; }
}
