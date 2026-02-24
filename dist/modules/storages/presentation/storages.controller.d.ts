import { StoragesService } from '../application/storages.service';
export declare class StoragesController {
    private readonly storagesService;
    constructor(storagesService: StoragesService);
    getStorages(includeInactive?: string): Promise<{
        id: string;
        name: string;
        code: string | null;
        category: import("../domain/storage.entity").StorageCategory;
        type: import("../domain/storage.entity").StorageType;
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
    }[]>;
    getStorageById(id: string): Promise<{
        id: string;
        name: string;
        code: string | null;
        category: import("../domain/storage.entity").StorageCategory;
        type: import("../domain/storage.entity").StorageType;
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
    } | {
        success: boolean;
        message: string;
        statusCode: number;
    }>;
    createStorage(data: {
        name: string;
        code?: string | null;
        category: string;
        type: string;
        branchId?: string | null;
        capacity?: number | null;
        location?: string | null;
        isDefault?: boolean;
        isActive?: boolean;
    }): Promise<{
        success: boolean;
        storage: {
            id: string;
            name: string;
            code: string | null;
            category: import("../domain/storage.entity").StorageCategory;
            type: import("../domain/storage.entity").StorageType;
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
        } | null;
    }>;
    updateStorage(id: string, data: Partial<{
        name: string;
        code: string | null;
        category: string;
        type: string;
        branchId: string | null;
        capacity: number | null;
        location: string | null;
        isDefault: boolean;
        isActive: boolean;
    }>): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
        storage?: undefined;
    } | {
        success: boolean;
        storage: {
            id: string;
            name: string;
            code: string | null;
            category: import("../domain/storage.entity").StorageCategory;
            type: import("../domain/storage.entity").StorageType;
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
        };
        message?: undefined;
        statusCode?: undefined;
    }>;
    deleteStorage(id: string): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    } | {
        success: boolean;
        message?: undefined;
        statusCode?: undefined;
    }>;
}
