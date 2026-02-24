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
exports.BankMovementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("../../companies/domain/company.entity");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
let BankMovementsService = class BankMovementsService {
    constructor(transactionRepository, companyRepository) {
        this.transactionRepository = transactionRepository;
        this.companyRepository = companyRepository;
    }
    async getOverview() {
        const { movements, bankAccountMap } = await this.buildMovementList();
        const recentMovements = movements.slice(0, 25);
        const now = new Date();
        const monthStart = new Date(now);
        monthStart.setDate(monthStart.getDate() - 30);
        const monthMovements = movements.filter((movement) => new Date(movement.createdAt).getTime() >= monthStart.getTime());
        const incomingTotal = monthMovements
            .filter((movement) => movement.direction === 'IN')
            .reduce((acc, movement) => acc + Number(movement.total || 0), 0);
        const outgoingTotal = monthMovements
            .filter((movement) => movement.direction === 'OUT')
            .reduce((acc, movement) => acc + Number(movement.total || 0), 0);
        const bankAccountsBalance = Array.from(bankAccountMap.values()).reduce((acc, account) => {
            const balance = Number(account.balance ?? 0);
            return Number.isFinite(balance) ? acc + balance : acc;
        }, 0);
        const projectedBalance = bankAccountsBalance + incomingTotal - outgoingTotal;
        return {
            summary: {
                projectedBalance,
                incomingTotal,
                outgoingTotal,
            },
            monthMovements,
            recentMovements,
        };
    }
    async list() {
        const { movements } = await this.buildMovementList();
        return movements;
    }
    async create() {
        return { success: true };
    }
    async buildMovementList() {
        const [transactions, bankAccountMap] = await Promise.all([
            this.transactionRepository.find({
                where: [
                    { bankAccountKey: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()) },
                    { transactionType: transaction_entity_1.TransactionType.SALE, paymentMethod: transaction_entity_1.PaymentMethod.TRANSFER },
                    { transactionType: transaction_entity_1.TransactionType.PAYMENT_IN, paymentMethod: transaction_entity_1.PaymentMethod.TRANSFER },
                ],
                relations: {
                    shareholder: { person: true },
                    customer: { person: true },
                    supplier: { person: true },
                    employee: { person: true },
                },
                order: { createdAt: 'DESC' },
                take: 200,
            }),
            this.loadBankAccountsMap(),
        ]);
        const movements = transactions.map((transaction) => {
            const movementKind = this.resolveMovementKind(transaction);
            const direction = this.resolveDirection(movementKind, transaction);
            const paymentDetails = Array.isArray(transaction.metadata?.paymentDetails)
                ? transaction.metadata.paymentDetails
                : [];
            const transferPayment = paymentDetails.find((payment) => payment?.paymentMethod === transaction_entity_1.PaymentMethod.TRANSFER && payment?.bankAccountId);
            const bankAccountKey = transaction.bankAccountKey || transferPayment?.bankAccountId || null;
            const accountInfo = bankAccountKey
                ? bankAccountMap.get(bankAccountKey)
                : undefined;
            const counterpartyName = this.resolveCounterpartyName(transaction);
            return {
                id: transaction.id,
                createdAt: transaction.createdAt,
                documentNumber: transaction.documentNumber,
                movementKind,
                direction,
                total: Number(transaction.total || 0),
                bankAccountKey,
                bankAccountLabel: accountInfo?.label ?? null,
                bankAccountNumber: accountInfo?.accountNumber ?? null,
                bankAccountBalance: accountInfo?.balance ?? null,
                counterpartyName: counterpartyName ?? null,
                notes: transaction.notes ?? null,
            };
        });
        return { movements, bankAccountMap };
    }
    async loadBankAccountsMap() {
        const map = new Map();
        const company = await this.companyRepository.findOne({
            where: { isActive: true },
            order: { createdAt: 'ASC' },
        });
        const accounts = company?.bankAccounts ?? [];
        for (const account of accounts) {
            if (!account?.accountKey) {
                continue;
            }
            const parts = [];
            if (account.bankName)
                parts.push(account.bankName);
            if (account.accountType)
                parts.push(account.accountType);
            if (account.accountNumber)
                parts.push(account.accountNumber);
            const label = parts.length > 0 ? parts.join(' · ') : 'Cuenta bancaria';
            map.set(account.accountKey, {
                label,
                accountNumber: account.accountNumber ?? null,
                balance: account.currentBalance ?? null,
            });
        }
        return map;
    }
    resolveMovementKind(transaction) {
        if (transaction.metadata?.capitalContribution) {
            return 'CAPITAL_CONTRIBUTION';
        }
        if (transaction.metadata?.bankToCashTransfer) {
            return 'BANK_TO_CASH_TRANSFER';
        }
        switch (transaction.transactionType) {
            case transaction_entity_1.TransactionType.PAYMENT_IN:
                return 'CUSTOMER_PAYMENT';
            case transaction_entity_1.TransactionType.PAYMENT_OUT:
                return 'SUPPLIER_PAYMENT';
            case transaction_entity_1.TransactionType.SUPPLIER_PAYMENT:
                return 'SUPPLIER_PAYMENT';
            case transaction_entity_1.TransactionType.EXPENSE_PAYMENT:
                return 'OPERATING_EXPENSE';
            case transaction_entity_1.TransactionType.PAYMENT_EXECUTION:
                return 'SUPPLIER_PAYMENT';
            case transaction_entity_1.TransactionType.OPERATING_EXPENSE:
                return 'OPERATING_EXPENSE';
            case transaction_entity_1.TransactionType.CASH_DEPOSIT:
                return 'CASH_DEPOSIT';
            case transaction_entity_1.TransactionType.BANK_WITHDRAWAL_TO_SHAREHOLDER:
                return 'BANK_WITHDRAWAL_TO_SHAREHOLDER';
            default:
                return 'GENERAL';
        }
    }
    resolveDirection(movementKind, transaction) {
        switch (movementKind) {
            case 'CAPITAL_CONTRIBUTION':
            case 'CUSTOMER_PAYMENT':
            case 'CASH_DEPOSIT':
                return 'IN';
            case 'SUPPLIER_PAYMENT':
            case 'OPERATING_EXPENSE':
            case 'BANK_WITHDRAWAL_TO_SHAREHOLDER':
            case 'BANK_TO_CASH_TRANSFER':
                return 'OUT';
            default:
                return Number(transaction.total || 0) >= 0 ? 'IN' : 'OUT';
        }
    }
    resolveCounterpartyName(transaction) {
        const person = transaction.shareholder?.person ??
            transaction.customer?.person ??
            transaction.supplier?.person ??
            transaction.employee?.person ??
            null;
        if (!person) {
            return null;
        }
        const businessName = person.businessName?.trim();
        if (businessName) {
            return businessName;
        }
        return [person.firstName, person.lastName].filter(Boolean).join(' ').trim() || null;
    }
};
exports.BankMovementsService = BankMovementsService;
exports.BankMovementsService = BankMovementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BankMovementsService);
//# sourceMappingURL=bank-movements.service.js.map