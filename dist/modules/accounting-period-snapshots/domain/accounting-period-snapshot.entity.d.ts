import "reflect-metadata";
import { AccountingPeriod } from '@modules/accounting-periods/domain/accounting-period.entity';
import { AccountingAccount } from '@modules/accounting-accounts/domain/accounting-account.entity';
export declare class AccountingPeriodSnapshot {
    id: string;
    periodId: string;
    accountId: string;
    closingBalance: number;
    debitSum: number;
    creditSum: number;
    metadata?: Record<string, any> | null;
    createdAt: Date;
    updatedAt: Date;
    period: AccountingPeriod;
    account: AccountingAccount;
}
