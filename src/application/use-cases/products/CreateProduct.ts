import { ProductRepository } from '@/domain/ports/ProductRepository';
import { ProductProps } from '@/domain/entities/Product';

export class CreateProduct {
    constructor(private readonly productRepo: ProductRepository) { }

    async execute(data: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductProps> {
        return this.productRepo.create(data);
    }
}
