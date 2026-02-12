import { ProductRepository } from '@/domain/ports/ProductRepository';
import { PaginationParams } from '@/domain/shared/pagination';

export class ListProducts {
    constructor(private readonly productRepo: ProductRepository) { }

    async execute(pagination: PaginationParams) {
        return this.productRepo.findMany({ active: true }, pagination);
    }
}
