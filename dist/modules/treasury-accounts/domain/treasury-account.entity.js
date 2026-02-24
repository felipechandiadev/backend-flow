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
exports.TreasuryAccount = exports.TreasuryAccountType = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../../companies/domain/company.entity");
const branch_entity_1 = require("../../branches/domain/branch.entity");
var TreasuryAccountType;
(function (TreasuryAccountType) {
    TreasuryAccountType["BANK"] = "BANK";
    TreasuryAccountType["CASH"] = "CASH";
    TreasuryAccountType["VIRTUAL"] = "VIRTUAL";
})(TreasuryAccountType || (exports.TreasuryAccountType = TreasuryAccountType = {}));
let TreasuryAccount = class TreasuryAccount {
};
exports.TreasuryAccount = TreasuryAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], TreasuryAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], TreasuryAccount.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], TreasuryAccount.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: TreasuryAccountType }),
    __metadata("design:type", String)
], TreasuryAccount.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], TreasuryAccount.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", Object)
], TreasuryAccount.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", Object)
], TreasuryAccount.prototype, "accountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], TreasuryAccount.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], TreasuryAccount.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TreasuryAccount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TreasuryAccount.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "companyId" }),
    __metadata("design:type", company_entity_1.Company)
], TreasuryAccount.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "branchId" }),
    __metadata("design:type", Object)
], TreasuryAccount.prototype, "branch", void 0);
exports.TreasuryAccount = TreasuryAccount = __decorate([
    (0, typeorm_1.Entity)("treasury_accounts")
], TreasuryAccount);
//# sourceMappingURL=treasury-account.entity.js.map