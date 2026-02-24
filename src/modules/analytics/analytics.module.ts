import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './application/analytics.service';
import { AnalyticsController } from './presentation/analytics.controller';
import { Customer } from '@modules/customers/domain/customer.entity';
import { Transaction } from '@modules/transactions/domain/transaction.entity';
import { StockLevel } from '@modules/stock-levels/domain/stock-level.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Transaction, StockLevel]),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
