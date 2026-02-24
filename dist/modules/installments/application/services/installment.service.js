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
exports.InstallmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const installment_entity_1 = require("../../domain/installment.entity");
const installment_repository_1 = require("../../infrastructure/installment.repository");
const transaction_entity_1 = require("../../../transactions/domain/transaction.entity");
const create_transaction_dto_1 = require("../../../transactions/application/dto/create-transaction.dto");
const transaction_entity_2 = require("../../../transactions/domain/transaction.entity");
const transactions_service_1 = require("../../../transactions/application/transactions.service");
let InstallmentService = class InstallmentService {
    constructor(repo, transactionsService, transactionsRepository) {
        this.repo = repo;
        this.transactionsService = transactionsService;
        this.transactionsRepository = transactionsRepository;
    }
    async getInstallmentsForSale(saleTransactionId) {
        return this.repo.getInstallmentsByTransaction(saleTransactionId);
    }
    async createInstallmentsFromSchedule(transactionId, schedule, options) {
        const totalInstallments = schedule.length;
        const installments = [];
        for (let i = 0; i < schedule.length; i += 1) {
            const item = schedule[i];
            const dueDate = item.dueDate instanceof Date ? item.dueDate : new Date(item.dueDate);
            const installment = this.repo.create({
                sourceType: options.sourceType,
                sourceTransactionId: transactionId,
                saleTransactionId: options.sourceType === installment_entity_1.InstallmentSourceType.SALE ? transactionId : undefined,
                payeeType: options.payeeType,
                payeeId: options.payeeId,
                installmentNumber: i + 1,
                totalInstallments,
                amount: Number(item.amount || 0),
                dueDate,
                status: installment_entity_1.InstallmentStatus.PENDING,
                amountPaid: 0,
                metadata: {
                    installmentNumber: i + 1,
                    totalInstallments,
                },
            });
            const saved = await this.repo.save(installment);
            installments.push(saved);
        }
        return installments;
    }
    resolvePaymentTransactionType(sourceType) {
        switch (sourceType) {
            case installment_entity_1.InstallmentSourceType.SALE:
                return transaction_entity_2.TransactionType.PAYMENT_IN;
            case installment_entity_1.InstallmentSourceType.PURCHASE:
                return transaction_entity_2.TransactionType.SUPPLIER_PAYMENT;
            case installment_entity_1.InstallmentSourceType.OPERATING_EXPENSE:
                return transaction_entity_2.TransactionType.EXPENSE_PAYMENT;
            case installment_entity_1.InstallmentSourceType.PAYROLL:
                return transaction_entity_2.TransactionType.PAYMENT_EXECUTION;
            default:
                return transaction_entity_2.TransactionType.PAYMENT_OUT;
        }
    }
    async createInstallmentsForTransaction(transactionId, totalAmount, numberOfInstallments, firstDueDate, sourceType) {
        const amountPerInstallment = totalAmount / numberOfInstallments;
        const installments = [];
        const type = sourceType || installment_entity_1.InstallmentSourceType.SALE;
        for (let i = 1; i <= numberOfInstallments; i++) {
            const dueDate = new Date(firstDueDate);
            dueDate.setMonth(dueDate.getMonth() + (i - 1));
            const installment = this.repo.create({
                sourceType: type,
                sourceTransactionId: transactionId,
                installmentNumber: i,
                totalInstallments: numberOfInstallments,
                amount: amountPerInstallment,
                dueDate,
                status: installment_entity_1.InstallmentStatus.PENDING,
                amountPaid: 0,
                saleTransactionId: type === installment_entity_1.InstallmentSourceType.SALE ? transactionId : undefined,
            });
            const saved = await this.repo.save(installment);
            installments.push(saved);
        }
        return installments;
    }
    async createSingleInstallment(transactionId, amount, dueDate, options) {
        const installment = this.repo.create({
            sourceType: options.sourceType,
            sourceTransactionId: transactionId,
            payeeType: options.payeeType,
            payeeId: options.payeeId,
            installmentNumber: 1,
            totalInstallments: 1,
            amount,
            dueDate,
            status: installment_entity_1.InstallmentStatus.PENDING,
            amountPaid: 0,
            metadata: options.metadata,
            saleTransactionId: options.sourceType === installment_entity_1.InstallmentSourceType.SALE ? transactionId : undefined,
        });
        const saved = await this.repo.save(installment);
        return saved;
    }
    async updateInstallmentFromPayment(installmentId, paymentAmount, paymentTransactionId) {
        const installment = await this.repo.findOneBy({ id: installmentId });
        if (!installment) {
            throw new Error('Installment not found');
        }
        installment.amountPaid = parseFloat(installment.amountPaid.toString()) + paymentAmount;
        installment.paymentTransactionId = paymentTransactionId;
        if (installment.amountPaid >= parseFloat(installment.amount.toString())) {
            installment.status = installment_entity_1.InstallmentStatus.PAID;
        }
        else if (parseFloat(installment.amountPaid.toString()) > 0) {
            installment.status = installment_entity_1.InstallmentStatus.PARTIAL;
        }
        if (installment.isOverdue() && installment.status === installment_entity_1.InstallmentStatus.PENDING) {
            installment.status = installment_entity_1.InstallmentStatus.OVERDUE;
        }
        return this.repo.save(installment);
    }
    async getInstallmentsByTransaction(transactionId) {
        return this.repo.getInstallmentsByTransaction(transactionId);
    }
    async getTransactionCarteraStatus(transactionId) {
        return this.repo.getTransactionCarteraStatus(transactionId);
    }
    async getCarteraByDueDate(fromDate, toDate) {
        const installments = await this.repo.getCarteraByDueDate(fromDate, toDate);
        const grouped = installments.reduce((acc, inst) => {
            const key = inst.dueDate.toISOString().split('T')[0];
            if (!acc[key]) {
                acc[key] = {
                    dueDate: inst.dueDate,
                    totalAmount: 0,
                    totalPaid: 0,
                    pendingAmount: 0,
                    installmentsCount: 0,
                };
            }
            acc[key].totalAmount += parseFloat(inst.amount.toString());
            acc[key].totalPaid += parseFloat(inst.amountPaid.toString());
            acc[key].pendingAmount += inst.getPendingAmount();
            acc[key].installmentsCount++;
            return acc;
        }, {});
        return Object.values(grouped);
    }
    async getOverdueReport(today = new Date()) {
        return this.repo.getOverdueSummary(today);
    }
    async getAccountsPayable(filters) {
        const queryBuilder = this.repo.createQueryBuilder('installment');
        queryBuilder.leftJoinAndSelect('installment.saleTransaction', 'transaction');
        queryBuilder.leftJoinAndMapOne('installment.sourceTransaction', transaction_entity_1.Transaction, 'sourceTransaction', 'sourceTransaction.id = installment.sourceTransactionId');
        queryBuilder.leftJoinAndSelect('installment.paymentTransaction', 'paymentTransaction');
        queryBuilder.leftJoinAndSelect('sourceTransaction.supplier', 'sourceSupplier');
        queryBuilder.leftJoinAndSelect('sourceSupplier.person', 'sourceSupplierPerson');
        if (filters?.sourceType) {
            const sourceTypes = Array.isArray(filters.sourceType) ? filters.sourceType : [filters.sourceType];
            queryBuilder.andWhere('installment.sourceType IN (:...sourceTypes)', { sourceTypes });
        }
        else {
            queryBuilder.andWhere('installment.sourceType != :saleType', { saleType: installment_entity_1.InstallmentSourceType.SALE });
        }
        if (filters?.status) {
            const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
            queryBuilder.andWhere('installment.status IN (:...statuses)', { statuses });
        }
        else {
            queryBuilder.andWhere('installment.status IN (:...defaultStatuses)', {
                defaultStatuses: [installment_entity_1.InstallmentStatus.PENDING, installment_entity_1.InstallmentStatus.PARTIAL, installment_entity_1.InstallmentStatus.OVERDUE]
            });
        }
        if (filters?.payeeType) {
            queryBuilder.andWhere('installment.payeeType = :payeeType', { payeeType: filters.payeeType });
        }
        if (filters?.fromDate) {
            queryBuilder.andWhere('installment.dueDate >= :fromDate', { fromDate: filters.fromDate });
        }
        if (filters?.toDate) {
            queryBuilder.andWhere('installment.dueDate <= :toDate', { toDate: filters.toDate });
        }
        queryBuilder.orderBy('paymentTransaction.createdAt IS NULL', 'ASC');
        queryBuilder.addOrderBy('paymentTransaction.createdAt', 'DESC');
        queryBuilder.addOrderBy('installment.dueDate', 'DESC');
        return queryBuilder.getMany();
    }
    async getAccountsReceivable(filters) {
        const page = Math.max(Number(filters?.page ?? 1), 1);
        const pageSize = Math.min(Math.max(Number(filters?.pageSize ?? 50), 1), 200);
        const queryBuilder = this.repo.createQueryBuilder('installment');
        queryBuilder
            .leftJoinAndSelect('installment.saleTransaction', 'transaction')
            .leftJoinAndSelect('transaction.customer', 'customer')
            .leftJoinAndSelect('customer.person', 'person');
        queryBuilder.andWhere('installment.sourceType = :saleType', { saleType: installment_entity_1.InstallmentSourceType.SALE });
        if (filters?.status) {
            const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
            queryBuilder.andWhere('installment.status IN (:...statuses)', { statuses });
        }
        else if (!filters?.includePaid) {
            queryBuilder.andWhere('installment.status IN (:...defaultStatuses)', {
                defaultStatuses: [installment_entity_1.InstallmentStatus.PENDING, installment_entity_1.InstallmentStatus.PARTIAL, installment_entity_1.InstallmentStatus.OVERDUE],
            });
        }
        if (filters?.customerId) {
            queryBuilder.andWhere('transaction.customerId = :customerId', { customerId: filters.customerId });
        }
        if (filters?.search) {
            const search = `%${filters.search.trim()}%`;
            queryBuilder.andWhere('(transaction.documentNumber LIKE :search OR person.businessName LIKE :search OR person.firstName LIKE :search OR person.lastName LIKE :search)', { search });
        }
        if (filters?.fromDate) {
            queryBuilder.andWhere('installment.dueDate >= :fromDate', { fromDate: filters.fromDate });
        }
        if (filters?.toDate) {
            queryBuilder.andWhere('installment.dueDate <= :toDate', { toDate: filters.toDate });
        }
        queryBuilder.orderBy('installment.dueDate', 'ASC');
        queryBuilder.skip((page - 1) * pageSize).take(pageSize);
        const [rows, total] = await queryBuilder.getManyAndCount();
        return { rows, total, page, pageSize };
    }
    async getInstallmentById(id) {
        return this.repo.findOneBy({ id });
    }
    async getPaymentContext(installmentId) {
        const installment = await this.repo.findOneBy({ id: installmentId });
        if (!installment) {
            throw new common_1.NotFoundException('Installment not found');
        }
        const sourceTransaction = await this.transactionsRepository.findOne({
            where: { id: installment.sourceTransactionId },
            relations: {
                supplier: { person: true },
                employee: { person: true },
                branch: { company: true },
            },
        });
        if (!sourceTransaction) {
            throw new common_1.NotFoundException('Source transaction not found');
        }
        const supplierPerson = sourceTransaction.supplier?.person;
        const employeePerson = sourceTransaction.employee?.person;
        const payeeName = sourceTransaction.supplier?.alias
            || supplierPerson?.businessName
            || [supplierPerson?.firstName, supplierPerson?.lastName].filter(Boolean).join(' ').trim()
            || [employeePerson?.firstName, employeePerson?.lastName].filter(Boolean).join(' ').trim()
            || installment.metadata?.supplierName
            || installment.metadata?.employeeName
            || null;
        const payeeAccounts = supplierPerson?.bankAccounts
            || employeePerson?.bankAccounts
            || [];
        const companyAccounts = sourceTransaction.branch?.company?.bankAccounts ?? [];
        return {
            payment: {
                id: installment.id,
                documentNumber: sourceTransaction.documentNumber ?? '-',
                supplierName: payeeName,
                total: Number(installment.amount),
                pendingAmount: installment.getPendingAmount(),
                paymentMethod: sourceTransaction.paymentMethod ?? null,
            },
            supplierAccounts: payeeAccounts,
            companyAccounts,
        };
    }
    async payInstallment(installmentId, dto) {
        const installment = await this.repo.findOneBy({ id: installmentId });
        if (!installment) {
            throw new common_1.NotFoundException('Installment not found');
        }
        const pendingAmount = installment.getPendingAmount();
        const amount = dto.amount ?? pendingAmount;
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new common_1.BadRequestException('Monto de pago inválido');
        }
        if (amount > pendingAmount) {
            throw new common_1.BadRequestException('El monto supera el saldo pendiente');
        }
        const sourceTransaction = await this.transactionsRepository.findOne({
            where: { id: installment.sourceTransactionId },
            relations: {
                supplier: true,
                employee: true,
                branch: true,
            },
        });
        if (!sourceTransaction) {
            throw new common_1.NotFoundException('Source transaction not found');
        }
        if (!sourceTransaction.branchId) {
            throw new common_1.BadRequestException('No se pudo determinar la sucursal para el pago');
        }
        if (!sourceTransaction.userId) {
            throw new common_1.BadRequestException('No se pudo determinar el usuario para el pago');
        }
        if (dto.paymentMethod === transaction_entity_2.PaymentMethod.TRANSFER && !dto.companyAccountKey) {
            throw new common_1.BadRequestException('Debe seleccionar la cuenta bancaria de la compañía');
        }
        const transactionType = this.resolvePaymentTransactionType(installment.sourceType);
        const createDto = new create_transaction_dto_1.CreateTransactionDto();
        createDto.transactionType = transactionType;
        createDto.branchId = sourceTransaction.branchId;
        createDto.userId = sourceTransaction.userId;
        createDto.subtotal = amount;
        createDto.taxAmount = 0;
        createDto.discountAmount = 0;
        createDto.total = amount;
        createDto.amountPaid = amount;
        createDto.paymentMethod = dto.paymentMethod;
        createDto.relatedTransactionId = installment.sourceTransactionId;
        createDto.bankAccountKey = dto.companyAccountKey || undefined;
        createDto.notes = dto.note || undefined;
        createDto.metadata = {
            paidQuotaId: installment.id,
            sourceType: installment.sourceType,
            payeeType: installment.payeeType,
        };
        if (transactionType === transaction_entity_2.TransactionType.SUPPLIER_PAYMENT) {
            createDto.supplierId = sourceTransaction.supplierId || installment.payeeId || undefined;
            if (!createDto.supplierId) {
                throw new common_1.BadRequestException('No se pudo determinar el proveedor del pago');
            }
        }
        if (transactionType === transaction_entity_2.TransactionType.EXPENSE_PAYMENT) {
            createDto.expenseCategoryId = sourceTransaction.expenseCategoryId || undefined;
            if (!createDto.expenseCategoryId) {
                throw new common_1.BadRequestException('No se pudo determinar la categoría del gasto');
            }
        }
        if (transactionType === transaction_entity_2.TransactionType.PAYMENT_EXECUTION) {
            createDto.employeeId = sourceTransaction.employeeId || installment.payeeId || undefined;
        }
        const transaction = await this.transactionsService.createTransaction(createDto);
        return {
            success: true,
            transaction,
        };
    }
    async validatePayment(installmentId, paymentAmount) {
        const installment = await this.getInstallmentById(installmentId);
        if (!installment) {
            throw new Error('Installment not found');
        }
        const pendingAmount = installment.getPendingAmount();
        if (paymentAmount > pendingAmount) {
            throw new Error(`Payment amount ${paymentAmount} exceeds pending amount ${pendingAmount}`);
        }
        return true;
    }
};
exports.InstallmentService = InstallmentService;
exports.InstallmentService = InstallmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [installment_repository_1.InstallmentRepository,
        transactions_service_1.TransactionsService,
        typeorm_2.Repository])
], InstallmentService);
//# sourceMappingURL=installment.service.js.map