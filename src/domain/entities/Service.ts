export interface ServiceProps {
    id: string;
    name: string;
    description?: string;
    duration: number; // minutes
    price: number; // cents
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Service {
    private constructor(private readonly props: ServiceProps) { }

    static create(props: ServiceProps): Service {
        if (!props.name.trim()) throw new Error('Service name is required');
        if (props.duration <= 0) throw new Error('Duration must be positive');
        if (props.price < 0) throw new Error('Price cannot be negative');

        return new Service({ ...props });
    }

    get id() { return this.props.id; }
    get name() { return this.props.name; }
    get description() { return this.props.description; }
    get duration() { return this.props.duration; }
    get price() { return this.props.price; }
    get active() { return this.props.active; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }

    get formattedPrice(): string {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.props.price / 100);
    }

    toJSON(): ServiceProps {
        return { ...this.props };
    }
}
