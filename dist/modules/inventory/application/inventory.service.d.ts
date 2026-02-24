import { Repository, DataSource } from 'typeorm';
import { StoragesService } from '../../storages/application/storages.service';
import { TransactionsService } from '@modules/transactions/application/transactions.service';
import { User } from '@modules/users/domain/user.entity';
export declare class InventoryService {
    private readonly storagesService;
    private readonly dataSource;
    private readonly transactionsService;
    private readonly userRepository;
    constructor(storagesService: StoragesService, dataSource: DataSource, transactionsService: TransactionsService, userRepository: Repository<User>);
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
    search(params?: {
        search?: string;
        branchId?: string;
        storageId?: string;
    }): Promise<{
        rows: any[];
        total: number;
    }>;
    adjust(data: {
        variantId: string;
        storageId: string;
        currentQuantity: number;
        targetQuantity: number;
        note?: string;
    }): Promise<{
        success: boolean;
        message: string;
        documentNumbers: string[];
    }>;
    transfer(data: {
        variantId: string;
        sourceStorageId: string;
        targetStorageId: string;
        quantity: number;
        note?: string;
    }): Promise<{
        success: boolean;
        message: string;
        documentNumbers: string[];
    }>;
}
