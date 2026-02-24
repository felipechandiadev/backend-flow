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
exports.AccountingPeriodSnapshot = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const accounting_period_entity_1 = require("../../accounting-periods/domain/accounting-period.entity");
const accounting_account_entity_1 = require("../../accounting-accounts/domain/accounting-account.entity");
let AccountingPeriodSnapshot = class AccountingPeriodSnapshot {
};
exports.AccountingPeriodSnapshot = AccountingPeriodSnapshot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], AccountingPeriodSnapshot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], AccountingPeriodSnapshot.prototype, "periodId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], AccountingPeriodSnapshot.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], AccountingPeriodSnapshot.prototype, "closingBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], AccountingPeriodSnapshot.prototype, "debitSum", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], AccountingPeriodSnapshot.prototype, "creditSum", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], AccountingPeriodSnapshot.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AccountingPeriodSnapshot.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AccountingPeriodSnapshot.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => accounting_period_entity_1.AccountingPeriod, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "periodId" }),
    __metadata("design:type", accounting_period_entity_1.AccountingPeriod)
], AccountingPeriodSnapshot.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => accounting_account_entity_1.AccountingAccount, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "accountId" }),
    __metadata("design:type", accounting_account_entity_1.AccountingAccount)
], AccountingPeriodSnapshot.prototype, "account", void 0);
exports.AccountingPeriodSnapshot = AccountingPeriodSnapshot = __decorate([
    (0, typeorm_1.Entity)("accounting_period_snapshots"),
    (0, typeorm_1.Unique)(["periodId", "accountId"]),
    (0, typeorm_1.Index)(["periodId"])
], AccountingPeriodSnapshot);
//# sourceMappingURL=accounting-period-snapshot.entity.js.map