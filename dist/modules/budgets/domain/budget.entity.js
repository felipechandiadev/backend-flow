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
exports.Budget = exports.BudgetStatus = exports.BudgetCurrency = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../../companies/domain/company.entity");
const result_center_entity_1 = require("../../result-centers/domain/result-center.entity");
const user_entity_1 = require("../../users/domain/user.entity");
var BudgetCurrency;
(function (BudgetCurrency) {
    BudgetCurrency["CLP"] = "CLP";
})(BudgetCurrency || (exports.BudgetCurrency = BudgetCurrency = {}));
var BudgetStatus;
(function (BudgetStatus) {
    BudgetStatus["ACTIVE"] = "ACTIVE";
    BudgetStatus["SUPERSEDED"] = "SUPERSEDED";
    BudgetStatus["CANCELLED"] = "CANCELLED";
})(BudgetStatus || (exports.BudgetStatus = BudgetStatus = {}));
let Budget = class Budget {
};
exports.Budget = Budget;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Budget.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Budget.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Budget.prototype, "resultCenterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], Budget.prototype, "periodStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], Budget.prototype, "periodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint" }),
    __metadata("design:type", String)
], Budget.prototype, "budgetedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", default: 0 }),
    __metadata("design:type", String)
], Budget.prototype, "spentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: BudgetCurrency, default: BudgetCurrency.CLP }),
    __metadata("design:type", String)
], Budget.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: BudgetStatus, default: BudgetStatus.ACTIVE }),
    __metadata("design:type", String)
], Budget.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 1 }),
    __metadata("design:type", Number)
], Budget.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Budget.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Budget.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Budget.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "companyId" }),
    __metadata("design:type", company_entity_1.Company)
], Budget.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => result_center_entity_1.ResultCenter, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "resultCenterId" }),
    __metadata("design:type", result_center_entity_1.ResultCenter)
], Budget.prototype, "resultCenter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", user_entity_1.User)
], Budget.prototype, "createdByUser", void 0);
exports.Budget = Budget = __decorate([
    (0, typeorm_1.Entity)("budgets")
], Budget);
//# sourceMappingURL=budget.entity.js.map