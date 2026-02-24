import { InventoryService } from '../application/inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getFilters(): Promise<{
        storages: {
            id: string;
            name: string;
            code: string | null;
            category: import("../../storages/domain/storage.entity").StorageCategory;
            type: import("../../storages/domain/storage.entity").StorageType;
            branchId: string | null;
            branch: {
                id: string;
                name: string;
            } | null;
            location: string | null;
            capacity: number | null;
            isDefault: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        branches: never[];
        categories: never[];
        units: never[];
        attributes: never[];
    }>;
    getInventory(params: {
        search?: string;
        branchId?: string;
        storageId?: string;
    }): Promise<{
        rows: any[];
        total: number;
    }>;
    adjust(data: any): Promise<{
        success: boolean;
        message: string;
        documentNumbers: string[];
    }>;
    transfer(data: any): Promise<{
        success: boolean;
        message: string;
        documentNumbers: string[];
    }>;
}
