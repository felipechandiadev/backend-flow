"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreasuryAccountsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const treasury_accounts_controller_1 = require("./presentation/treasury-accounts.controller");
const treasury_accounts_service_1 = require("./application/treasury-accounts.service");
const treasury_account_entity_1 = require("./domain/treasury-account.entity");
const company_entity_1 = require("../companies/domain/company.entity");
let TreasuryAccountsModule = class TreasuryAccountsModule {
};
exports.TreasuryAccountsModule = TreasuryAccountsModule;
exports.TreasuryAccountsModule = TreasuryAccountsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([treasury_account_entity_1.TreasuryAccount, company_entity_1.Company])],
        controllers: [treasury_accounts_controller_1.TreasuryAccountsController],
        providers: [treasury_accounts_service_1.TreasuryAccountsService],
        exports: [treasury_accounts_service_1.TreasuryAccountsService],
    })
], TreasuryAccountsModule);
//# sourceMappingURL=treasury-accounts.module.js.map