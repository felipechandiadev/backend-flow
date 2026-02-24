import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingRule } from '@modules/accounting-rules/domain/accounting-rule.entity';
import { AccountingRulesService } from '@modules/accounting-rules/application/accounting-rules.service';
import { AccountingRulesController } from '@modules/accounting-rules/presentation/accounting-rules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccountingRule])],
  controllers: [AccountingRulesController],
  providers: [AccountingRulesService],
  exports: [AccountingRulesService],
})
export class AccountingRulesModule {}
