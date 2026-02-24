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
var CreateInstallmentsListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInstallmentsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const transaction_created_event_1 = require("../events/transaction-created.event");
const transaction_entity_1 = require("../../modules/transactions/domain/transaction.entity");
const installment_service_1 = require("../../modules/installments/application/services/installment.service");
const installment_entity_1 = require("../../modules/installments/domain/installment.entity");
let CreateInstallmentsListener = CreateInstallmentsListener_1 = class CreateInstallmentsListener {
    constructor(installmentService) {
        this.installmentService = installmentService;
        this.logger = new common_1.Logger(CreateInstallmentsListener_1.name);
    }
    async handleTransactionCreated(event) {
        const { transaction } = event;
        try {
            const metadata = transaction.metadata;
            if ([transaction_entity_1.TransactionType.SALE, transaction_entity_1.TransactionType.PURCHASE].includes(transaction.transactionType)) {
                await this.handleSaleOrPurchaseInstallments(transaction, metadata);
                return;
            }
            if (transaction.transactionType === transaction_entity_1.TransactionType.PAYROLL) {
                await this.handlePayrollInstallment(transaction, metadata);
                return;
            }
            if (transaction.transactionType === transaction_entity_1.TransactionType.OPERATING_EXPENSE) {
                await this.handleOperatingExpenseInstallment(transaction, metadata);
                return;
            }
        }
        catch (error) {
            this.logger.error(`[CREATE INSTALLMENTS] Error creating installments for transaction ${transaction.id}`, error);
        }
    }
    async handleSaleOrPurchaseInstallments(transaction, metadata) {
        if (!metadata?.numberOfInstallments || metadata.numberOfInstallments < 1) {
            return;
        }
        if (!metadata.firstDueDate) {
            this.logger.warn(`Transaction ${transaction.id} has numberOfInstallments but no firstDueDate`);
            return;
        }
        const numberOfInstallments = metadata.numberOfInstallments;
        const firstDueDate = new Date(metadata.firstDueDate);
        const sourceType = transaction.transactionType === transaction_entity_1.TransactionType.SALE
            ? installment_entity_1.InstallmentSourceType.SALE
            : installment_entity_1.InstallmentSourceType.PURCHASE;
        this.logger.log(`[CREATE INSTALLMENTS] Creating ${numberOfInstallments} installments for ` +
            `${transaction.transactionType} ${transaction.id} - Total: $${transaction.total}`);
        let payeeType;
        let payeeId;
        if (transaction.transactionType === transaction_entity_1.TransactionType.SALE) {
            payeeType = 'CUSTOMER';
            payeeId = transaction.customerId || metadata.customerId;
        }
        else {
            payeeType = 'SUPPLIER';
            payeeId = transaction.supplierId || metadata.supplierId;
        }
        if (metadata.paymentSchedule && Array.isArray(metadata.paymentSchedule)) {
            this.logger.log(`[CREATE INSTALLMENTS] Using detailed payment schedule`);
            const installments = [];
            for (const payment of metadata.paymentSchedule) {
                const installment = await this.installmentService.createSingleInstallment(transaction.id, Number(payment.amount), new Date(payment.dueDate), {
                    sourceType: sourceType,
                    payeeType,
                    payeeId,
                    metadata: {
                        installmentNumber: payment.installmentNumber,
                        totalInstallments: numberOfInstallments,
                    }
                });
                installments.push(installment);
            }
            this.logger.log(`[CREATE INSTALLMENTS] Successfully created ${installments.length} installments from schedule`);
            return;
        }
        const installments = await this.installmentService.createInstallmentsForTransaction(transaction.id, parseFloat(transaction.total.toString()), numberOfInstallments, firstDueDate, sourceType);
        for (const inst of installments) {
            inst.payeeType = payeeType;
            inst.payeeId = payeeId;
        }
        this.logger.log(`[CREATE INSTALLMENTS] Successfully created ${installments.length} installments`);
        for (const inst of installments) {
            this.logger.debug(`Installment ${inst.installmentNumber}/${numberOfInstallments}: ` +
                `$${inst.amount} - Due: ${inst.dueDate.toISOString().split('T')[0]}`);
        }
    }
    async handlePayrollInstallment(transaction, metadata) {
        const dueDate = metadata.paymentDate
            ? new Date(metadata.paymentDate)
            : this.getDefaultDueDate(30);
        this.logger.log(`[CREATE INSTALLMENTS] Creating single installment for PAYROLL ${transaction.id} - ` +
            `Amount: $${transaction.total} - Due: ${dueDate.toISOString().split('T')[0]}`);
        await this.installmentService.createSingleInstallment(transaction.id, parseFloat(transaction.total.toString()), dueDate, {
            sourceType: installment_entity_1.InstallmentSourceType.PAYROLL,
            payeeType: 'EMPLOYEE',
            payeeId: metadata.employeeId,
            metadata: {
                employeeName: metadata.employeeName,
                period: metadata.period,
            }
        });
        this.logger.log(`[CREATE INSTALLMENTS] Successfully created PAYROLL installment`);
    }
    async handleOperatingExpenseInstallment(transaction, metadata) {
        const dueDate = metadata.dueDate
            ? new Date(metadata.dueDate)
            : this.getDefaultDueDate(30);
        this.logger.log(`[CREATE INSTALLMENTS] Creating single installment for OPERATING_EXPENSE ${transaction.id} - ` +
            `Amount: $${transaction.total} - Due: ${dueDate.toISOString().split('T')[0]}`);
        await this.installmentService.createSingleInstallment(transaction.id, parseFloat(transaction.total.toString()), dueDate, {
            sourceType: installment_entity_1.InstallmentSourceType.OPERATING_EXPENSE,
            payeeType: metadata.supplierType || 'OTHER',
            payeeId: metadata.supplierId,
            metadata: {
                supplierName: metadata.supplierName,
                category: metadata.category,
            }
        });
        this.logger.log(`[CREATE INSTALLMENTS] Successfully created OPERATING_EXPENSE installment`);
    }
    getDefaultDueDate(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date;
    }
};
exports.CreateInstallmentsListener = CreateInstallmentsListener;
__decorate([
    (0, event_emitter_1.OnEvent)('transaction.created', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_created_event_1.TransactionCreatedEvent]),
    __metadata("design:returntype", Promise)
], CreateInstallmentsListener.prototype, "handleTransactionCreated", null);
exports.CreateInstallmentsListener = CreateInstallmentsListener = CreateInstallmentsListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [installment_service_1.InstallmentService])
], CreateInstallmentsListener);
//# sourceMappingURL=create-installments.listener.js.map