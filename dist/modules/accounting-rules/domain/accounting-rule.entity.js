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
exports.AccountingRule = exports.RuleScope = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../../companies/domain/company.entity");
const accounting_account_entity_1 = require("../../accounting-accounts/domain/accounting-account.entity");
const expense_category_entity_1 = require("../../expense-categories/domain/expense-category.entity");
const tax_entity_1 = require("../../taxes/domain/tax.entity");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
var RuleScope;
(function (RuleScope) {
    RuleScope["TRANSACTION"] = "TRANSACTION";
    RuleScope["TRANSACTION_LINE"] = "TRANSACTION_LINE";
})(RuleScope || (exports.RuleScope = RuleScope = {}));
let AccountingRule = class AccountingRule {
};
exports.AccountingRule = AccountingRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], AccountingRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], AccountingRule.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: RuleScope }),
    __metadata("design:type", String)
], AccountingRule.prototype, "appliesTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: transaction_entity_1.TransactionType }),
    __metadata("design:type", String)
], AccountingRule.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], AccountingRule.prototype, "expenseCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], AccountingRule.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: transaction_entity_1.PaymentMethod, nullable: true }),
    __metadata("design:type", Object)
], AccountingRule.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], AccountingRule.prototype, "debitAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], AccountingRule.prototype, "creditAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], AccountingRule.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], AccountingRule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AccountingRule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AccountingRule.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "companyId" }),
    __metadata("design:type", company_entity_1.Company)
], AccountingRule.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expense_category_entity_1.ExpenseCategory, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "expenseCategoryId" }),
    __metadata("design:type", Object)
], AccountingRule.prototype, "expenseCategory", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tax_entity_1.Tax, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "taxId" }),
    __metadata("design:type", Object)
], AccountingRule.prototype, "tax", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => accounting_account_entity_1.AccountingAccount, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "debitAccountId" }),
    __metadata("design:type", accounting_account_entity_1.AccountingAccount)
], AccountingRule.prototype, "debitAccount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => accounting_account_entity_1.AccountingAccount, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "creditAccountId" }),
    __metadata("design:type", accounting_account_entity_1.AccountingAccount)
], AccountingRule.prototype, "creditAccount", void 0);
exports.AccountingRule = AccountingRule = __decorate([
    (0, typeorm_1.Entity)("accounting_rules")
], AccountingRule);
//# sourceMappingURL=accounting-rule.entity.js.map