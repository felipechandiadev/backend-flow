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
var LedgerEntriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerEntriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ledger_entry_entity_1 = require("../domain/ledger-entry.entity");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
const accounting_rule_entity_1 = require("../../accounting-rules/domain/accounting-rule.entity");
const accounting_account_entity_1 = require("../../accounting-accounts/domain/accounting-account.entity");
const customer_entity_1 = require("../../customers/domain/customer.entity");
const supplier_entity_1 = require("../../suppliers/domain/supplier.entity");
const shareholder_entity_1 = require("../../shareholders/domain/shareholder.entity");
const employee_entity_1 = require("../../employees/domain/employee.entity");
let LedgerEntriesService = LedgerEntriesService_1 = class LedgerEntriesService {
    constructor(ledgerRepo, rulesRepo, accountRepo, customerRepo, supplierRepo, shareholderRepo, employeeRepo) {
        this.ledgerRepo = ledgerRepo;
        this.rulesRepo = rulesRepo;
        this.accountRepo = accountRepo;
        this.customerRepo = customerRepo;
        this.supplierRepo = supplierRepo;
        this.shareholderRepo = shareholderRepo;
        this.employeeRepo = employeeRepo;
        this.logger = new common_1.Logger(LedgerEntriesService_1.name);
    }
    async generateEntriesForTransaction(transaction, companyId, manager) {
        const startTime = Date.now();
        const errors = [];
        try {
            const personId = await this.getPersonIdForTransaction(transaction);
            const preValidationErrors = await this.preValidateTransaction(transaction, companyId);
            errors.push(...preValidationErrors);
            if (preValidationErrors.some(e => e.severity === 'ERROR')) {
                return {
                    status: 'REJECTED',
                    transactionId: transaction.id,
                    errors,
                    executedAt: new Date(),
                    executionTimeMs: Date.now() - startTime,
                };
            }
            const applicableRules = await this.matchRules(transaction, companyId);
            if (applicableRules.length === 0 && transaction.transactionType !== transaction_entity_1.TransactionType.PAYROLL) {
                this.logger.warn(`No accounting rules found for transaction ${transaction.id} (type: ${transaction.transactionType})`);
                return {
                    status: 'SUCCESS',
                    transactionId: transaction.id,
                    entriesGenerated: 0,
                    entriesIds: [],
                    balanceValidated: true,
                    errors,
                    executedAt: new Date(),
                    executionTimeMs: Date.now() - startTime,
                };
            }
            const entries = await this.calculateEntries(transaction, applicableRules, personId);
            if (entries.length === 0) {
                return {
                    status: 'SUCCESS',
                    transactionId: transaction.id,
                    entriesGenerated: 0,
                    entriesIds: [],
                    balanceValidated: true,
                    errors,
                    executedAt: new Date(),
                    executionTimeMs: Date.now() - startTime,
                };
            }
            const isBalanced = this.validateBalance(entries);
            if (!isBalanced) {
                errors.push({
                    code: 'BALANCE_MISMATCH',
                    message: `Total debits (${this.sumDebits(entries)}) != total credits (${this.sumCredits(entries)})`,
                    severity: 'ERROR',
                    phase: 'BALANCE_CHECK',
                });
                return {
                    status: 'REJECTED',
                    transactionId: transaction.id,
                    errors,
                    executedAt: new Date(),
                    executionTimeMs: Date.now() - startTime,
                };
            }
            const savedEntries = await this.persistEntries(entries, manager);
            this.logger.log(`Successfully generated ${savedEntries.length} ledger entries for transaction ${transaction.id}`);
            return {
                status: 'SUCCESS',
                transactionId: transaction.id,
                entriesGenerated: savedEntries.length,
                entriesIds: savedEntries.map(e => e.id),
                balanceValidated: true,
                errors,
                executedAt: new Date(),
                executionTimeMs: Date.now() - startTime,
            };
        }
        catch (err) {
            this.logger.error(`Error generating ledger entries: ${err.message}`, err.stack);
            errors.push({
                code: 'INTERNAL_ERROR',
                message: err.message,
                severity: 'ERROR',
                phase: 'PERSISTENCE',
            });
            return {
                status: 'REJECTED',
                transactionId: transaction.id,
                errors,
                executedAt: new Date(),
                executionTimeMs: Date.now() - startTime,
            };
        }
    }
    async preValidateTransaction(transaction, companyId) {
        const errors = [];
        const existingEntries = await this.ledgerRepo.find({
            where: { transactionId: transaction.id },
        });
        if (existingEntries.length > 0) {
            errors.push({
                code: 'DUPLICATE_ENTRIES',
                message: `Ledger entries already exist for transaction ${transaction.id}`,
                severity: 'ERROR',
                phase: 'VALIDATION',
            });
            return errors;
        }
        if (transaction.metadata?.bankToCashTransfer === true) {
            const bankBalance = await this.getAccountBalance('1.1.02', transaction.createdAt, transaction.branchId);
            if (bankBalance < transaction.total) {
                errors.push({
                    code: 'INSUFFICIENT_BANK_BALANCE',
                    message: `Insufficient bank balance. Required: ${transaction.total}, Available: ${bankBalance}`,
                    severity: 'ERROR',
                    phase: 'VALIDATION',
                });
            }
        }
        if (transaction.transactionType === transaction_entity_1.TransactionType.CASH_SESSION_OPENING) {
            const cashBalance = await this.getAccountBalance('1.1.01', transaction.createdAt, transaction.branchId);
            if (cashBalance < transaction.total) {
                errors.push({
                    code: 'INSUFFICIENT_CASH_FOR_SESSION',
                    message: `Insufficient cash balance for session. Required: ${transaction.total}, Available: ${cashBalance}`,
                    severity: 'ERROR',
                    phase: 'VALIDATION',
                });
            }
        }
        if (transaction.transactionType === transaction_entity_1.TransactionType.PAYMENT_IN && transaction.customerId) {
            const customerDebt = await this.getPersonBalance(transaction.customerId, 'CUSTOMER', transaction.branchId);
            if (transaction.total > customerDebt) {
                errors.push({
                    code: 'PAYMENT_EXCEEDS_DEBT',
                    message: `Payment exceeds customer debt. Payment: ${transaction.total}, Debt: ${customerDebt}`,
                    severity: 'ERROR',
                    phase: 'VALIDATION',
                });
            }
        }
        if (transaction.transactionType === transaction_entity_1.TransactionType.PAYMENT_OUT && transaction.supplierId) {
            const supplierDebt = await this.getPersonBalance(transaction.supplierId, 'SUPPLIER', transaction.branchId);
            if (transaction.total > supplierDebt) {
                errors.push({
                    code: 'PAYMENT_EXCEEDS_DEBT',
                    message: `Payment exceeds supplier debt. Payment: ${transaction.total}, Debt: ${supplierDebt}`,
                    severity: 'ERROR',
                    phase: 'VALIDATION',
                });
            }
        }
        return errors;
    }
    async matchRules(transaction, companyId) {
        const rules = await this.rulesRepo.find({
            where: {
                companyId,
                transactionType: transaction.transactionType,
                isActive: true,
            },
            order: { priority: 'ASC' },
        });
        return rules.filter(rule => {
            if (rule.expenseCategoryId && rule.expenseCategoryId !== transaction.expenseCategoryId) {
                return false;
            }
            if (rule.paymentMethod && rule.paymentMethod !== transaction.paymentMethod) {
                return false;
            }
            return true;
        });
    }
    async calculateEntries(transaction, rules, personId) {
        if (transaction.transactionType === transaction_entity_1.TransactionType.PAYROLL) {
            return this.generatePayrollEntries(transaction, personId);
        }
        if (transaction.transactionType === transaction_entity_1.TransactionType.PAYMENT_EXECUTION) {
            return this.generatePaymentExecutionEntries(transaction, personId);
        }
        const entries = [];
        for (const rule of rules) {
            if (rule.appliesTo === accounting_rule_entity_1.RuleScope.TRANSACTION) {
                entries.push({
                    transactionId: transaction.id,
                    accountId: rule.debitAccountId,
                    personId: personId,
                    entryDate: transaction.createdAt,
                    description: this.generateDescription(transaction, rule, 'DEBIT'),
                    debit: this.getTransactionAmount(transaction, rule),
                    credit: 0,
                    metadata: { ruleId: rule.id, scope: accounting_rule_entity_1.RuleScope.TRANSACTION },
                }, {
                    transactionId: transaction.id,
                    accountId: rule.creditAccountId,
                    personId: personId,
                    entryDate: transaction.createdAt,
                    description: this.generateDescription(transaction, rule, 'CREDIT'),
                    debit: 0,
                    credit: this.getTransactionAmount(transaction, rule),
                    metadata: { ruleId: rule.id, scope: accounting_rule_entity_1.RuleScope.TRANSACTION },
                });
            }
            else if (rule.appliesTo === accounting_rule_entity_1.RuleScope.TRANSACTION_LINE) {
                if (transaction.lines && transaction.lines.length > 0) {
                    for (const line of transaction.lines) {
                        if (rule.taxId && rule.taxId !== line.taxId) {
                            continue;
                        }
                        entries.push({
                            transactionId: transaction.id,
                            accountId: rule.debitAccountId,
                            personId: personId,
                            entryDate: transaction.createdAt,
                            description: this.generateDescription(transaction, rule, 'DEBIT', line),
                            debit: this.getLineAmount(line, rule),
                            credit: 0,
                            metadata: { ruleId: rule.id, scope: accounting_rule_entity_1.RuleScope.TRANSACTION_LINE, lineId: line.id },
                        }, {
                            transactionId: transaction.id,
                            accountId: rule.creditAccountId,
                            personId: personId,
                            entryDate: transaction.createdAt,
                            description: this.generateDescription(transaction, rule, 'CREDIT', line),
                            debit: 0,
                            credit: this.getLineAmount(line, rule),
                            metadata: { ruleId: rule.id, scope: accounting_rule_entity_1.RuleScope.TRANSACTION_LINE, lineId: line.id },
                        });
                    }
                }
            }
        }
        return entries;
    }
    async generatePayrollEntries(transaction, personId) {
        const entries = [];
        const metadata = transaction.metadata;
        if (!metadata?.lines || !Array.isArray(metadata.lines)) {
            this.logger.warn(`PAYROLL transaction ${transaction.id} has no lines in metadata`);
            return entries;
        }
        const accountMap = await this.getPayrollAccountMap();
        let totalEarnings = 0;
        let totalLiabilities = 0;
        for (const line of metadata.lines) {
            const { typeId, amount } = line;
            if (amount > 0) {
                const expenseAccountId = this.mapPayrollTypeToExpenseAccount(typeId, accountMap);
                entries.push({
                    transactionId: transaction.id,
                    accountId: expenseAccountId,
                    personId: personId,
                    entryDate: transaction.createdAt,
                    description: `Remuneración - ${this.getPayrollTypeName(typeId)}`,
                    debit: amount,
                    credit: 0,
                    metadata: { payrollLine: typeId, lineAmount: amount },
                });
                totalEarnings += amount;
            }
            else if (amount < 0) {
                const liabilityAccountId = this.mapPayrollTypeToLiabilityAccount(typeId, accountMap);
                const absAmount = Math.abs(amount);
                entries.push({
                    transactionId: transaction.id,
                    accountId: liabilityAccountId,
                    personId: personId,
                    entryDate: transaction.createdAt,
                    description: `Retención - ${this.getPayrollTypeName(typeId)}`,
                    debit: 0,
                    credit: absAmount,
                    metadata: { payrollLine: typeId, lineAmount: amount },
                });
                totalLiabilities += absAmount;
            }
        }
        const netPayment = totalEarnings - totalLiabilities;
        if (netPayment > 0) {
            entries.push({
                transactionId: transaction.id,
                accountId: accountMap['2.2.01'],
                personId: personId,
                entryDate: transaction.createdAt,
                description: 'Líquido a pagar',
                debit: 0,
                credit: netPayment,
                metadata: { netPayment: true },
            });
        }
        this.logger.log(`Generated ${entries.length} payroll entries for transaction ${transaction.id}. ` +
            `Earnings: ${totalEarnings}, Deductions: ${totalLiabilities}, Net: ${netPayment}`);
        return entries;
    }
    async getPayrollAccountMap() {
        const codes = ['5.3.01', '5.3.03', '2.2.01', '2.2.02', '2.2.03', '2.2.04'];
        const accounts = await this.accountRepo.find({
            where: { code: (0, typeorm_2.In)(codes) },
        });
        const map = {};
        for (const account of accounts) {
            map[account.code] = account.id;
        }
        const missingCodes = codes.filter(code => !map[code]);
        if (missingCodes.length > 0) {
            throw new common_1.BadRequestException(`Las siguientes cuentas contables no existen: ${missingCodes.join(', ')}`);
        }
        return map;
    }
    mapPayrollTypeToExpenseAccount(typeId, accountMap) {
        if (typeId === 'BASE_SALARY' ||
            typeId === 'ORDINARY' ||
            typeId === 'PROPORTIONAL') {
            return accountMap['5.3.01'];
        }
        return accountMap['5.3.03'];
    }
    mapPayrollTypeToLiabilityAccount(typeId, accountMap) {
        if (typeId === 'AFP') {
            return accountMap['2.2.02'];
        }
        if (typeId === 'HEALTH_INSURANCE') {
            return accountMap['2.2.03'];
        }
        return accountMap['2.2.04'];
    }
    getPayrollTypeName(typeId) {
        const names = {
            BASE_SALARY: 'Sueldo base',
            ORDINARY: 'Remuneración ordinaria',
            PROPORTIONAL: 'Remuneración proporcional',
            OVERTIME: 'Horas extraordinarias',
            BONUS: 'Bono',
            ALLOWANCE: 'Asignación',
            GRATIFICATION: 'Gratificación',
            VIATICUM: 'Viático',
            REFUND: 'Reembolso de gastos',
            SUBSTITUTION: 'Suplencia o reemplazo',
            INCENTIVE: 'Incentivo o desempeño',
            COMMISSION: 'Comisión',
            ADJUSTMENT_POS: 'Ajuste o retroactivo (+)',
            FEES: 'Pago de honorarios',
            SETTLEMENT: 'Finiquito',
            INDEMNITY: 'Indemnización',
            SPECIAL_SHIFT: 'Pago por turno especial',
            HOLIDAY: 'Pago por trabajo en festivo',
            NIGHT_SHIFT: 'Pago por trabajo nocturno',
            EXCEPTIONAL: 'Pago excepcional',
            AFP: 'AFP',
            HEALTH_INSURANCE: 'Salud',
            INCOME_TAX: 'Impuesto único',
            UNEMPLOYMENT_INSURANCE: 'Seguro de cesantía',
            LOAN_PAYMENT: 'Pago de préstamo',
            ADVANCE_PAYMENT: 'Anticipo de sueldo',
            UNION_FEE: 'Cuota sindical',
            COURT_ORDER: 'Descuento judicial',
            DEDUCTION_EXTRA: 'Descuento extraordinario',
            ADJUSTMENT_NEG: 'Ajuste o retroactivo (-)',
        };
        return names[typeId] || typeId;
    }
    async generatePaymentExecutionEntries(transaction, personId) {
        const entries = [];
        const accountMap = await this.getPaymentExecutionAccountMap();
        const payrollLineType = transaction.metadata?.payrollLineType;
        let liabilityAccountId;
        let liabilityAccountName;
        if (payrollLineType === 'EMPLOYEE_PAYMENT') {
            liabilityAccountId = accountMap['2.2.01'];
            liabilityAccountName = 'Remuneraciones por pagar';
        }
        else if (payrollLineType === 'AFP') {
            liabilityAccountId = accountMap['2.2.02'];
            liabilityAccountName = 'AFP por pagar';
        }
        else if (payrollLineType === 'HEALTH_INSURANCE') {
            liabilityAccountId = accountMap['2.2.03'];
            liabilityAccountName = 'Salud por pagar';
        }
        else if (payrollLineType === 'INCOME_TAX' || payrollLineType === 'TAX') {
            liabilityAccountId = accountMap['2.2.04'];
            liabilityAccountName = 'Impuestos por pagar';
        }
        else {
            liabilityAccountId = accountMap['2.2.04'];
            liabilityAccountName = 'Otras retenciones por pagar';
        }
        const cashAccountId = this.getCashAccountForPaymentMethod(transaction.paymentMethod, accountMap);
        const cashAccountName = transaction.paymentMethod === transaction_entity_1.PaymentMethod.CASH
            ? 'Caja'
            : 'Banco';
        entries.push({
            transactionId: transaction.id,
            accountId: liabilityAccountId,
            personId: personId,
            entryDate: transaction.createdAt,
            description: `Pago de ${liabilityAccountName}`,
            debit: transaction.total,
            credit: 0,
            metadata: {
                paymentType: payrollLineType,
                paymentMethod: transaction.paymentMethod,
                relatedPaymentOutId: transaction.relatedTransactionId,
            },
        });
        entries.push({
            transactionId: transaction.id,
            accountId: cashAccountId,
            personId: personId,
            entryDate: transaction.createdAt,
            description: `Pago vía ${cashAccountName}`,
            debit: 0,
            credit: transaction.total,
            metadata: {
                paymentType: payrollLineType,
                paymentMethod: transaction.paymentMethod,
                relatedPaymentOutId: transaction.relatedTransactionId,
            },
        });
        this.logger.log(`Generated ${entries.length} payment execution entries for transaction ${transaction.id}. ` +
            `Liability: ${liabilityAccountName}, Amount: ${transaction.total}`);
        return entries;
    }
    async getPaymentExecutionAccountMap() {
        const codes = ['1.1.01', '1.1.02', '2.2.01', '2.2.02', '2.2.03', '2.2.04'];
        const accounts = await this.accountRepo.find({
            where: { code: (0, typeorm_2.In)(codes) },
        });
        const map = {};
        for (const account of accounts) {
            map[account.code] = account.id;
        }
        const missingCodes = codes.filter(code => !map[code]);
        if (missingCodes.length > 0) {
            throw new common_1.BadRequestException(`Las siguientes cuentas contables no existen: ${missingCodes.join(', ')}. ` +
                `Ejecute las migraciones de cuentas contables.`);
        }
        return map;
    }
    getCashAccountForPaymentMethod(paymentMethod, accountMap) {
        if (paymentMethod === transaction_entity_1.PaymentMethod.CASH) {
            return accountMap['1.1.01'];
        }
        return accountMap['1.1.02'];
    }
    validateBalance(entries) {
        const totalDebit = this.sumDebits(entries);
        const totalCredit = this.sumCredits(entries);
        return Math.abs(totalDebit - totalCredit) < 0.01;
    }
    sumDebits(entries) {
        return entries.reduce((sum, e) => sum + e.debit, 0);
    }
    sumCredits(entries) {
        return entries.reduce((sum, e) => sum + e.credit, 0);
    }
    async persistEntries(entries, manager) {
        const repo = manager ? manager.getRepository(ledger_entry_entity_1.LedgerEntry) : this.ledgerRepo;
        const ledgerEntitiesToSave = entries.map(dto => repo.create({
            transactionId: dto.transactionId,
            accountId: dto.accountId,
            personId: dto.personId,
            entryDate: dto.entryDate,
            description: dto.description,
            debit: dto.debit,
            credit: dto.credit,
            metadata: dto.metadata,
        }));
        return repo.save(ledgerEntitiesToSave);
    }
    async getPersonIdForTransaction(transaction) {
        try {
            if (transaction.customerId) {
                const result = await Promise.race([
                    this.customerRepo
                        .createQueryBuilder('c')
                        .select('c.personId')
                        .where('c.id = :id', { id: transaction.customerId })
                        .getRawOne(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1000)),
                ]);
                return result?.personId || null;
            }
            if (transaction.supplierId) {
                const result = await Promise.race([
                    this.supplierRepo
                        .createQueryBuilder('s')
                        .select('s.personId')
                        .where('s.id = :id', { id: transaction.supplierId })
                        .getRawOne(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1000)),
                ]);
                return result?.personId || null;
            }
            if (transaction.shareholderId) {
                const result = await Promise.race([
                    this.shareholderRepo
                        .createQueryBuilder('sh')
                        .select('sh.personId')
                        .where('sh.id = :id', { id: transaction.shareholderId })
                        .getRawOne(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1000)),
                ]);
                return result?.personId || null;
            }
            if (transaction.employeeId) {
                const result = await Promise.race([
                    this.employeeRepo
                        .createQueryBuilder('e')
                        .select('e.personId')
                        .where('e.id = :id', { id: transaction.employeeId })
                        .getRawOne(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1000)),
                ]);
                return result?.personId || null;
            }
        }
        catch (error) {
            this.logger.warn(`Could not resolve personId (non-critical): ${error.message}`);
            return null;
        }
        return null;
    }
    getTransactionAmount(transaction, _rule) {
        return transaction.total;
    }
    getLineAmount(line, _rule) {
        return line.total;
    }
    generateDescription(transaction, _rule, side, line) {
        let desc = `${transaction.transactionType}`;
        if (transaction.customerId) {
            desc += ` - Cliente`;
        }
        else if (transaction.supplierId) {
            desc += ` - Proveedor`;
        }
        if (line) {
            desc += ` - ${line.productName}`;
        }
        desc += ` (${side})`;
        return desc;
    }
    async getAccountBalance(accountId, beforeDate, _companyId) {
        try {
            const result = await this.ledgerRepo
                .createQueryBuilder('le')
                .select('COALESCE(SUM(le.debit), 0) - COALESCE(SUM(le.credit), 0)', 'balance')
                .where('le.accountId = :accountId', { accountId })
                .andWhere('le.entryDate <= :beforeDate', { beforeDate })
                .getRawOne();
            return result ? Number(result.balance) : 0;
        }
        catch (err) {
            this.logger.error(`Error calculating account balance: ${err.message}`);
            return 0;
        }
    }
    async getPersonBalance(personId, personType, _companyId) {
        try {
            const result = await this.ledgerRepo
                .createQueryBuilder('le')
                .select('COALESCE(SUM(le.debit), 0) - COALESCE(SUM(le.credit), 0)', 'balance')
                .where('le.personId = :personId', { personId })
                .getRawOne();
            return result ? Number(result.balance) : 0;
        }
        catch (err) {
            this.logger.error(`Error calculating person balance (${personType}): ${err.message}`);
            return 0;
        }
    }
};
exports.LedgerEntriesService = LedgerEntriesService;
exports.LedgerEntriesService = LedgerEntriesService = LedgerEntriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ledger_entry_entity_1.LedgerEntry)),
    __param(1, (0, typeorm_1.InjectRepository)(accounting_rule_entity_1.AccountingRule)),
    __param(2, (0, typeorm_1.InjectRepository)(accounting_account_entity_1.AccountingAccount)),
    __param(3, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(4, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __param(5, (0, typeorm_1.InjectRepository)(shareholder_entity_1.Shareholder)),
    __param(6, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LedgerEntriesService);
//# sourceMappingURL=ledger-entries.service.js.map