"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountBalancesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const account_balance_entity_1 = require("./domain/account-balance.entity");
const account_balance_service_1 = require("./application/account-balance.service");
const ledger_entry_entity_1 = require("../ledger-entries/domain/ledger-entry.entity");
const accounting_period_entity_1 = require("../accounting-periods/domain/accounting-period.entity");
let AccountBalancesModule = class AccountBalancesModule {
};
exports.AccountBalancesModule = AccountBalancesModule;
exports.AccountBalancesModule = AccountBalancesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([account_balance_entity_1.AccountBalance, ledger_entry_entity_1.LedgerEntry, accounting_period_entity_1.AccountingPeriod]),
        ],
        providers: [account_balance_service_1.AccountBalanceService],
        exports: [account_balance_service_1.AccountBalanceService],
    })
], AccountBalancesModule);
//# sourceMappingURL=account-balances.module.js.map