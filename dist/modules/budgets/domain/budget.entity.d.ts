import "reflect-metadata";
import { Company } from '@modules/companies/domain/company.entity';
import { ResultCenter } from '@modules/result-centers/domain/result-center.entity';
import { User } from '@modules/users/domain/user.entity';
export declare enum BudgetCurrency {
    CLP = "CLP"
}
export declare enum BudgetStatus {
    ACTIVE = "ACTIVE",
    SUPERSEDED = "SUPERSEDED",
    CANCELLED = "CANCELLED"
}
export declare class Budget {
    id: string;
    companyId: string;
    resultCenterId: string;
    periodStart: string;
    periodEnd: string;
    budgetedAmount: string;
    spentAmount: string;
    currency: BudgetCurrency;
    status: BudgetStatus;
    version: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
    resultCenter: ResultCenter;
    createdByUser: User;
}
