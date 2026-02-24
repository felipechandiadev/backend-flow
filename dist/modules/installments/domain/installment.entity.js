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
exports.Installment = exports.InstallmentSourceType = exports.InstallmentStatus = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
var InstallmentStatus;
(function (InstallmentStatus) {
    InstallmentStatus["PENDING"] = "PENDING";
    InstallmentStatus["PARTIAL"] = "PARTIAL";
    InstallmentStatus["PAID"] = "PAID";
    InstallmentStatus["OVERDUE"] = "OVERDUE";
})(InstallmentStatus || (exports.InstallmentStatus = InstallmentStatus = {}));
var InstallmentSourceType;
(function (InstallmentSourceType) {
    InstallmentSourceType["SALE"] = "SALE";
    InstallmentSourceType["PURCHASE"] = "PURCHASE";
    InstallmentSourceType["PAYROLL"] = "PAYROLL";
    InstallmentSourceType["OPERATING_EXPENSE"] = "OPERATING_EXPENSE";
    InstallmentSourceType["OTHER"] = "OTHER";
})(InstallmentSourceType || (exports.InstallmentSourceType = InstallmentSourceType = {}));
let Installment = class Installment {
    getPendingAmount() {
        return Math.max(0, this.amount - this.amountPaid);
    }
    isOverdue(today = new Date()) {
        return today > this.dueDate && this.getPendingAmount() > 0;
    }
    getDaysOverdue(today = new Date()) {
        if (!this.isOverdue(today))
            return 0;
        const diffTime = Math.abs(today.getTime() - this.dueDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
};
exports.Installment = Installment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Installment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: 'SALE',
    }),
    __metadata("design:type", String)
], Installment.prototype, "sourceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Installment.prototype, "sourceTransactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Installment.prototype, "saleTransactionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => transaction_entity_1.Transaction),
    (0, typeorm_1.JoinColumn)({ name: 'saleTransactionId' }),
    __metadata("design:type", transaction_entity_1.Transaction)
], Installment.prototype, "saleTransaction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Installment.prototype, "payeeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Installment.prototype, "payeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Installment.prototype, "installmentNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Installment.prototype, "totalInstallments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Installment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Installment.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Installment.prototype, "amountPaid", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InstallmentStatus,
        default: InstallmentStatus.PENDING
    }),
    __metadata("design:type", String)
], Installment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Installment.prototype, "paymentTransactionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => transaction_entity_1.Transaction),
    (0, typeorm_1.JoinColumn)({ name: 'paymentTransactionId' }),
    __metadata("design:type", transaction_entity_1.Transaction)
], Installment.prototype, "paymentTransaction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Installment.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Installment.prototype, "createdAt", void 0);
exports.Installment = Installment = __decorate([
    (0, typeorm_1.Entity)("installments"),
    (0, typeorm_1.Index)(['saleTransactionId', 'installmentNumber']),
    (0, typeorm_1.Index)(['sourceType', 'sourceTransactionId']),
    (0, typeorm_1.Index)(['payeeType', 'payeeId']),
    (0, typeorm_1.Index)(['dueDate']),
    (0, typeorm_1.Index)(['status'])
], Installment);
//# sourceMappingURL=installment.entity.js.map