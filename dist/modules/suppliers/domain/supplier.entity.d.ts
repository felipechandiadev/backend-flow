import "reflect-metadata";
import { Person } from '@modules/persons/domain/person.entity';
export declare enum SupplierType {
    MANUFACTURER = "MANUFACTURER",
    DISTRIBUTOR = "DISTRIBUTOR",
    WHOLESALER = "WHOLESALER",
    LOCAL = "LOCAL"
}
export declare class Supplier {
    id: string;
    personId: string;
    supplierType: SupplierType;
    alias?: string;
    defaultPaymentTermDays: number;
    isActive: boolean;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    person?: Person;
}
