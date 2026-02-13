export type ProductCategory = 'therapy' | 'merchandise' | 'gift_card' | 'floatation' | 'massage' | 'combo' | 'void_club';
export type PromoType = 'manual' | 'scheduled' | 'club_exclusive';
export interface Variation {
    id: string;
    name: string; // "3 Sessões", "Individual"
    description?: string;
    price: number;
    promoPrice?: number;
    sessions?: number; // for credit logic
}

export interface ProductProps {
    id: string;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    promoPrice?: number;
    promoStartDate?: Date;
    promoEndDate?: Date;
    promoLabel?: string;
    promoType?: PromoType;
    category: ProductCategory;
    durationMinutes?: number;
    locationId?: string;
    creditType?: 'float' | 'massage';
    creditAmount?: number;
    variations?: Variation[];
    stock: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Product {
    private constructor(private readonly props: ProductProps) { }

    static create(props: ProductProps): Product {
        if (props.price < 0) {
            throw new Error('Product price cannot be negative');
        }
        if (props.category === 'therapy' && !props.durationMinutes) {
            throw new Error('Therapy products must have a duration');
        }
        return new Product({ ...props });
    }

    get id() { return this.props.id; }
    get name() { return this.props.name; }
    get description() { return this.props.description; }
    get price() { return this.props.price; }
    get originalPrice() { return this.props.originalPrice; }
    get promoPrice() { return this.props.promoPrice; }
    get promoStartDate() { return this.props.promoStartDate; }
    get promoEndDate() { return this.props.promoEndDate; }
    get promoLabel() { return this.props.promoLabel; }
    get promoType() { return this.props.promoType; }
    get category() { return this.props.category; }
    get durationMinutes() { return this.props.durationMinutes; }
    get locationId() { return this.props.locationId; }
    get creditType() { return this.props.creditType; }
    get creditAmount() { return this.props.creditAmount; }
    get variations() { return this.props.variations || []; }
    get active() { return this.props.active; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }

    get isTherapy(): boolean {
        return this.props.category === 'therapy';
    }

    get hasActivePromo(): boolean {
        if (!this.props.promoPrice) return false;
        if (this.props.promoType === 'manual') return true;
        if (this.props.promoType === 'scheduled') {
            const now = new Date();
            const started = !this.props.promoStartDate || this.props.promoStartDate <= now;
            const notEnded = !this.props.promoEndDate || this.props.promoEndDate >= now;
            return started && notEnded;
        }
        return false;
    }

    get effectivePrice(): number {
        return this.hasActivePromo && this.props.promoPrice ? this.props.promoPrice : this.props.price;
    }

    get formattedPrice(): string {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.effectivePrice);
    }

    toJSON(): ProductProps {
        return { ...this.props };
    }
}

