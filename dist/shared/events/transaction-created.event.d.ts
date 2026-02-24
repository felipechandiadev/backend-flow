import { Transaction } from '../../modules/transactions/domain/transaction.entity';
export declare class TransactionCreatedEvent {
    readonly transaction: Transaction;
    readonly companyId: string;
    constructor(transaction: Transaction, companyId: string);
}
