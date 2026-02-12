import { ProductRepository } from '@/domain/ports/ProductRepository';
import { ProductProps } from '@/domain/entities/Product';

export class UpdateProduct {
    constructor(private readonly productRepo: ProductRepository) { }

    async execute(id: string, data: Partial<ProductProps>): Promise<ProductProps | null> {
        return this.productRepo.update(id, data);
    }
}
