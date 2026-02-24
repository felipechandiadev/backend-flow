"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingPeriodsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const accounting_period_entity_1 = require("./domain/accounting-period.entity");
const company_entity_1 = require("../companies/domain/company.entity");
const accounting_periods_service_1 = require("./application/accounting-periods.service");
const accounting_periods_controller_1 = require("./presentation/accounting-periods.controller");
const account_balances_module_1 = require("../account-balances/account-balances.module");
let AccountingPeriodsModule = class AccountingPeriodsModule {
};
exports.AccountingPeriodsModule = AccountingPeriodsModule;
exports.AccountingPeriodsModule = AccountingPeriodsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([accounting_period_entity_1.AccountingPeriod, company_entity_1.Company]),
            account_balances_module_1.AccountBalancesModule,
        ],
        controllers: [accounting_periods_controller_1.AccountingPeriodsController],
        providers: [accounting_periods_service_1.AccountingPeriodsService],
        exports: [accounting_periods_service_1.AccountingPeriodsService],
    })
], AccountingPeriodsModule);
//# sourceMappingURL=accounting-periods.module.js.map