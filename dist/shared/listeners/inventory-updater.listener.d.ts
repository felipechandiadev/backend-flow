import { DataSource } from 'typeorm';
import { TransactionCreatedEvent } from '../events/transaction-created.event';
export declare class InventoryUpdaterListener {
    private readonly dataSource;
    private logger;
    constructor(dataSource: DataSource);
    handleTransactionCreated(payload: TransactionCreatedEvent): Promise<void>;
}
