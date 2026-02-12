export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash';
export type SaleStatus = 'pending' | 'completed' | 'refunded';

export interface SaleItemProps {
    productId: string;
    quantity: number;
    unitPrice: number;
}

export interface SaleProps {
    id: string;
    clientId: string;
    items: SaleItemProps[];
    totalAmount: number;
    paymentMethod: PaymentMethod;
    status: SaleStatus;
    createdAt: Date;
}

export class Sale {
    private constructor(private readonly props: SaleProps) { }

    static create(props: SaleProps): Sale {
        if (props.items.length === 0) {
            throw new Error('Sale must have at least one item');
        }
        if (props.totalAmount < 0) {
            throw new Error('Sale total cannot be negative');
        }
        return new Sale({ ...props });
    }

    get id() { return this.props.id; }
    get clientId() { return this.props.clientId; }
    get items() { return [...this.props.items]; }
    get totalAmount() { return this.props.totalAmount; }
    get paymentMethod() { return this.props.paymentMethod; }
    get status() { return this.props.status; }
    get createdAt() { return this.props.createdAt; }

    get itemCount(): number {
        return this.props.items.reduce((sum, i) => sum + i.quantity, 0);
    }

    get isRefundable(): boolean {
        return this.props.status === 'completed';
    }

    get formattedTotal(): string {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.props.totalAmount);
    }

    toJSON(): SaleProps {
        return { ...this.props, items: [...this.props.items] };
    }
}
