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
exports.AccountingPeriod = exports.AccountingPeriodStatus = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../../companies/domain/company.entity");
const user_entity_1 = require("../../users/domain/user.entity");
var AccountingPeriodStatus;
(function (AccountingPeriodStatus) {
    AccountingPeriodStatus["OPEN"] = "OPEN";
    AccountingPeriodStatus["CLOSED"] = "CLOSED";
    AccountingPeriodStatus["LOCKED"] = "LOCKED";
})(AccountingPeriodStatus || (exports.AccountingPeriodStatus = AccountingPeriodStatus = {}));
let AccountingPeriod = class AccountingPeriod {
};
exports.AccountingPeriod = AccountingPeriod;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], AccountingPeriod.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], AccountingPeriod.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], AccountingPeriod.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], AccountingPeriod.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", Object)
], AccountingPeriod.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: AccountingPeriodStatus, default: AccountingPeriodStatus.OPEN }),
    __metadata("design:type", String)
], AccountingPeriod.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Object)
], AccountingPeriod.prototype, "closedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], AccountingPeriod.prototype, "closedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AccountingPeriod.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AccountingPeriod.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "companyId" }),
    __metadata("design:type", company_entity_1.Company)
], AccountingPeriod.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "closedBy" }),
    __metadata("design:type", Object)
], AccountingPeriod.prototype, "closedByUser", void 0);
exports.AccountingPeriod = AccountingPeriod = __decorate([
    (0, typeorm_1.Entity)("accounting_periods"),
    (0, typeorm_1.Unique)('UQ_accounting_period_company_month', ['companyId', 'startDate', 'endDate']),
    (0, typeorm_1.Index)(['companyId', 'startDate'])
], AccountingPeriod);
//# sourceMappingURL=accounting-period.entity.js.map