import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerEntry } from '@modules/ledger-entries/domain/ledger-entry.entity';
import { LedgerEntriesService } from '@modules/ledger-entries/application/ledger-entries.service';
import { LedgerEntriesController } from '@modules/ledger-entries/presentation/ledger-entries.controller';
import { AccountingRule } from '@modules/accounting-rules/domain/accounting-rule.entity';
import { AccountingAccount } from '@modules/accounting-accounts/domain/accounting-account.entity';
import { Customer } from '@modules/customers/domain/customer.entity';
import { Supplier } from '@modules/suppliers/domain/supplier.entity';
import { Shareholder } from '@modules/shareholders/domain/shareholder.entity';
import { Employee } from '@modules/employees/domain/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LedgerEntry,
      AccountingRule,
      AccountingAccount,
      Customer,
      Supplier,
      Shareholder,
      Employee,
    ]),
  ],
  controllers: [LedgerEntriesController],
  providers: [LedgerEntriesService],
  exports: [LedgerEntriesService], // Exportar para que otros módulos lo inyecten
})
export class LedgerEntriesModule {}
