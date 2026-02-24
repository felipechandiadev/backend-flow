"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerEntriesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ledger_entry_entity_1 = require("./domain/ledger-entry.entity");
const ledger_entries_service_1 = require("./application/ledger-entries.service");
const ledger_entries_controller_1 = require("./presentation/ledger-entries.controller");
const accounting_rule_entity_1 = require("../accounting-rules/domain/accounting-rule.entity");
const accounting_account_entity_1 = require("../accounting-accounts/domain/accounting-account.entity");
const customer_entity_1 = require("../customers/domain/customer.entity");
const supplier_entity_1 = require("../suppliers/domain/supplier.entity");
const shareholder_entity_1 = require("../shareholders/domain/shareholder.entity");
const employee_entity_1 = require("../employees/domain/employee.entity");
let LedgerEntriesModule = class LedgerEntriesModule {
};
exports.LedgerEntriesModule = LedgerEntriesModule;
exports.LedgerEntriesModule = LedgerEntriesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                ledger_entry_entity_1.LedgerEntry,
                accounting_rule_entity_1.AccountingRule,
                accounting_account_entity_1.AccountingAccount,
                customer_entity_1.Customer,
                supplier_entity_1.Supplier,
                shareholder_entity_1.Shareholder,
                employee_entity_1.Employee,
            ]),
        ],
        controllers: [ledger_entries_controller_1.LedgerEntriesController],
        providers: [ledger_entries_service_1.LedgerEntriesService],
        exports: [ledger_entries_service_1.LedgerEntriesService],
    })
], LedgerEntriesModule);
//# sourceMappingURL=ledger-entries.module.js.map