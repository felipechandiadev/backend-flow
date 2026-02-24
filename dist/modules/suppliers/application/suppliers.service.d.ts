import { SuppliersRepository } from '../infrastructure/suppliers.repository';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from '../domain/supplier.entity';
export declare class SuppliersService {
    private readonly repository;
    private readonly logger;
    constructor(repository: SuppliersRepository);
    findAll(params?: {
        limit?: number;
        offset?: number;
        isActive?: boolean;
        supplierType?: string;
    }): Promise<{
        data: Supplier[];
        total: number;
    }>;
    findOne(id: string): Promise<Supplier>;
    create(dto: CreateSupplierDto): Promise<Supplier>;
    update(id: string, dto: UpdateSupplierDto): Promise<Supplier>;
    remove(id: string): Promise<void>;
}
