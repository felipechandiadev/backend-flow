import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './presentation/transactions.controller';
import { SupplierPaymentsController } from './presentation/supplier-payments.controller';
import { OperatingExpenseTransactionsController } from './presentation/operating-expense-transactions.controller';
import { TransactionsService } from './application/transactions.service';
import { Transaction } from '@modules/transactions/domain/transaction.entity';
import { Branch } from '@modules/branches/domain/branch.entity';
import { LedgerEntriesModule } from '@modules/ledger-entries/ledger-entries.module';
import { AccountingPeriodsModule } from '@modules/accounting-periods/accounting-periods.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Branch]),
    LedgerEntriesModule,
    AccountingPeriodsModule,
  ],
  controllers: [TransactionsController, SupplierPaymentsController, OperatingExpenseTransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
