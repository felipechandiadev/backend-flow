import { Module } from '@nestjs/common';
import { AccountingController } from './presentation/accounting.controller';
import { AccountingService } from './application/accounting.service';

@Module({
  controllers: [AccountingController],
  providers: [AccountingService],
  exports: [AccountingService],
})
export class AccountingModule {}
