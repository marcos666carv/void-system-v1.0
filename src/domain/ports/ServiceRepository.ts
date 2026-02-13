import { ServiceProps } from '../entities/Service';

export interface ServiceRepository {
    findById(id: string): Promise<ServiceProps | null>;
    findAll(activeOnly?: boolean): Promise<ServiceProps[]>;
    create(data: Omit<ServiceProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceProps>;
    update(id: string, data: Partial<ServiceProps>): Promise<ServiceProps | null>;
    delete(id: string): Promise<boolean>;
}
