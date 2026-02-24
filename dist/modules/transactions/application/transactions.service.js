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
var TransactionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("../domain/transaction.entity");
const transaction_line_entity_1 = require("../../transaction-lines/domain/transaction-line.entity");
const branch_entity_1 = require("../../branches/domain/branch.entity");
const customer_entity_1 = require("../../customers/domain/customer.entity");
const ledger_entries_service_1 = require("../../ledger-entries/application/ledger-entries.service");
const transaction_created_event_1 = require("../../../shared/events/transaction-created.event");
const document_prefixes_1 = require("../../../shared/enums/document-prefixes");
const accounting_periods_service_1 = require("../../accounting-periods/application/accounting-periods.service");
let TransactionsService = TransactionsService_1 = class TransactionsService {
    constructor(transactionsRepository, branchRepository, dataSource, ledgerService, eventEmitter, accountingPeriodsService) {
        this.transactionsRepository = transactionsRepository;
        this.branchRepository = branchRepository;
        this.dataSource = dataSource;
        this.ledgerService = ledgerService;
        this.eventEmitter = eventEmitter;
        this.accountingPeriodsService = accountingPeriodsService;
        this.logger = new common_1.Logger(TransactionsService_1.name);
    }
    async getTotalSalesForSession(cashSessionId) {
        const sales = await this.transactionsRepository.find({
            where: { cashSessionId, transactionType: transaction_entity_1.TransactionType.SALE },
        });
        return sales.reduce((sum, tx) => sum + Number(tx.total || 0), 0);
    }
    async getMovementsForSession(cashSessionId) {
        const txs = await this.transactionsRepository.find({
            where: { cashSessionId },
            relations: ['user', 'user.person'],
            order: { createdAt: 'ASC' },
        });
        return txs.map(tx => {
            const userFullName = tx.user?.person ?
                `${tx.user.person.firstName} ${tx.user.person.lastName}` : null;
            const userUserName = tx.user?.userName || null;
            return {
                id: tx.id,
                transactionType: tx.transactionType,
                documentNumber: tx.documentNumber,
                createdAt: tx.createdAt,
                total: Number(tx.total || 0),
                paymentMethod: tx.paymentMethod,
                paymentMethodLabel: undefined,
                userId: tx.userId || null,
                userFullName,
                userUserName,
                notes: tx.notes || null,
                reason: tx.metadata?.reason || null,
                metadata: tx.metadata || null,
                direction: this.computeDirection(tx),
            };
        });
    }
    computeDirection(tx) {
        switch (tx.transactionType) {
            case transaction_entity_1.TransactionType.CASH_SESSION_OPENING:
                return 'NEUTRAL';
            case transaction_entity_1.TransactionType.SALE:
            case transaction_entity_1.TransactionType.CASH_SESSION_DEPOSIT:
            case transaction_entity_1.TransactionType.PAYMENT_IN:
                return 'IN';
            case transaction_entity_1.TransactionType.CASH_SESSION_WITHDRAWAL:
            case transaction_entity_1.TransactionType.OPERATING_EXPENSE:
            case transaction_entity_1.TransactionType.PAYMENT_OUT:
            case transaction_entity_1.TransactionType.CASH_DEPOSIT:
                return 'OUT';
            default:
                return 'NEUTRAL';
        }
    }
    async createTransaction(dto) {
        const validationErrors = dto.validate();
        if (validationErrors.length > 0) {
            throw new common_1.BadRequestException(`Validación fallida: ${validationErrors.join('; ')}`);
        }
        const branch = await this.branchRepository.findOne({
            where: { id: dto.branchId },
        });
        if (!branch || !branch.companyId) {
            throw new common_1.BadRequestException(`Branch ${dto.branchId} not found or has no company. Cannot generate ledger entries.`);
        }
        const companyId = branch.companyId;
        const transactionDate = new Date().toISOString().split('T')[0];
        const accountingPeriod = await this.accountingPeriodsService.ensurePeriod(transactionDate, companyId);
        this.logger.log(`Transaction will use accounting period: ${accountingPeriod.name} ` +
            `(${accountingPeriod.id}) - Status: ${accountingPeriod.status}`);
        return this.dataSource.transaction(async (manager) => {
            try {
                const documentNumber = await this.generateDocumentNumber(dto.branchId, dto.transactionType);
                const transactionData = {
                    documentNumber,
                    transactionType: dto.transactionType,
                    status: transaction_entity_1.TransactionStatus.CONFIRMED,
                    branchId: dto.branchId,
                    userId: dto.userId,
                    pointOfSaleId: dto.pointOfSaleId || null,
                    cashSessionId: dto.cashSessionId || null,
                    storageId: dto.storageId || null,
                    targetStorageId: dto.targetStorageId || null,
                    customerId: dto.customerId || null,
                    supplierId: dto.supplierId || null,
                    shareholderId: dto.shareholderId || null,
                    employeeId: dto.employeeId || null,
                    expenseCategoryId: dto.expenseCategoryId || null,
                    resultCenterId: dto.resultCenterId || null,
                    accountingPeriodId: accountingPeriod.id,
                    subtotal: dto.subtotal,
                    taxAmount: dto.taxAmount,
                    discountAmount: dto.discountAmount,
                    total: dto.total,
                    paymentMethod: dto.paymentMethod,
                    paymentStatus: dto.paymentStatus,
                    bankAccountKey: dto.bankAccountKey || null,
                    documentType: dto.documentType || null,
                    documentFolio: dto.documentFolio || null,
                    paymentDueDate: dto.paymentDueDate ? new Date(dto.paymentDueDate) : null,
                    amountPaid: dto.amountPaid,
                    changeAmount: dto.changeAmount || null,
                    relatedTransactionId: dto.relatedTransactionId || null,
                    externalReference: dto.externalReference || null,
                    notes: dto.notes || null,
                    metadata: dto.metadata || {},
                };
                const saveRepository = manager.getRepository(transaction_entity_1.Transaction);
                const savedTx = await saveRepository.save(transactionData);
                this.logger.log(`Transaction created: ${savedTx.id} (${savedTx.documentNumber}) ` +
                    `type: ${savedTx.transactionType}`);
                if (dto.lines && dto.lines.length > 0) {
                    const lineRepo = manager.getRepository(transaction_line_entity_1.TransactionLine);
                    const lineEntities = dto.lines.map((line, index) => lineRepo.create({
                        transactionId: savedTx.id,
                        productId: line.productId,
                        productVariantId: line.productVariantId,
                        unitId: line.unitId,
                        taxId: line.taxId,
                        lineNumber: index + 1,
                        productName: line.productName,
                        productSku: line.productSku,
                        variantName: line.variantName,
                        quantity: line.quantity,
                        unitPrice: line.unitPrice,
                        unitCost: line.unitCost,
                        discountPercentage: line.discountPercentage,
                        discountAmount: line.discountAmount,
                        taxRate: line.taxRate,
                        taxAmount: line.taxAmount,
                        subtotal: line.subtotal,
                        total: line.total,
                        notes: line.notes,
                    }));
                    await lineRepo.save(lineEntities);
                }
                if (savedTx.transactionType === transaction_entity_1.TransactionType.SALE && savedTx.customerId) {
                    const paymentDetails = Array.isArray(savedTx.metadata?.paymentDetails)
                        ? savedTx.metadata?.paymentDetails
                        : [];
                    let internalCreditAmount = paymentDetails
                        .filter((p) => p?.paymentMethod === transaction_entity_1.PaymentMethod.INTERNAL_CREDIT)
                        .reduce((sum, p) => sum + Number(p?.amount || 0), 0);
                    if (internalCreditAmount <= 0 && savedTx.paymentMethod === transaction_entity_1.PaymentMethod.INTERNAL_CREDIT) {
                        internalCreditAmount = Number(savedTx.total || 0);
                    }
                    if (internalCreditAmount > 0) {
                        const customerRepo = manager.getRepository(customer_entity_1.Customer);
                        const customer = await customerRepo.findOne({ where: { id: savedTx.customerId } });
                        if (customer) {
                            const currentBalance = Number(customer.currentBalance || 0);
                            customer.currentBalance = currentBalance + internalCreditAmount;
                            await customerRepo.save(customer);
                        }
                    }
                }
                this.eventEmitter.emit('transaction.created', new transaction_created_event_1.TransactionCreatedEvent(savedTx, companyId));
                this.logger.log(`Event emitted: 'transaction.created' for transaction ${savedTx.id}. ` +
                    `Accounting engine will process automatically.`);
                return savedTx;
            }
            catch (error) {
                this.logger.error(`Error creating transaction: ${error.message}`);
                throw error;
            }
        });
    }
    async generateDocumentNumber(branchId, txType) {
        const prefix = document_prefixes_1.DOCUMENT_PREFIXES[txType];
        const branchCode = branchId.substring(0, 8).toUpperCase();
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${branchCode}-${timestamp}-${random}`;
    }
    async search(dto) {
        const page = Math.max(Number(dto.page ?? 1), 1);
        const limit = Math.min(Math.max(Number(dto.limit ?? 25), 1), 200);
        const qb = this.transactionsRepository
            .createQueryBuilder('t')
            .leftJoinAndSelect('t.branch', 'branch')
            .leftJoinAndSelect('t.pointOfSale', 'pointOfSale')
            .leftJoinAndSelect('t.cashSession', 'cashSession')
            .leftJoinAndSelect('t.customer', 'customer')
            .leftJoinAndSelect('customer.person', 'customerPerson')
            .leftJoinAndSelect('t.supplier', 'supplier')
            .leftJoinAndSelect('supplier.person', 'supplierPerson')
            .leftJoinAndSelect('t.expenseCategory', 'expenseCategory')
            .leftJoinAndSelect('t.resultCenter', 'resultCenter')
            .leftJoinAndSelect('t.user', 'user')
            .leftJoinAndSelect('user.person', 'userPerson')
            .leftJoinAndSelect('t.relatedTransaction', 'relatedTxn');
        if (dto.type) {
            qb.andWhere('t.transactionType = :type', { type: dto.type });
        }
        if (dto.status) {
            qb.andWhere('t.status = :status', { status: dto.status });
        }
        if (dto.paymentMethod) {
            qb.andWhere('t.paymentMethod = :paymentMethod', { paymentMethod: dto.paymentMethod });
        }
        if (dto.branchId) {
            qb.andWhere('t.branchId = :branchId', { branchId: dto.branchId });
        }
        if (dto.pointOfSaleId) {
            qb.andWhere('t.pointOfSaleId = :pointOfSaleId', { pointOfSaleId: dto.pointOfSaleId });
        }
        if (dto.customerId) {
            qb.andWhere('t.customerId = :customerId', { customerId: dto.customerId });
        }
        if (dto.supplierId) {
            qb.andWhere('t.supplierId = :supplierId', { supplierId: dto.supplierId });
        }
        if (dto.customerId) {
            qb.andWhere('t.customerId = :customerId', { customerId: dto.customerId });
        }
        if (dto.supplierId) {
            qb.andWhere('t.supplierId = :supplierId', { supplierId: dto.supplierId });
        }
        if (dto.dateFrom) {
            const parsed = new Date(dto.dateFrom);
            if (!Number.isNaN(parsed.getTime())) {
                qb.andWhere('t.createdAt >= :dateFrom', { dateFrom: parsed });
            }
        }
        if (dto.dateTo) {
            const parsed = new Date(dto.dateTo);
            if (!Number.isNaN(parsed.getTime())) {
                qb.andWhere('t.createdAt <= :dateTo', { dateTo: parsed });
            }
        }
        if (dto.search) {
            const search = `%${dto.search.trim()}%`;
            qb.andWhere('(t.documentNumber LIKE :search OR t.externalReference LIKE :search)', { search });
        }
        qb.orderBy('t.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        return this.transactionsRepository.findOne({
            where: { id },
            relations: {
                branch: { company: true },
                pointOfSale: true,
                customer: { person: true },
                supplier: { person: true },
                employee: { person: true },
                user: { person: true },
                lines: true,
            },
        });
    }
    async completePayment(paymentId, data) {
        const payment = await this.transactionsRepository.findOne({
            where: { id: paymentId },
            relations: ['branch', 'branch.company'],
        });
        if (!payment) {
            throw new common_1.BadRequestException(`Payment ${paymentId} not found`);
        }
        if (payment.transactionType !== transaction_entity_1.TransactionType.PAYMENT_OUT) {
            throw new common_1.BadRequestException(`Transaction ${paymentId} is not a PAYMENT_OUT`);
        }
        if (payment.status === transaction_entity_1.TransactionStatus.CONFIRMED) {
            throw new common_1.ConflictException(`Payment ${paymentId} is already confirmed`);
        }
        const pendingAmount = Number(payment.total) - Number(payment.amountPaid);
        if (pendingAmount <= 0) {
            throw new common_1.ConflictException(`Payment ${paymentId} has no pending amount`);
        }
        const updatedMetadata = {
            ...(payment.metadata || {}),
            completedAt: new Date().toISOString(),
            supplierBankAccount: data.supplierBankAccount,
            companyBankAccount: data.companyBankAccount,
        };
        await this.transactionsRepository.update(paymentId, {
            amountPaid: payment.total,
            status: transaction_entity_1.TransactionStatus.CONFIRMED,
            paymentMethod: data.paymentMethod || payment.paymentMethod,
            bankAccountKey: data.bankAccountKey || payment.bankAccountKey,
            notes: data.note ? `${payment.notes || ''}\n${data.note}`.trim() : payment.notes,
            metadata: updatedMetadata,
        });
        this.logger.log(`Payment ${paymentId} marked as CONFIRMED. Amount: ${payment.total}`);
        const paymentMethod = data.paymentMethod || payment.paymentMethod;
        if (!payment.branchId) {
            throw new common_1.BadRequestException(`Payment ${paymentId} has no branchId`);
        }
        const executionDocNumber = await this.generateDocumentNumber(payment.branchId, transaction_entity_1.TransactionType.PAYMENT_EXECUTION);
        const paymentExecution = this.transactionsRepository.create({
            documentNumber: executionDocNumber,
            transactionType: transaction_entity_1.TransactionType.PAYMENT_EXECUTION,
            status: transaction_entity_1.TransactionStatus.CONFIRMED,
            branchId: payment.branchId,
            userId: payment.userId,
            relatedTransactionId: paymentId,
            supplierId: payment.supplierId,
            employeeId: payment.employeeId,
            total: payment.total,
            subtotal: payment.subtotal,
            taxAmount: 0,
            discountAmount: 0,
            paymentMethod: paymentMethod,
            amountPaid: payment.total,
            bankAccountKey: data.bankAccountKey || payment.bankAccountKey,
            accountingPeriodId: payment.accountingPeriodId,
            notes: data.note ? `Pago ejecutado: ${data.note}` : `Pago ejecutado de ${payment.documentNumber}`,
            metadata: {
                origin: 'PAYMENT_COMPLETION',
                paymentOutId: paymentId,
                paymentOutDocNumber: payment.documentNumber,
                supplierBankAccount: data.supplierBankAccount,
                companyBankAccount: data.companyBankAccount,
                completedAt: new Date().toISOString(),
                payrollLineType: payment.metadata?.payrollLineType,
                payrollTransactionId: payment.metadata?.payrollTransactionId,
            },
        });
        const savedExecution = await this.transactionsRepository.save(paymentExecution);
        this.logger.log(`Created PAYMENT_EXECUTION ${savedExecution.id} for PAYMENT_OUT ${paymentId}. Doc: ${executionDocNumber}`);
        if (payment.branch?.company?.id) {
            this.eventEmitter.emit('transaction.created', {
                transaction: savedExecution,
                companyId: payment.branch.company.id,
            });
            this.logger.log(`Emitted 'transaction.created' event for PAYMENT_EXECUTION ${savedExecution.id}. ` +
                `AccountingEngineListener will generate ledger entries automatically.`);
        }
        else {
            this.logger.warn(`Could not emit 'transaction.created' event for PAYMENT_EXECUTION ${savedExecution.id}: ` +
                `branch.company not loaded. Ledger entries will NOT be generated.`);
        }
        return this.findOne(paymentId);
    }
    async listJournal(dto) {
        const page = Math.max(Number(dto.page ?? 1), 1);
        const pageSize = Number(dto.pageSize ?? dto.limit ?? 25);
        const limit = Math.min(Math.max(pageSize, 1), 200);
        const offset = (page - 1) * limit;
        const whereConditions = [];
        const params = [];
        if (dto.type) {
            whereConditions.push(`t.transactionType = ?`);
            params.push(dto.type);
        }
        if (dto.status) {
            whereConditions.push(`t.status = ?`);
            params.push(dto.status);
        }
        if (dto.paymentMethod) {
            whereConditions.push(`t.paymentMethod = ?`);
            params.push(dto.paymentMethod);
        }
        if (dto.branchId) {
            whereConditions.push(`t.branchId = ?`);
            params.push(dto.branchId);
        }
        if (dto.dateFrom) {
            const parsed = new Date(dto.dateFrom);
            if (!Number.isNaN(parsed.getTime())) {
                whereConditions.push(`le.entryDate >= ?`);
                params.push(parsed);
            }
        }
        if (dto.dateTo) {
            const parsed = new Date(dto.dateTo);
            if (!Number.isNaN(parsed.getTime())) {
                whereConditions.push(`le.entryDate <= ?`);
                params.push(parsed);
            }
        }
        if (dto.search) {
            const search = `%${dto.search.trim()}%`;
            whereConditions.push(`(t.documentNumber LIKE ? OR t.externalReference LIKE ? OR t.notes LIKE ? OR aa.code LIKE ? OR aa.name LIKE ? OR le.description LIKE ?)`);
            params.push(search, search, search, search, search, search);
        }
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        const countQuery = `
      SELECT COUNT(DISTINCT le.id) as total
      FROM ledger_entries le
      JOIN transactions t ON le.transactionId = t.id
      JOIN accounting_accounts aa ON le.accountId = aa.id
      ${whereClause}
    `;
        const countResult = await this.dataSource.query(countQuery, params);
        const total = countResult[0]?.total || 0;
        const dataQuery = `
      SELECT
        le.id AS le_id,
        le.entryDate,
        t.documentNumber,
        t.notes,
        le.description AS le_description,
        aa.code,
        aa.name,
        le.debit,
        le.credit,
        t.customerId,
        t.supplierId,
        t.shareholderId,
        t.transactionType,
        t.status,
        t.createdAt,
        t.userId
      FROM ledger_entries le
      JOIN transactions t ON le.transactionId = t.id
      JOIN accounting_accounts aa ON le.accountId = aa.id
      ${whereClause}
      ORDER BY le.entryDate DESC, le.id DESC
      LIMIT ? OFFSET ?
    `;
        const dataParams = [...params, limit, offset];
        const results = await this.dataSource.query(dataQuery, dataParams);
        const txIds = Array.from(new Set(results.map((r) => r.t_id)));
        let txDetailsMap = new Map();
        if (txIds.length > 0) {
            const txDetails = await this.transactionsRepository.find({
                where: { id: (0, typeorm_2.In)(txIds) },
                relations: [
                    'branch',
                    'pointOfSale',
                    'customer',
                    'customer.person',
                    'supplier',
                    'supplier.person',
                    'employee',
                    'employee.person',
                    'shareholder',
                    'shareholder.person',
                    'user',
                    'user.person',
                ],
            });
            txDetails.forEach((tx) => {
                txDetailsMap.set(tx.id, tx);
            });
        }
        const rows = results.map((row) => {
            const tx = txDetailsMap.get(row.t_id);
            let entityName = '';
            if (row.customerId && tx?.customer?.person) {
                entityName = tx.customer.person.businessName ||
                    `${tx.customer.person.firstName || ''} ${tx.customer.person.lastName || ''}`.trim();
            }
            else if (row.supplierId && tx?.supplier?.person) {
                entityName = tx.supplier.person.businessName ||
                    `${tx.supplier.person.firstName || ''} ${tx.supplier.person.lastName || ''}`.trim();
            }
            else if (tx?.employee?.person) {
                entityName = tx.employee.person.businessName ||
                    `${tx.employee.person.firstName || ''} ${tx.employee.person.lastName || ''}`.trim();
            }
            else if (row.shareholderId && tx?.shareholder?.person) {
                entityName = tx.shareholder.person.businessName ||
                    `${tx.shareholder.person.firstName || ''} ${tx.shareholder.person.lastName || ''}`.trim();
            }
            let userName = '';
            if (tx?.user?.person) {
                userName = tx.user.person.businessName ||
                    `${tx.user.person.firstName || ''} ${tx.user.person.lastName || ''}`.trim() ||
                    tx.user.userName || '';
            }
            else if (tx?.user?.userName) {
                userName = tx.user.userName;
            }
            let description = row.notes || '';
            if (row.transactionType) {
                const typeLabel = this.translateTransactionType(row.transactionType);
                description = `${typeLabel}: ${description}`.trim();
            }
            if (row.le_description) {
                description = `${description} - ${row.le_description}`.trim();
            }
            return {
                id: row.le_id,
                entryDate: row.entryDate,
                documentNumber: row.documentNumber,
                description: description,
                accountCode: row.code,
                accountName: row.name,
                accountType: this.getAccountType(row.code),
                debit: row.debit ? parseFloat(row.debit) : 0,
                credit: row.credit ? parseFloat(row.credit) : 0,
                entityName: entityName,
                userName: userName,
                branchName: tx?.branch?.name || '',
                pointOfSaleName: tx?.pointOfSale?.name || '',
                transactionId: row.t_id,
                transactionStatus: row.status,
                transactionType: row.transactionType,
                createdAt: row.createdAt,
            };
        });
        return { rows, total, page, limit };
    }
    translateTransactionType(type) {
        const translations = {
            [transaction_entity_1.TransactionType.SALE]: 'Venta',
            [transaction_entity_1.TransactionType.PURCHASE]: 'Compra',
            [transaction_entity_1.TransactionType.PURCHASE_ORDER]: 'Orden de Compra',
            [transaction_entity_1.TransactionType.SALE_RETURN]: 'Devolución de Venta',
            [transaction_entity_1.TransactionType.PURCHASE_RETURN]: 'Devolución de Compra',
            [transaction_entity_1.TransactionType.TRANSFER_OUT]: 'Transferencia de Salida',
            [transaction_entity_1.TransactionType.TRANSFER_IN]: 'Transferencia de Entrada',
            [transaction_entity_1.TransactionType.ADJUSTMENT_IN]: 'Ajuste de Entrada',
            [transaction_entity_1.TransactionType.ADJUSTMENT_OUT]: 'Ajuste de Salida',
            [transaction_entity_1.TransactionType.PAYMENT_IN]: 'Ingreso',
            [transaction_entity_1.TransactionType.PAYMENT_OUT]: 'Egreso',
            [transaction_entity_1.TransactionType.SUPPLIER_PAYMENT]: 'Pago a Proveedor',
            [transaction_entity_1.TransactionType.EXPENSE_PAYMENT]: 'Pago de Gasto',
            [transaction_entity_1.TransactionType.PAYMENT_EXECUTION]: 'Ejecución de Pago',
            [transaction_entity_1.TransactionType.CASH_DEPOSIT]: 'Depósito en Caja',
            [transaction_entity_1.TransactionType.OPERATING_EXPENSE]: 'Gasto Operativo',
            [transaction_entity_1.TransactionType.CASH_SESSION_OPENING]: 'Apertura de Caja',
            [transaction_entity_1.TransactionType.CASH_SESSION_CLOSING]: 'Cierre de Caja',
            [transaction_entity_1.TransactionType.CASH_SESSION_WITHDRAWAL]: 'Retiro de Caja',
            [transaction_entity_1.TransactionType.CASH_SESSION_DEPOSIT]: 'Depósito a Caja',
            [transaction_entity_1.TransactionType.PAYROLL]: 'Nómina',
            [transaction_entity_1.TransactionType.BANK_WITHDRAWAL_TO_SHAREHOLDER]: 'Retiro Bancario a Socio',
        };
        return translations[type] || type;
    }
    getAccountType(accountCode) {
        if (!accountCode)
            return 'Otro';
        const firstDigit = accountCode.charAt(0);
        const types = {
            '1': 'Activo',
            '2': 'Pasivo',
            '3': 'Patrimonio',
            '4': 'Ingreso',
            '5': 'Gasto',
            '6': 'Costo',
        };
        return types[firstDigit] || 'Otro';
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = TransactionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(1, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        ledger_entries_service_1.LedgerEntriesService,
        event_emitter_1.EventEmitter2,
        accounting_periods_service_1.AccountingPeriodsService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map