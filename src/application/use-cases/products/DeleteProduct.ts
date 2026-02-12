import { ProductRepository } from '@/domain/ports/ProductRepository';

export class DeleteProduct {
    constructor(private readonly productRepo: ProductRepository) { }

    async execute(id: string): Promise<boolean> {
        const product = await this.productRepo.findById(id);
        if (!product) return false;
        // Soft delete by setting active = false
        await this.productRepo.update(id, { active: false });
        return true;
    }
}
