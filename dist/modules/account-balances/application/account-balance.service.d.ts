import { Repository, DataSource } from 'typeorm';
import { AccountBalance } from '../domain/account-balance.entity';
import { LedgerEntry } from '@modules/ledger-entries/domain/ledger-entry.entity';
import { AccountingPeriod } from '@modules/accounting-periods/domain/accounting-period.entity';
export declare class AccountBalanceService {
    private readonly balanceRepository;
    private readonly ledgerRepository;
    private readonly periodRepository;
    private readonly dataSource;
    private readonly logger;
    constructor(balanceRepository: Repository<AccountBalance>, ledgerRepository: Repository<LedgerEntry>, periodRepository: Repository<AccountingPeriod>, dataSource: DataSource);
    updateBalancesForLedgerEntries(ledgerEntries: LedgerEntry[]): Promise<void>;
    freezeBalancesForPeriod(periodId: string): Promise<void>;
    private carryForwardBalances;
    getBalancesForPeriod(companyId: string, periodId: string): Promise<AccountBalance[]>;
    recalculateBalancesForPeriod(periodId: string): Promise<void>;
}
