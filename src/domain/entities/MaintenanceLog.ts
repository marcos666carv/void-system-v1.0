export type MaintenanceType = 'equipment_change' | 'repair' | 'inspection' | 'cleaning';

export interface MaintenanceLogProps {
    id: string;
    tankId: string;
    type: MaintenanceType;
    description: string;
    performedBy: string;
    performedAt: Date;
    createdAt: Date;
}

export class MaintenanceLog {
    private constructor(private readonly props: MaintenanceLogProps) { }

    static create(props: MaintenanceLogProps): MaintenanceLog {
        if (!props.description.trim()) throw new Error('Maintenance description is required');
        if (!props.performedBy.trim()) throw new Error('Performed by is required');
        return new MaintenanceLog({ ...props });
    }

    get id() { return this.props.id; }
    get tankId() { return this.props.tankId; }
    get type() { return this.props.type; }
    get description() { return this.props.description; }
    get performedBy() { return this.props.performedBy; }
    get performedAt() { return this.props.performedAt; }
    get createdAt() { return this.props.createdAt; }

    toJSON(): MaintenanceLogProps { return { ...this.props }; }
}
