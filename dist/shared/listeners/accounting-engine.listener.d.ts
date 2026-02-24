import { DataSource } from 'typeorm';
import { TransactionCreatedEvent } from '@shared/events/transaction-created.event';
import { LedgerEntriesService } from '@modules/ledger-entries/application/ledger-entries.service';
export declare class AccountingEngineListener {
    private readonly ledgerService;
    private readonly dataSource;
    private logger;
    constructor(ledgerService: LedgerEntriesService, dataSource: DataSource);
    handleTransactionCreated(event: TransactionCreatedEvent): Promise<void>;
}
