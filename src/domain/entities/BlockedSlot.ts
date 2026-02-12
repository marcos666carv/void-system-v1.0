export interface BlockedSlotProps {
    id: string;
    locationId: string;
    tankId?: string;
    startTime: Date;
    endTime: Date;
    reason: string;
    recurring: boolean;
    createdAt: Date;
}

export class BlockedSlot {
    private constructor(private readonly props: BlockedSlotProps) { }

    static create(props: BlockedSlotProps): BlockedSlot {
        if (props.endTime <= props.startTime) throw new Error('End time must be after start time');
        if (!props.reason.trim()) throw new Error('Reason is required');
        return new BlockedSlot({ ...props });
    }

    get id() { return this.props.id; }
    get locationId() { return this.props.locationId; }
    get tankId() { return this.props.tankId; }
    get startTime() { return this.props.startTime; }
    get endTime() { return this.props.endTime; }
    get reason() { return this.props.reason; }
    get recurring() { return this.props.recurring; }
    get createdAt() { return this.props.createdAt; }

    toJSON(): BlockedSlotProps { return { ...this.props }; }
}
