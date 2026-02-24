import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreasuryAccountsController } from './presentation/treasury-accounts.controller';
import { TreasuryAccountsService } from './application/treasury-accounts.service';
import { TreasuryAccount } from '@modules/treasury-accounts/domain/treasury-account.entity';
import { Company } from '@modules/companies/domain/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TreasuryAccount, Company])],
  controllers: [TreasuryAccountsController],
  providers: [TreasuryAccountsService],
  exports: [TreasuryAccountsService],
})
export class TreasuryAccountsModule {}
