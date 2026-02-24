"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountBalance = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../../companies/domain/company.entity");
const accounting_account_entity_1 = require("../../accounting-accounts/domain/accounting-account.entity");
const accounting_period_entity_1 = require("../../accounting-periods/domain/accounting-period.entity");
let AccountBalance = class AccountBalance {
    get netBalance() {
        return (this.closingDebit || 0) - (this.closingCredit || 0);
    }
    get periodMovement() {
        return (this.periodDebit || 0) - (this.periodCredit || 0);
    }
};
exports.AccountBalance = AccountBalance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], AccountBalance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], AccountBalance.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], AccountBalance.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], AccountBalance.prototype, "periodId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], AccountBalance.prototype, "openingDebit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], AccountBalance.prototype, "openingCredit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], AccountBalance.prototype, "periodDebit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], AccountBalance.prototype, "periodCredit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], AccountBalance.prototype, "closingDebit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], AccountBalance.prototype, "closingCredit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], AccountBalance.prototype, "frozen", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Object)
], AccountBalance.prototype, "frozenAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AccountBalance.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AccountBalance.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "companyId" }),
    __metadata("design:type", company_entity_1.Company)
], AccountBalance.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => accounting_account_entity_1.AccountingAccount, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "accountId" }),
    __metadata("design:type", accounting_account_entity_1.AccountingAccount)
], AccountBalance.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => accounting_period_entity_1.AccountingPeriod, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "periodId" }),
    __metadata("design:type", accounting_period_entity_1.AccountingPeriod)
], AccountBalance.prototype, "period", void 0);
exports.AccountBalance = AccountBalance = __decorate([
    (0, typeorm_1.Entity)("account_balances"),
    (0, typeorm_1.Unique)('UQ_account_balance_account_period', ['accountId', 'periodId']),
    (0, typeorm_1.Index)(['companyId', 'periodId']),
    (0, typeorm_1.Index)(['accountId', 'periodId'])
], AccountBalance);
//# sourceMappingURL=account-balance.entity.js.map