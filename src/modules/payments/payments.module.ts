import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './presentation/payments.controller';
import { PaymentsService } from './application/payments.service';
import { Transaction } from '@modules/transactions/domain/transaction.entity';
import { CashSession } from '@modules/cash-sessions/domain/cash-session.entity';
import { PointOfSale } from '@modules/points-of-sale/domain/point-of-sale.entity';
import { User } from '@modules/users/domain/user.entity';
import { Branch } from '@modules/branches/domain/branch.entity';
import { TransactionsModule } from '@modules/transactions/transactions.module';
import { LedgerEntriesModule } from '@modules/ledger-entries/ledger-entries.module';
import { InstallmentsModule } from '@modules/installments/installments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      CashSession,
      PointOfSale,
      User,
      Branch,
    ]),
    TransactionsModule,
    LedgerEntriesModule,
    InstallmentsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
