import "reflect-metadata";
import { Branch } from '@modules/branches/domain/branch.entity';
export declare enum StorageType {
    WAREHOUSE = "WAREHOUSE",
    STORE = "STORE",
    COLD_ROOM = "COLD_ROOM",
    TRANSIT = "TRANSIT"
}
export declare enum StorageCategory {
    IN_BRANCH = "IN_BRANCH",
    CENTRAL = "CENTRAL",
    EXTERNAL = "EXTERNAL"
}
export declare class Storage {
    id: string;
    branchId?: string | null;
    name: string;
    code?: string;
    type: StorageType;
    category: StorageCategory;
    capacity?: number;
    location?: string;
    isDefault: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    branch?: Branch;
}
