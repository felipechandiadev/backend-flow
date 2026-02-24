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
exports.OperationalExpense = exports.OperationalExpenseStatus = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../../companies/domain/company.entity");
const branch_entity_1 = require("../../branches/domain/branch.entity");
const result_center_entity_1 = require("../../result-centers/domain/result-center.entity");
const expense_category_entity_1 = require("../../expense-categories/domain/expense-category.entity");
const supplier_entity_1 = require("../../suppliers/domain/supplier.entity");
const employee_entity_1 = require("../../employees/domain/employee.entity");
const user_entity_1 = require("../../users/domain/user.entity");
var OperationalExpenseStatus;
(function (OperationalExpenseStatus) {
    OperationalExpenseStatus["DRAFT"] = "DRAFT";
    OperationalExpenseStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    OperationalExpenseStatus["APPROVED"] = "APPROVED";
    OperationalExpenseStatus["REJECTED"] = "REJECTED";
    OperationalExpenseStatus["CANCELLED"] = "CANCELLED";
})(OperationalExpenseStatus || (exports.OperationalExpenseStatus = OperationalExpenseStatus = {}));
let OperationalExpense = class OperationalExpense {
};
exports.OperationalExpense = OperationalExpense;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OperationalExpense.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OperationalExpense.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], OperationalExpense.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], OperationalExpense.prototype, "resultCenterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OperationalExpense.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], OperationalExpense.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], OperationalExpense.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 60 }),
    __metadata("design:type", String)
], OperationalExpense.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OperationalExpense.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], OperationalExpense.prototype, "operationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: OperationalExpenseStatus, default: OperationalExpenseStatus.DRAFT }),
    __metadata("design:type", String)
], OperationalExpense.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], OperationalExpense.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OperationalExpense.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], OperationalExpense.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Object)
], OperationalExpense.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OperationalExpense.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], OperationalExpense.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "companyId" }),
    __metadata("design:type", company_entity_1.Company)
], OperationalExpense.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "branchId" }),
    __metadata("design:type", Object)
], OperationalExpense.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => result_center_entity_1.ResultCenter, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "resultCenterId" }),
    __metadata("design:type", Object)
], OperationalExpense.prototype, "resultCenter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expense_category_entity_1.ExpenseCategory, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "categoryId" }),
    __metadata("design:type", expense_category_entity_1.ExpenseCategory)
], OperationalExpense.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "supplierId" }),
    __metadata("design:type", Object)
], OperationalExpense.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "employeeId" }),
    __metadata("design:type", Object)
], OperationalExpense.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", user_entity_1.User)
], OperationalExpense.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "approvedBy" }),
    __metadata("design:type", Object)
], OperationalExpense.prototype, "approvedByUser", void 0);
exports.OperationalExpense = OperationalExpense = __decorate([
    (0, typeorm_1.Entity)("operational_expenses")
], OperationalExpense);
//# sourceMappingURL=operational-expense.entity.js.map