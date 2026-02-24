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
exports.AccountingAccount = exports.AccountType = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../../companies/domain/company.entity");
var AccountType;
(function (AccountType) {
    AccountType["ASSET"] = "ASSET";
    AccountType["LIABILITY"] = "LIABILITY";
    AccountType["EQUITY"] = "EQUITY";
    AccountType["INCOME"] = "INCOME";
    AccountType["EXPENSE"] = "EXPENSE";
})(AccountType || (exports.AccountType = AccountType = {}));
let AccountingAccount = class AccountingAccount {
};
exports.AccountingAccount = AccountingAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], AccountingAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], AccountingAccount.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20 }),
    __metadata("design:type", String)
], AccountingAccount.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], AccountingAccount.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: AccountType }),
    __metadata("design:type", String)
], AccountingAccount.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], AccountingAccount.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], AccountingAccount.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AccountingAccount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AccountingAccount.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "companyId" }),
    __metadata("design:type", company_entity_1.Company)
], AccountingAccount.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => AccountingAccount, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "parentId" }),
    __metadata("design:type", Object)
], AccountingAccount.prototype, "parent", void 0);
exports.AccountingAccount = AccountingAccount = __decorate([
    (0, typeorm_1.Entity)("accounting_accounts"),
    (0, typeorm_1.Index)(["companyId", "code"], { unique: true })
], AccountingAccount);
//# sourceMappingURL=accounting-account.entity.js.map