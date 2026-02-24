import { AccountingPeriodsService } from '../application/accounting-periods.service';
import { AccountingPeriodStatus } from '../domain/accounting-period.entity';
export declare class AccountingPeriodsController {
    private readonly accountingPeriodsService;
    constructor(accountingPeriodsService: AccountingPeriodsService);
    findAll(companyId?: string, status?: AccountingPeriodStatus, year?: string): Promise<{
        success: boolean;
        data: import("../domain/accounting-period.entity").AccountingPeriod[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("../domain/accounting-period.entity").AccountingPeriod;
    }>;
    create(data: {
        companyId?: string;
        startDate: string;
        endDate: string;
        name?: string;
        status?: AccountingPeriodStatus;
    }): Promise<{
        success: boolean;
        data: import("../domain/accounting-period.entity").AccountingPeriod;
    }>;
    ensurePeriod(data: {
        date: string;
        companyId?: string;
    }): Promise<{
        success: boolean;
        data: import("../domain/accounting-period.entity").AccountingPeriod;
    }>;
    closePeriod(id: string, data?: {
        userId?: string;
    }): Promise<{
        success: boolean;
        data: import("../domain/accounting-period.entity").AccountingPeriod;
    }>;
    reopenPeriod(id: string): Promise<{
        success: boolean;
        data: import("../domain/accounting-period.entity").AccountingPeriod;
    }>;
}
