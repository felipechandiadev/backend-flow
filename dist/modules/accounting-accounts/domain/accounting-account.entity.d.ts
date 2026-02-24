import "reflect-metadata";
import { Company } from '@modules/companies/domain/company.entity';
export declare enum AccountType {
    ASSET = "ASSET",
    LIABILITY = "LIABILITY",
    EQUITY = "EQUITY",
    INCOME = "INCOME",
    EXPENSE = "EXPENSE"
}
export declare class AccountingAccount {
    id: string;
    companyId: string;
    code: string;
    name: string;
    type: AccountType;
    parentId?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
    parent?: AccountingAccount | null;
}
