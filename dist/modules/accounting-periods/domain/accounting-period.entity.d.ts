import "reflect-metadata";
import { Company } from '@modules/companies/domain/company.entity';
import { User } from '@modules/users/domain/user.entity';
export declare enum AccountingPeriodStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    LOCKED = "LOCKED"
}
export declare class AccountingPeriod {
    id: string;
    companyId: string;
    startDate: string;
    endDate: string;
    name?: string | null;
    status: AccountingPeriodStatus;
    closedAt?: Date | null;
    closedBy?: string | null;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
    closedByUser?: User | null;
}
