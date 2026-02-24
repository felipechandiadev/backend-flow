import { SuppliersService } from '../application/suppliers.service';
import { CreateSupplierDto } from '../application/dto/create-supplier.dto';
import { UpdateSupplierDto } from '../application/dto/update-supplier.dto';
export declare class SuppliersController {
    private readonly service;
    constructor(service: SuppliersService);
    findAll(query: any): Promise<{
        data: import("../domain/supplier.entity").Supplier[];
        total: number;
    }>;
    findOne(id: string): Promise<import("../domain/supplier.entity").Supplier>;
    create(dto: CreateSupplierDto): Promise<import("../domain/supplier.entity").Supplier>;
    update(id: string, dto: UpdateSupplierDto): Promise<import("../domain/supplier.entity").Supplier>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
