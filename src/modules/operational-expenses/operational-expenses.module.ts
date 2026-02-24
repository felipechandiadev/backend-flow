import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationalExpense } from './domain/operational-expense.entity';
import { OperationalExpensesService } from './application/operational-expenses.service';
import { OperationalExpensesController } from './presentation/operational-expenses.controller';
import { OperationalExpensesRepository } from './infrastructure/operational-expenses.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OperationalExpense]),
  ],
  controllers: [OperationalExpensesController],
  providers: [
    OperationalExpensesService,
    OperationalExpensesRepository,
  ],
  exports: [OperationalExpensesService],
})
export class OperationalExpensesModule {}
