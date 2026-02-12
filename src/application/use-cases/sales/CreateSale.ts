import { SaleRepository } from '@/domain/ports/SaleRepository';
import { ProductRepository } from '@/domain/ports/ProductRepository';
import { PaymentMethod, SaleProps } from '@/domain/entities/Sale';

export interface CreateSaleInput {
    clientId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
    paymentMethod: PaymentMethod;
}

export class CreateSale {
    constructor(
        private readonly saleRepo: SaleRepository,
        private readonly productRepo: ProductRepository,
    ) { }

    async execute(input: CreateSaleInput): Promise<SaleProps> {
        if (input.items.length === 0) {
            throw new Error('Sale must have at least one item');
        }

        // Validate products and calculate total
        let totalAmount = 0;
        const validatedItems = [];

        for (const item of input.items) {
            const product = await this.productRepo.findById(item.productId);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }
            if (!product.active) {
                throw new Error(`Product ${product.name} is not active`);
            }

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            validatedItems.push({
                productId: product.id,
                quantity: item.quantity,
                unitPrice: product.price
            });
        }

        return this.saleRepo.create({
            clientId: input.clientId,
            items: validatedItems,
            totalAmount,
            paymentMethod: input.paymentMethod,
            status: 'completed' // Auto-complete for now
        });
    }
}
