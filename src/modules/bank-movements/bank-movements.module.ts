import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '@modules/companies/domain/company.entity';
import { Transaction } from '@modules/transactions/domain/transaction.entity';
import { BankMovementsService } from './application/bank-movements.service';
import { BankMovementsController } from './presentation/bank-movements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Company])],
  controllers: [BankMovementsController],
  providers: [BankMovementsService],
  exports: [BankMovementsService],
})
export class BankMovementsModule {}
