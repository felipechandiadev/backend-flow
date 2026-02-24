import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '@modules/transactions/domain/transaction.entity';
import { User } from '@modules/users/domain/user.entity';
import { Branch } from '@modules/branches/domain/branch.entity';
import { TransactionsModule } from '@modules/transactions/transactions.module';
import { BankTransfersService } from './application/bank-transfers.service';
import { BankTransfersController } from './presentation/bank-transfers.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Branch]),
    TransactionsModule,
  ],
  controllers: [BankTransfersController],
  providers: [BankTransfersService],
  exports: [BankTransfersService],
})
export class BankTransfersModule {}
