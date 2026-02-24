import "reflect-metadata";
import { Transaction } from '../../transactions/domain/transaction.entity';
import { AccountingAccount } from '../../accounting-accounts/domain/accounting-account.entity';
import { Person } from '../../persons/domain/person.entity';
export declare class LedgerEntry {
    id: string;
    transactionId: string;
    accountId: string;
    personId?: string | null;
    entryDate: Date;
    description: string;
    debit: number;
    credit: number;
    metadata?: Record<string, any> | null;
    createdAt: Date;
    transaction: Transaction;
    account: AccountingAccount;
    person?: Person | null;
}
