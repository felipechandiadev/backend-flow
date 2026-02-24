import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingEngineListener } from '@shared/listeners/accounting-engine.listener';
import { PayrollAccountsPayableListener } from '@shared/listeners/payroll-accounts-payable.listener';
import { CreateInstallmentsListener } from '@shared/listeners/create-installments.listener';
import { UpdateInstallmentFromPaymentListener } from '@shared/listeners/update-installment-from-payment.listener';
import { InventoryUpdaterListener } from '@shared/listeners/inventory-updater.listener';
import { LedgerEntriesModule } from '@modules/ledger-entries/ledger-entries.module';
import { InstallmentsModule } from '@modules/installments/installments.module';
import { Transaction } from '@modules/transactions/domain/transaction.entity';

/**
 * SHARED MODULES: Listeners y Eventos
 * 
 * Este módulo centraliza:
 * - Listeners (AccountingEngineListener, PayrollAccountsPayableListener, CreateInstallmentsListener, UpdateInstallmentFromPaymentListener)
 * - Eventos de dominio
 * 
 * Propósito: Proporcionar listeners como inyectables globales
 * para que cualquier módulo pueda emitir eventos y los listeners
 * reaccionen automáticamente.
 */
@Module({
  imports: [
    LedgerEntriesModule,
    InstallmentsModule,
    TypeOrmModule.forFeature([Transaction]),
  ],
  providers: [
    AccountingEngineListener,
    PayrollAccountsPayableListener,
    CreateInstallmentsListener,
    UpdateInstallmentFromPaymentListener,
    InventoryUpdaterListener,
  ],
  exports: [
    AccountingEngineListener,
    PayrollAccountsPayableListener,
    CreateInstallmentsListener,
    UpdateInstallmentFromPaymentListener,
    InventoryUpdaterListener,
  ],
})
export class EventsModule {}
