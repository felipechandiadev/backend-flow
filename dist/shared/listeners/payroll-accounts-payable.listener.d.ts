import { Repository, DataSource } from 'typeorm';
import { TransactionCreatedEvent } from '@shared/events/transaction-created.event';
import { Transaction } from '@modules/transactions/domain/transaction.entity';
export declare class PayrollAccountsPayableListener {
    private readonly transactionRepo;
    private readonly dataSource;
    private logger;
    constructor(transactionRepo: Repository<Transaction>, dataSource: DataSource);
    handlePayrollCreated(event: TransactionCreatedEvent): Promise<void>;
    private generateDocumentNumber;
    private getTypePrefix;
    private getDeductionDescription;
    private getPaymentDueDate;
}
