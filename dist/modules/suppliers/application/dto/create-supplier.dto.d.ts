import { SupplierType } from '../../domain/supplier.entity';
export declare class CreateSupplierDto {
    personId: string;
    supplierType?: SupplierType;
    alias?: string;
    defaultPaymentTermDays?: number;
    isActive?: boolean;
    notes?: string;
}
