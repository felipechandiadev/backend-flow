import { Repository } from 'typeorm';
import { AccountingPeriod, AccountingPeriodStatus } from '../domain/accounting-period.entity';
import { Company } from '@modules/companies/domain/company.entity';
import { AccountBalanceService } from '@modules/account-balances/application/account-balance.service';
export declare class AccountingPeriodsService {
    private readonly accountingPeriodRepository;
    private readonly companyRepository;
    private readonly accountBalanceService;
    constructor(accountingPeriodRepository: Repository<AccountingPeriod>, companyRepository: Repository<Company>, accountBalanceService: AccountBalanceService);
    findAll(params?: {
        companyId?: string;
        status?: AccountingPeriodStatus;
        year?: number;
    }): Promise<AccountingPeriod[]>;
    findOne(id: string): Promise<AccountingPeriod | null>;
    create(data: {
        companyId?: string;
        startDate: string;
        endDate: string;
        name?: string;
        status?: AccountingPeriodStatus;
    }): Promise<AccountingPeriod>;
    ensurePeriod(date: string, companyId?: string): Promise<AccountingPeriod>;
    closePeriod(id: string, userId?: string): Promise<AccountingPeriod>;
    reopenPeriod(id: string): Promise<AccountingPeriod>;
}
