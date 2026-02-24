import "reflect-metadata";
import { Company } from '@modules/companies/domain/company.entity';
import { AccountingAccount } from '@modules/accounting-accounts/domain/accounting-account.entity';
import { AccountingPeriod } from '@modules/accounting-periods/domain/accounting-period.entity';
export declare class AccountBalance {
    id: string;
    companyId: string;
    accountId: string;
    periodId: string;
    openingDebit: number;
    openingCredit: number;
    periodDebit: number;
    periodCredit: number;
    closingDebit: number;
    closingCredit: number;
    frozen: boolean;
    frozenAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
    account: AccountingAccount;
    period: AccountingPeriod;
    get netBalance(): number;
    get periodMovement(): number;
}
