import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '@modules/transactions/domain/transaction.entity';
import { User } from '@modules/users/domain/user.entity';
import { Branch } from '@modules/branches/domain/branch.entity';
import { TransactionsModule } from '@modules/transactions/transactions.module';
import { CashDepositsService } from './application/cash-deposits.service';
import { CashDepositsController } from './presentation/cash-deposits.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Branch]),
    TransactionsModule,
  ],
  controllers: [CashDepositsController],
  providers: [CashDepositsService],
  exports: [CashDepositsService],
})
export class CashDepositsModule {}
