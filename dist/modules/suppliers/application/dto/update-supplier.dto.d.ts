import { CreateSupplierDto } from './create-supplier.dto';
import { SupplierType } from '../../domain/supplier.entity';
export declare class UpdateSupplierDto implements Partial<CreateSupplierDto> {
    personId?: string;
    supplierType?: SupplierType;
    alias?: string;
    defaultPaymentTermDays?: number;
    isActive?: boolean;
    notes?: string;
}
