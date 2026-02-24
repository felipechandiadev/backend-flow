"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const transactions_controller_1 = require("./presentation/transactions.controller");
const supplier_payments_controller_1 = require("./presentation/supplier-payments.controller");
const operating_expense_transactions_controller_1 = require("./presentation/operating-expense-transactions.controller");
const transactions_service_1 = require("./application/transactions.service");
const transaction_entity_1 = require("./domain/transaction.entity");
const branch_entity_1 = require("../branches/domain/branch.entity");
const ledger_entries_module_1 = require("../ledger-entries/ledger-entries.module");
const accounting_periods_module_1 = require("../accounting-periods/accounting-periods.module");
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([transaction_entity_1.Transaction, branch_entity_1.Branch]),
            ledger_entries_module_1.LedgerEntriesModule,
            accounting_periods_module_1.AccountingPeriodsModule,
        ],
        controllers: [transactions_controller_1.TransactionsController, supplier_payments_controller_1.SupplierPaymentsController, operating_expense_transactions_controller_1.OperatingExpenseTransactionsController],
        providers: [transactions_service_1.TransactionsService],
        exports: [transactions_service_1.TransactionsService],
    })
], TransactionsModule);
//# sourceMappingURL=transactions.module.js.map