import { SaleRepository } from '@/domain/ports/SaleRepository';
import { PaginationParams } from '@/domain/shared/pagination';

export class ListSalesWithDetails {
    constructor(private readonly saleRepo: SaleRepository) { }

    async execute(pagination: PaginationParams) {
        return this.saleRepo.findManyWithDetails({}, pagination);
    }
}
