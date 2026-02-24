import { Repository } from 'typeorm';
import { Storage, StorageCategory, StorageType } from '../domain/storage.entity';
export declare class StoragesService {
    private readonly storageRepository;
    constructor(storageRepository: Repository<Storage>);
    getAllStorages(includeInactive: boolean): Promise<{
        id: string;
        name: string;
        code: string | null;
        category: StorageCategory;
        type: StorageType;
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
        category: StorageCategory;
        type: StorageType;
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
    } | null>;
    createStorage(data: {
        name: string;
        code?: string | null;
        category: StorageCategory | string;
        type: StorageType | string;
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
            category: StorageCategory;
            type: StorageType;
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
        category: StorageCategory | string;
        type: StorageType | string;
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
            category: StorageCategory;
            type: StorageType;
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
    private mapStorage;
}
