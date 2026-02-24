import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountBalance } from './domain/account-balance.entity';
import { AccountBalanceService } from './application/account-balance.service';
import { LedgerEntry } from '@modules/ledger-entries/domain/ledger-entry.entity';
import { AccountingPeriod } from '@modules/accounting-periods/domain/accounting-period.entity';

/**
 * PHASE 2: Account Balances Module
 * 
 * Provides high-performance balance management through pre-calculated aggregations.
 * Critical for scalability when transaction volumes exceed 100K records.
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([AccountBalance, LedgerEntry, AccountingPeriod]),
    ],
    providers: [AccountBalanceService],
    exports: [AccountBalanceService],
})
export class AccountBalancesModule {}
