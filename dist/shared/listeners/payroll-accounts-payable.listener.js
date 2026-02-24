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
var PayrollAccountsPayableListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollAccountsPayableListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_created_event_1 = require("../events/transaction-created.event");
const transaction_entity_1 = require("../../modules/transactions/domain/transaction.entity");
let PayrollAccountsPayableListener = PayrollAccountsPayableListener_1 = class PayrollAccountsPayableListener {
    constructor(transactionRepo, dataSource) {
        this.transactionRepo = transactionRepo;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(PayrollAccountsPayableListener_1.name);
    }
    async handlePayrollCreated(event) {
        const { transaction, companyId } = event;
        if (transaction.transactionType !== transaction_entity_1.TransactionType.PAYROLL) {
            return;
        }
        try {
            this.logger.log(`[PAYROLL ACCOUNTS PAYABLE] Processing payroll transaction ${transaction.id}`);
            const metadata = transaction.metadata;
            if (!metadata?.lines || !Array.isArray(metadata.lines)) {
                this.logger.warn(`Payroll ${transaction.id} has no lines in metadata`);
                return;
            }
            await this.dataSource.transaction(async (manager) => {
                const transactionRepo = manager.getRepository(transaction_entity_1.Transaction);
                const accountsPayable = [];
                let totalDeductions = 0;
                const deductionsByType = {};
                for (const line of metadata.lines) {
                    const { typeId, amount } = line;
                    if (amount < 0) {
                        const absAmount = Math.abs(amount);
                        totalDeductions += absAmount;
                        if (!deductionsByType[typeId]) {
                            deductionsByType[typeId] = 0;
                        }
                        deductionsByType[typeId] += absAmount;
                    }
                }
                for (const [typeId, amount] of Object.entries(deductionsByType)) {
                    accountsPayable.push({
                        description: this.getDeductionDescription(typeId),
                        amount,
                        typeId,
                        paymentDueDate: this.getPaymentDueDate(typeId),
                    });
                }
                const totalEarnings = metadata.lines
                    .filter((line) => line.amount > 0)
                    .reduce((sum, line) => sum + line.amount, 0);
                const netPayment = totalEarnings - totalDeductions;
                if (netPayment > 0) {
                    accountsPayable.push({
                        description: 'Pago de remuneración al empleado',
                        amount: netPayment,
                        typeId: 'EMPLOYEE_PAYMENT',
                        paymentDueDate: transaction.paymentDueDate || new Date(),
                    });
                }
                for (const payable of accountsPayable) {
                    const paymentOut = transactionRepo.create({
                        documentNumber: await this.generateDocumentNumber(transaction.documentNumber, payable.typeId),
                        transactionType: transaction_entity_1.TransactionType.PAYMENT_OUT,
                        status: transaction_entity_1.TransactionStatus.DRAFT,
                        branchId: transaction.branchId,
                        userId: transaction.userId,
                        employeeId: payable.typeId === 'EMPLOYEE_PAYMENT' ? transaction.employeeId : null,
                        total: payable.amount,
                        subtotal: payable.amount,
                        taxAmount: 0,
                        discountAmount: 0,
                        paymentMethod: transaction_entity_1.PaymentMethod.TRANSFER,
                        amountPaid: 0,
                        paymentDueDate: payable.paymentDueDate,
                        accountingPeriodId: transaction.accountingPeriodId,
                        relatedTransactionId: transaction.id,
                        notes: payable.description,
                        metadata: {
                            origin: 'PAYROLL',
                            payrollTransactionId: transaction.id,
                            payrollLineType: payable.typeId,
                            employeeId: transaction.employeeId,
                        },
                    });
                    await transactionRepo.save(paymentOut);
                    this.logger.log(`[PAYROLL ACCOUNTS PAYABLE] Created PAYMENT_OUT ${paymentOut.id} ` +
                        `for ${payable.description} - Amount: ${payable.amount}`);
                }
                this.logger.log(`[PAYROLL ACCOUNTS PAYABLE] Successfully created ${accountsPayable.length} ` +
                    `accounts payable for payroll ${transaction.id}`);
            });
        }
        catch (error) {
            this.logger.error(`[PAYROLL ACCOUNTS PAYABLE] ERROR processing payroll ${transaction.id}: ` +
                `${error.message}`);
        }
    }
    async generateDocumentNumber(payrollDocNumber, typeId) {
        const timestamp = Date.now().toString().slice(-6);
        const typePrefix = this.getTypePrefix(typeId);
        return `PAY-${typePrefix}-${timestamp}`;
    }
    getTypePrefix(typeId) {
        const prefixes = {
            EMPLOYEE_PAYMENT: 'EMP',
            AFP: 'AFP',
            HEALTH_INSURANCE: 'SAL',
            INCOME_TAX: 'IMP',
            UNEMPLOYMENT_INSURANCE: 'CES',
            LOAN_PAYMENT: 'PRE',
            ADVANCE_PAYMENT: 'ANT',
            UNION_FEE: 'SIN',
            COURT_ORDER: 'JUD',
            DEDUCTION_EXTRA: 'EXT',
            ADJUSTMENT_NEG: 'AJU',
        };
        return prefixes[typeId] || 'OTR';
    }
    getDeductionDescription(typeId) {
        const descriptions = {
            AFP: 'Pago cotización AFP',
            HEALTH_INSURANCE: 'Pago cotización Salud (Fonasa/Isapre)',
            INCOME_TAX: 'Pago impuesto único 2da categoría',
            UNEMPLOYMENT_INSURANCE: 'Pago seguro de cesantía',
            LOAN_PAYMENT: 'Pago descuento préstamo',
            ADVANCE_PAYMENT: 'Pago anticipo de sueldo',
            UNION_FEE: 'Pago cuota sindical',
            COURT_ORDER: 'Pago orden judicial',
            DEDUCTION_EXTRA: 'Pago descuento extraordinario',
            ADJUSTMENT_NEG: 'Pago ajuste negativo',
        };
        return descriptions[typeId] || `Pago ${typeId}`;
    }
    getPaymentDueDate(typeId) {
        const now = new Date();
        const dueDate = new Date(now);
        if (typeId === 'AFP' || typeId === 'HEALTH_INSURANCE') {
            dueDate.setMonth(dueDate.getMonth() + 1);
            dueDate.setDate(10);
            return dueDate;
        }
        if (typeId === 'INCOME_TAX') {
            dueDate.setMonth(dueDate.getMonth() + 1);
            dueDate.setDate(12);
            return dueDate;
        }
        dueDate.setDate(dueDate.getDate() + 7);
        return dueDate;
    }
};
exports.PayrollAccountsPayableListener = PayrollAccountsPayableListener;
__decorate([
    (0, event_emitter_1.OnEvent)('transaction.created', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_created_event_1.TransactionCreatedEvent]),
    __metadata("design:returntype", Promise)
], PayrollAccountsPayableListener.prototype, "handlePayrollCreated", null);
exports.PayrollAccountsPayableListener = PayrollAccountsPayableListener = PayrollAccountsPayableListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], PayrollAccountsPayableListener);
//# sourceMappingURL=payroll-accounts-payable.listener.js.map