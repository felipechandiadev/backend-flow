import "reflect-metadata";
import { ProductVariant } from '../../product-variants/domain/product-variant.entity';
import { Storage } from '../../storages/domain/storage.entity';
import { Transaction } from '../../transactions/domain/transaction.entity';
export declare class StockLevel {
    id: string;
    productVariantId: string;
    storageId: string;
    physicalStock: number;
    committedStock: number;
    availableStock: number;
    incomingStock: number;
    lastTransactionId?: string | null;
    lastUpdated: Date;
    updatedAt: Date;
    variant: ProductVariant;
    storage: Storage;
    lastTransaction?: Transaction | null;
}
