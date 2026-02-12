export interface LocationProps {
    id: string;
    name: string;
    address: string;
    city: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Location {
    private constructor(private readonly props: LocationProps) { }

    static create(props: LocationProps): Location {
        if (!props.name.trim()) throw new Error('Location name is required');
        if (!props.city.trim()) throw new Error('Location city is required');
        return new Location({ ...props });
    }

    get id() { return this.props.id; }
    get name() { return this.props.name; }
    get address() { return this.props.address; }
    get city() { return this.props.city; }
    get active() { return this.props.active; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }

    toJSON(): LocationProps { return { ...this.props }; }
}
