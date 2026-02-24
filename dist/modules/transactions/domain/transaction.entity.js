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
exports.Transaction = exports.PaymentStatus = exports.PaymentMethod = exports.TransactionStatus = exports.TransactionType = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const branch_entity_1 = require("../../branches/domain/branch.entity");
const point_of_sale_entity_1 = require("../../points-of-sale/domain/point-of-sale.entity");
const cash_session_entity_1 = require("../../cash-sessions/domain/cash-session.entity");
const customer_entity_1 = require("../../customers/domain/customer.entity");
const supplier_entity_1 = require("../../suppliers/domain/supplier.entity");
const user_entity_1 = require("../../users/domain/user.entity");
const expense_category_entity_1 = require("../../expense-categories/domain/expense-category.entity");
const result_center_entity_1 = require("../../result-centers/domain/result-center.entity");
const shareholder_entity_1 = require("../../shareholders/domain/shareholder.entity");
const accounting_period_entity_1 = require("../../accounting-periods/domain/accounting-period.entity");
const employee_entity_1 = require("../../employees/domain/employee.entity");
const storage_entity_1 = require("../../storages/domain/storage.entity");
var TransactionType;
(function (TransactionType) {
    TransactionType["SALE"] = "SALE";
    TransactionType["SALE_RETURN"] = "SALE_RETURN";
    TransactionType["PURCHASE"] = "PURCHASE";
    TransactionType["PURCHASE_ORDER"] = "PURCHASE_ORDER";
    TransactionType["PURCHASE_RETURN"] = "PURCHASE_RETURN";
    TransactionType["TRANSFER_OUT"] = "TRANSFER_OUT";
    TransactionType["TRANSFER_IN"] = "TRANSFER_IN";
    TransactionType["ADJUSTMENT_IN"] = "ADJUSTMENT_IN";
    TransactionType["ADJUSTMENT_OUT"] = "ADJUSTMENT_OUT";
    TransactionType["PAYMENT_IN"] = "PAYMENT_IN";
    TransactionType["PAYMENT_OUT"] = "PAYMENT_OUT";
    TransactionType["SUPPLIER_PAYMENT"] = "SUPPLIER_PAYMENT";
    TransactionType["EXPENSE_PAYMENT"] = "EXPENSE_PAYMENT";
    TransactionType["PAYROLL"] = "PAYROLL";
    TransactionType["PAYMENT_EXECUTION"] = "PAYMENT_EXECUTION";
    TransactionType["CASH_DEPOSIT"] = "CASH_DEPOSIT";
    TransactionType["OPERATING_EXPENSE"] = "OPERATING_EXPENSE";
    TransactionType["CASH_SESSION_OPENING"] = "CASH_SESSION_OPENING";
    TransactionType["CASH_SESSION_CLOSING"] = "CASH_SESSION_CLOSING";
    TransactionType["CASH_SESSION_WITHDRAWAL"] = "CASH_SESSION_WITHDRAWAL";
    TransactionType["CASH_SESSION_DEPOSIT"] = "CASH_SESSION_DEPOSIT";
    TransactionType["BANK_WITHDRAWAL_TO_SHAREHOLDER"] = "BANK_WITHDRAWAL_TO_SHAREHOLDER";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["DRAFT"] = "DRAFT";
    TransactionStatus["CONFIRMED"] = "CONFIRMED";
    TransactionStatus["PARTIALLY_RECEIVED"] = "PARTIALLY_RECEIVED";
    TransactionStatus["RECEIVED"] = "RECEIVED";
    TransactionStatus["CANCELLED"] = "CANCELLED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentMethod["DEBIT_CARD"] = "DEBIT_CARD";
    PaymentMethod["TRANSFER"] = "TRANSFER";
    PaymentMethod["CHECK"] = "CHECK";
    PaymentMethod["CREDIT"] = "CREDIT";
    PaymentMethod["INTERNAL_CREDIT"] = "INTERNAL_CREDIT";
    PaymentMethod["MIXED"] = "MIXED";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["PARTIAL"] = "PARTIAL";
    PaymentStatus["OVERDUE"] = "OVERDUE";
    PaymentStatus["VOIDED"] = "VOIDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let Transaction = class Transaction {
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Transaction.prototype, "documentNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TransactionType }),
    __metadata("design:type", String)
], Transaction.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.CONFIRMED }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "pointOfSaleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "cashSessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "storageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "targetStorageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Transaction.prototype, "shareholderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Transaction.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Transaction.prototype, "expenseCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Transaction.prototype, "resultCenterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Transaction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Transaction.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Transaction.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Transaction.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Transaction.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH }),
    __metadata("design:type", String)
], Transaction.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "bankAccountKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "documentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "documentFolio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Transaction.prototype, "paymentDueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentStatus, nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "accountingPeriodId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Transaction.prototype, "amountPaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "changeAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "relatedTransactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "parentTransactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "externalReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Transaction.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'branchId' }),
    __metadata("design:type", branch_entity_1.Branch)
], Transaction.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => point_of_sale_entity_1.PointOfSale, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'pointOfSaleId' }),
    __metadata("design:type", point_of_sale_entity_1.PointOfSale)
], Transaction.prototype, "pointOfSale", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cash_session_entity_1.CashSession, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'cashSessionId' }),
    __metadata("design:type", cash_session_entity_1.CashSession)
], Transaction.prototype, "cashSession", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => storage_entity_1.Storage, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'storageId' }),
    __metadata("design:type", Object)
], Transaction.prototype, "storageEntry", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => storage_entity_1.Storage, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'targetStorageId' }),
    __metadata("design:type", Object)
], Transaction.prototype, "targetStorageEntry", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'customerId' }),
    __metadata("design:type", customer_entity_1.Customer)
], Transaction.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'supplierId' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], Transaction.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shareholder_entity_1.Shareholder, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'shareholderId' }),
    __metadata("design:type", Object)
], Transaction.prototype, "shareholder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'employeeId' }),
    __metadata("design:type", Object)
], Transaction.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Transaction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expense_category_entity_1.ExpenseCategory, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'expenseCategoryId' }),
    __metadata("design:type", Object)
], Transaction.prototype, "expenseCategory", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => result_center_entity_1.ResultCenter, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'resultCenterId' }),
    __metadata("design:type", Object)
], Transaction.prototype, "resultCenter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => accounting_period_entity_1.AccountingPeriod, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'accountingPeriodId' }),
    __metadata("design:type", accounting_period_entity_1.AccountingPeriod)
], Transaction.prototype, "accountingPeriod", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Transaction, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'relatedTransactionId' }),
    __metadata("design:type", Transaction)
], Transaction.prototype, "relatedTransaction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Transaction, t => t.children, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'parentTransactionId' }),
    __metadata("design:type", Transaction)
], Transaction.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Transaction, t => t.parent),
    __metadata("design:type", Array)
], Transaction.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => globalThis.TransactionLine, (line) => line.transaction),
    __metadata("design:type", Array)
], Transaction.prototype, "lines", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)("transactions"),
    (0, typeorm_1.Index)(['transactionType', 'createdAt']),
    (0, typeorm_1.Index)(['branchId', 'createdAt']),
    (0, typeorm_1.Index)(['documentNumber'])
], Transaction);
;
globalThis.Transaction = Transaction;
//# sourceMappingURL=transaction.entity.js.map