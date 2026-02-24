import { DataSource, EntityManager } from 'typeorm';
import { AccountingAccount, AccountType } from '@modules/accounting-accounts/domain/accounting-account.entity';
import { RuleScope } from '@modules/accounting-rules/domain/accounting-rule.entity';
import { Transaction } from '@modules/transactions/domain/transaction.entity';
export interface LedgerPosting {
    id: string;
    transactionId: string;
    ruleId: string | null;
    scope: RuleScope;
    accountId: string;
    accountCode: string;
    accountName: string;
    date: string;
    reference: string;
    description: string;
    debit: number;
    credit: number;
}
export interface LedgerComputationResult {
    accounts: AccountingAccount[];
    postings: LedgerPosting[];
    balanceByAccount: Record<string, number>;
}
interface BuildLedgerParams {
    companyId: string;
    from?: Date;
    to?: Date;
    resultCenterId?: string;
    limitTransactions?: number;
}
export declare function buildLedger(dataSource: DataSource, params: BuildLedgerParams): Promise<LedgerComputationResult>;
export declare function normalizeBalanceForPresentation(type: AccountType, balance: number): number;
export declare function recordPayment(manager: EntityManager, transaction: Transaction, bankAccountId?: string | null): Promise<void>;
export declare function postTransactionToLedger(manager: EntityManager, transactionId: string): Promise<{
    success: boolean;
    error?: string;
}>;
declare const _default: {
    buildLedger: typeof buildLedger;
    normalizeBalanceForPresentation: typeof normalizeBalanceForPresentation;
    recordPayment: typeof recordPayment;
    postTransactionToLedger: typeof postTransactionToLedger;
};
export default _default;
