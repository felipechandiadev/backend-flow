"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const accounting_engine_listener_1 = require("../listeners/accounting-engine.listener");
const payroll_accounts_payable_listener_1 = require("../listeners/payroll-accounts-payable.listener");
const create_installments_listener_1 = require("../listeners/create-installments.listener");
const update_installment_from_payment_listener_1 = require("../listeners/update-installment-from-payment.listener");
const inventory_updater_listener_1 = require("../listeners/inventory-updater.listener");
const ledger_entries_module_1 = require("../../modules/ledger-entries/ledger-entries.module");
const installments_module_1 = require("../../modules/installments/installments.module");
const transaction_entity_1 = require("../../modules/transactions/domain/transaction.entity");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ledger_entries_module_1.LedgerEntriesModule,
            installments_module_1.InstallmentsModule,
            typeorm_1.TypeOrmModule.forFeature([transaction_entity_1.Transaction]),
        ],
        providers: [
            accounting_engine_listener_1.AccountingEngineListener,
            payroll_accounts_payable_listener_1.PayrollAccountsPayableListener,
            create_installments_listener_1.CreateInstallmentsListener,
            update_installment_from_payment_listener_1.UpdateInstallmentFromPaymentListener,
            inventory_updater_listener_1.InventoryUpdaterListener,
        ],
        exports: [
            accounting_engine_listener_1.AccountingEngineListener,
            payroll_accounts_payable_listener_1.PayrollAccountsPayableListener,
            create_installments_listener_1.CreateInstallmentsListener,
            update_installment_from_payment_listener_1.UpdateInstallmentFromPaymentListener,
            inventory_updater_listener_1.InventoryUpdaterListener,
        ],
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map