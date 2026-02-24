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
var UpdateInstallmentFromPaymentListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInstallmentFromPaymentListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const transaction_created_event_1 = require("../events/transaction-created.event");
const transaction_entity_1 = require("../../modules/transactions/domain/transaction.entity");
const installment_service_1 = require("../../modules/installments/application/services/installment.service");
const installment_repository_1 = require("../../modules/installments/infrastructure/installment.repository");
let UpdateInstallmentFromPaymentListener = UpdateInstallmentFromPaymentListener_1 = class UpdateInstallmentFromPaymentListener {
    constructor(installmentService, installmentRepo) {
        this.installmentService = installmentService;
        this.installmentRepo = installmentRepo;
        this.logger = new common_1.Logger(UpdateInstallmentFromPaymentListener_1.name);
    }
    async handlePaymentCreated(event) {
        const { transaction } = event;
        if (![
            transaction_entity_1.TransactionType.PAYMENT_IN,
            transaction_entity_1.TransactionType.SUPPLIER_PAYMENT,
            transaction_entity_1.TransactionType.EXPENSE_PAYMENT,
            transaction_entity_1.TransactionType.PAYMENT_EXECUTION,
        ].includes(transaction.transactionType)) {
            return;
        }
        try {
            const paidQuotaId = transaction.metadata?.paidQuotaId;
            if (paidQuotaId) {
                await this.installmentService.updateInstallmentFromPayment(paidQuotaId, parseFloat(transaction.total.toString()), transaction.id);
                return;
            }
            if (!transaction.relatedTransactionId) {
                return;
            }
            this.logger.log(`[UPDATE INSTALLMENTS] Processing payment ${transaction.id} ` +
                `referencing transaction ${transaction.relatedTransactionId}`);
            const installments = await this.installmentRepo.getInstallmentsByTransaction(transaction.relatedTransactionId);
            if (installments.length === 0) {
                return;
            }
            let targetInstallment = installments.find(i => i.status === 'PENDING' || i.status === 'PARTIAL');
            if (!targetInstallment) {
                this.logger.warn(`[UPDATE INSTALLMENTS] No pending installments found for transaction ${transaction.relatedTransactionId}`);
                return;
            }
            this.logger.log(`[UPDATE INSTALLMENTS] Found target installment ${targetInstallment.installmentNumber}/${targetInstallment.totalInstallments}, ` +
                `applying payment of $${transaction.total}`);
            const updated = await this.installmentService.updateInstallmentFromPayment(targetInstallment.id, parseFloat(transaction.total.toString()), transaction.id);
            this.logger.log(`[UPDATE INSTALLMENTS] Installment updated: ` +
                `Status=${updated.status}, Paid=$${updated.amountPaid}/${updated.amount}`);
        }
        catch (error) {
            this.logger.error(`[UPDATE INSTALLMENTS] Error updating installment for payment ${transaction.id}`, error);
        }
    }
};
exports.UpdateInstallmentFromPaymentListener = UpdateInstallmentFromPaymentListener;
__decorate([
    (0, event_emitter_1.OnEvent)('transaction.created', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_created_event_1.TransactionCreatedEvent]),
    __metadata("design:returntype", Promise)
], UpdateInstallmentFromPaymentListener.prototype, "handlePaymentCreated", null);
exports.UpdateInstallmentFromPaymentListener = UpdateInstallmentFromPaymentListener = UpdateInstallmentFromPaymentListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [installment_service_1.InstallmentService,
        installment_repository_1.InstallmentRepository])
], UpdateInstallmentFromPaymentListener);
//# sourceMappingURL=update-installment-from-payment.listener.js.map