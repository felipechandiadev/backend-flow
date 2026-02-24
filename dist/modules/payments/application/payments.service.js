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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
const cash_session_entity_1 = require("../../cash-sessions/domain/cash-session.entity");
const point_of_sale_entity_1 = require("../../points-of-sale/domain/point-of-sale.entity");
const user_entity_1 = require("../../users/domain/user.entity");
const branch_entity_1 = require("../../branches/domain/branch.entity");
const transactions_service_1 = require("../../transactions/application/transactions.service");
const ledger_entries_service_1 = require("../../ledger-entries/application/ledger-entries.service");
const installment_service_1 = require("../../installments/application/services/installment.service");
const installment_entity_1 = require("../../installments/domain/installment.entity");
let PaymentsService = class PaymentsService {
    constructor(transactionRepository, cashSessionRepository, branchRepository, dataSource, transactionsService, ledgerEntriesService, installmentService) {
        this.transactionRepository = transactionRepository;
        this.cashSessionRepository = cashSessionRepository;
        this.branchRepository = branchRepository;
        this.dataSource = dataSource;
        this.transactionsService = transactionsService;
        this.ledgerEntriesService = ledgerEntriesService;
        this.installmentService = installmentService;
    }
    async createMultiplePayments(dto) {
        const { saleTransactionId, payments } = dto;
        return await this.dataSource.transaction(async (manager) => {
            const saleTransaction = await manager.getRepository(transaction_entity_1.Transaction).findOne({
                where: { id: saleTransactionId, transactionType: transaction_entity_1.TransactionType.SALE },
            });
            if (!saleTransaction) {
                throw new common_1.NotFoundException('Venta no encontrada');
            }
            const cashSession = saleTransaction.cashSessionId
                ? await manager.getRepository(cash_session_entity_1.CashSession).findOne({ where: { id: saleTransaction.cashSessionId } })
                : null;
            const pointOfSale = saleTransaction.pointOfSaleId
                ? await manager.getRepository(point_of_sale_entity_1.PointOfSale).findOne({ where: { id: saleTransaction.pointOfSaleId } })
                : null;
            const user = await manager.getRepository(user_entity_1.User).findOne({ where: { id: saleTransaction.userId } });
            if (!cashSession || !pointOfSale || !user) {
                throw new common_1.BadRequestException('Datos de venta incompletos');
            }
            const paymentTransactions = [];
            let totalPaid = 0;
            for (const payment of payments) {
                if (payment.paymentMethod === transaction_entity_1.PaymentMethod.INTERNAL_CREDIT) {
                    const subPayments = Array.isArray(payment.subPayments) ? payment.subPayments : [];
                    saleTransaction.metadata = {
                        ...(saleTransaction.metadata || {}),
                        internalCreditQuotas: payment.subPayments,
                        internalCreditAmount: payment.amount,
                    };
                    await manager.getRepository(transaction_entity_1.Transaction).save(saleTransaction);
                    const existing = await this.installmentService.getInstallmentsForSale(saleTransaction.id);
                    if (existing.length === 0) {
                        const schedule = subPayments
                            .filter((item) => item?.amount && item?.dueDate)
                            .map((item) => ({
                            amount: Number(item.amount || 0),
                            dueDate: item.dueDate,
                        }));
                        if (schedule.length > 0) {
                            await this.installmentService.createInstallmentsFromSchedule(saleTransaction.id, schedule, {
                                sourceType: installment_entity_1.InstallmentSourceType.SALE,
                                payeeType: 'CUSTOMER',
                                payeeId: saleTransaction.customerId || undefined,
                            });
                        }
                        else if (payment.amount > 0) {
                            const fallbackDueDate = new Date();
                            fallbackDueDate.setDate(fallbackDueDate.getDate() + 30);
                            await this.installmentService.createInstallmentsFromSchedule(saleTransaction.id, [{ amount: Number(payment.amount || 0), dueDate: fallbackDueDate }], {
                                sourceType: installment_entity_1.InstallmentSourceType.SALE,
                                payeeType: 'CUSTOMER',
                                payeeId: saleTransaction.customerId || undefined,
                            });
                        }
                    }
                    totalPaid += payment.amount;
                    continue;
                }
                const paymentTransaction = await this.createPaymentTransactionCentralized(manager, {
                    saleTransaction,
                    payment,
                    cashSession,
                    pointOfSale,
                    user,
                });
                paymentTransactions.push({
                    id: paymentTransaction.id,
                    paymentMethod: payment.paymentMethod,
                    amount: payment.amount,
                    transactionId: paymentTransaction.id,
                });
                totalPaid += payment.amount;
            }
            const cashPayments = payments
                .filter((p) => p.paymentMethod === transaction_entity_1.PaymentMethod.CASH)
                .reduce((sum, p) => sum + p.amount, 0);
            const nonCashTotal = totalPaid - cashPayments;
            const remainingAfterNonCash = Math.max(0, saleTransaction.total - nonCashTotal);
            const change = Math.max(0, cashPayments - remainingAfterNonCash);
            if (change > 0) {
                const prev = cashSession.expectedAmount ?? cashSession.openingAmount ?? 0;
                cashSession.expectedAmount = Number(prev) - Number(change);
                await manager.getRepository(cash_session_entity_1.CashSession).save(cashSession);
            }
            cashSession.expectedAmount = await this.recomputeCashSessionExpectedAmount(manager, cashSession);
            await manager.getRepository(cash_session_entity_1.CashSession).save(cashSession);
            return {
                success: true,
                payments: paymentTransactions,
                totalPaid,
                change,
            };
        });
    }
    async payQuota(dto) {
        const paidQuotaId = dto?.paidQuotaId;
        if (!paidQuotaId) {
            throw new common_1.BadRequestException('paidQuotaId es requerido');
        }
        const result = await this.installmentService.payInstallment(paidQuotaId, {
            paymentMethod: dto.paymentMethod,
            companyAccountKey: dto.bankAccountId || undefined,
            amount: dto.amount,
        });
        return {
            success: true,
            message: 'Pago registrado correctamente',
            transaction: result.transaction,
        };
    }
    async createPaymentTransactionCentralized(manager, params) {
        const { saleTransaction, payment, cashSession, pointOfSale, user } = params;
        const paymentData = {
            documentNumber: this.generatePaymentDocumentNumber(saleTransaction.documentNumber),
            transactionType: transaction_entity_1.TransactionType.PAYMENT_IN,
            status: transaction_entity_1.TransactionStatus.CONFIRMED,
            branchId: pointOfSale.branchId || undefined,
            pointOfSaleId: pointOfSale.id,
            cashSessionId: cashSession.id,
            customerId: saleTransaction.customerId || undefined,
            userId: user.id,
            subtotal: payment.amount,
            taxAmount: 0,
            discountAmount: 0,
            total: payment.amount,
            paymentMethod: payment.paymentMethod,
            bankAccountKey: payment.bankAccountId || undefined,
            relatedTransactionId: saleTransaction.id,
            metadata: {
                saleTransactionId: saleTransaction.id,
                bankAccountId: payment.bankAccountId,
                subPayments: payment.subPayments,
            },
        };
        const txRepo = manager.getRepository(transaction_entity_1.Transaction);
        return await txRepo.save(paymentData);
    }
    generatePaymentDocumentNumber(saleDocumentNumber) {
        const timestamp = Date.now();
        return `PAY-${saleDocumentNumber}-${timestamp}`;
    }
    async recomputeCashSessionExpectedAmount(manager, cashSession) {
        return Number(cashSession.expectedAmount ?? 0);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(1, (0, typeorm_1.InjectRepository)(cash_session_entity_1.CashSession)),
    __param(2, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        transactions_service_1.TransactionsService,
        ledger_entries_service_1.LedgerEntriesService,
        installment_service_1.InstallmentService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map