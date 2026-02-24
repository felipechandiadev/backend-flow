import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingPeriod } from './domain/accounting-period.entity';
import { Company } from '@modules/companies/domain/company.entity';
import { AccountingPeriodsService } from './application/accounting-periods.service';
import { AccountingPeriodsController } from './presentation/accounting-periods.controller';
import { AccountBalancesModule } from '@modules/account-balances/account-balances.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountingPeriod, Company]),
    AccountBalancesModule,
  ],
  controllers: [AccountingPeriodsController],
  providers: [AccountingPeriodsService],
  exports: [AccountingPeriodsService],
})
export class AccountingPeriodsModule {}
