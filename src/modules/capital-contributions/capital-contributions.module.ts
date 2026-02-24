import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '@modules/transactions/domain/transaction.entity';
import { User } from '@modules/users/domain/user.entity';
import { Branch } from '@modules/branches/domain/branch.entity';
import { TransactionsModule } from '@modules/transactions/transactions.module';
import { CapitalContributionsService } from './application/capital-contributions.service';
import { CapitalContributionsController } from './presentation/capital-contributions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Branch]),
    TransactionsModule,
  ],
  controllers: [CapitalContributionsController],
  providers: [CapitalContributionsService],
  exports: [CapitalContributionsService],
})
export class CapitalContributionsModule {}
