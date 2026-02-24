import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '@modules/transactions/domain/transaction.entity';
import { User } from '@modules/users/domain/user.entity';
import { Branch } from '@modules/branches/domain/branch.entity';
import { TransactionsModule } from '@modules/transactions/transactions.module';
import { BankWithdrawalsService } from './application/bank-withdrawals.service';
import { BankWithdrawalsController } from './presentation/bank-withdrawals.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Branch]),
    TransactionsModule,
  ],
  controllers: [BankWithdrawalsController],
  providers: [BankWithdrawalsService],
  exports: [BankWithdrawalsService],
})
export class BankWithdrawalsModule {}
