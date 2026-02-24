import { Repository, DataSource } from 'typeorm';
import { StockLevel } from '@modules/stock-levels/domain/stock-level.entity';
import { Product } from '@modules/products/domain/product.entity';
import { ProductVariant } from '@modules/product-variants/domain/product-variant.entity';
import { Storage } from '@modules/storages/domain/storage.entity';
export declare class SessionInventoryService {
    private readonly stockLevelRepository;
    private readonly productRepository;
    private readonly productVariantRepository;
    private readonly storageRepository;
    private readonly dataSource;
    constructor(stockLevelRepository: Repository<StockLevel>, productRepository: Repository<Product>, productVariantRepository: Repository<ProductVariant>, storageRepository: Repository<Storage>, dataSource: DataSource);
    reserveStock(sessionId: string, productVariantId: string, qty: number, storageId: string): Promise<any>;
    releaseStock(allocationId: string): Promise<void>;
    commitStock(sessionId: string): Promise<{
        committed: number;
        failed: number;
    }>;
    rollbackStock(sessionId: string): Promise<{
        rolledBack: number;
    }>;
    getAllocations(sessionId: string): Promise<{
        allocations: never[];
    }>;
    getStockSummary(sessionId: string): Promise<{
        summary: never[];
    }>;
}
