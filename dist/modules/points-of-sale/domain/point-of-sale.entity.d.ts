import "reflect-metadata";
import { Branch } from '../../branches/domain/branch.entity';
export declare class PointOfSale {
    id: string;
    branchId?: string;
    priceLists?: Array<{
        id: string;
        name: string;
        isActive: boolean;
    }>;
    defaultPriceListId?: string;
    name: string;
    deviceId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    branch?: Branch;
}
