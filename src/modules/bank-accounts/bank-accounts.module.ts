import { Module } from '@nestjs/common';
import { BankAccountsService } from './application/bank-accounts.service';
import { BankAccountsController } from './presentation/bank-accounts.controller';

@Module({
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
  exports: [BankAccountsService],
})
export class BankAccountsModule {}
