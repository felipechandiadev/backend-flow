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
exports.RemunerationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transactions_service_1 = require("../../transactions/application/transactions.service");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
const create_transaction_dto_1 = require("../../transactions/application/dto/create-transaction.dto");
const employee_entity_1 = require("../../employees/domain/employee.entity");
const result_center_entity_1 = require("../../result-centers/domain/result-center.entity");
const branch_entity_1 = require("../../branches/domain/branch.entity");
const user_entity_1 = require("../../users/domain/user.entity");
const DEDUCTION_TYPE_IDS = new Set([
    'AFP',
    'HEALTH_INSURANCE',
    'INCOME_TAX',
    'UNEMPLOYMENT_INSURANCE',
    'LOAN_PAYMENT',
    'ADVANCE_PAYMENT',
    'UNION_FEE',
    'COURT_ORDER',
    'DEDUCTION_EXTRA',
    'ADJUSTMENT_NEG',
]);
let RemunerationsService = class RemunerationsService {
    constructor(transactionsService, transactionRepository, employeeRepository, resultCenterRepository, branchRepository, userRepository) {
        this.transactionsService = transactionsService;
        this.transactionRepository = transactionRepository;
        this.employeeRepository = employeeRepository;
        this.resultCenterRepository = resultCenterRepository;
        this.branchRepository = branchRepository;
        this.userRepository = userRepository;
    }
    async getRemunerationById(id) {
        const tx = await this.transactionRepository.findOne({
            where: { id, transactionType: transaction_entity_1.TransactionType.PAYROLL },
            relations: ['employee', 'employee.person', 'resultCenter'],
        });
        if (!tx) {
            return null;
        }
        return this.formatRemuneration(tx);
    }
    async getAllRemunerations(params) {
        const query = this.transactionRepository.createQueryBuilder('t');
        query.leftJoinAndSelect('t.employee', 'employee');
        query.leftJoinAndSelect('employee.person', 'person');
        query.leftJoinAndSelect('t.resultCenter', 'resultCenter');
        query.where('t.transactionType = :type', { type: transaction_entity_1.TransactionType.PAYROLL });
        if (params?.employeeId) {
            query.andWhere('t.employeeId = :employeeId', { employeeId: params.employeeId });
        }
        if (params?.status) {
            query.andWhere('t.status = :status', { status: params.status });
        }
        const remunerations = await query.orderBy('t.createdAt', 'DESC').getMany();
        return remunerations.map((tx) => this.formatRemuneration(tx));
    }
    async createRemuneration(data) {
        const employee = await this.employeeRepository.findOne({
            where: { id: data.employeeId },
            relations: ['person'],
        });
        if (!employee) {
            throw new common_1.BadRequestException('Employee not found');
        }
        const resultCenterId = data.resultCenterId ?? employee.resultCenterId ?? null;
        const branchId = await this.resolveBranchId(employee, resultCenterId);
        if (!branchId) {
            throw new common_1.BadRequestException('Branch not found for remuneration');
        }
        const userId = await this.resolveUserId(data.userId);
        const { totalEarnings, totalDeductions, netPayment, normalizedLines } = this.calculateTotals(data.lines);
        const metadata = {
            remuneration: true,
            payrollDate: data.date,
            lines: normalizedLines,
            totalEarnings,
            totalDeductions,
            netPayment,
        };
        const dto = new create_transaction_dto_1.CreateTransactionDto();
        dto.transactionType = transaction_entity_1.TransactionType.PAYROLL;
        dto.branchId = branchId;
        dto.userId = userId;
        dto.employeeId = employee.id;
        dto.resultCenterId = resultCenterId ?? undefined;
        dto.subtotal = totalEarnings;
        dto.taxAmount = 0;
        dto.discountAmount = totalDeductions;
        dto.total = netPayment;
        dto.paymentMethod = transaction_entity_1.PaymentMethod.TRANSFER;
        dto.amountPaid = netPayment;
        dto.paymentDueDate = data.date;
        dto.metadata = metadata;
        const created = await this.transactionsService.createTransaction(dto);
        return this.getRemunerationById(created.id);
    }
    async updateRemuneration(id, data) {
        const existing = await this.transactionRepository.findOne({
            where: { id, transactionType: transaction_entity_1.TransactionType.PAYROLL },
        });
        if (!existing) {
            return null;
        }
        const updateData = {};
        if (data.status) {
            updateData.status = data.status;
        }
        if (typeof data.resultCenterId !== 'undefined') {
            updateData.resultCenterId = data.resultCenterId ?? null;
        }
        if (data.date) {
            updateData.paymentDueDate = new Date(data.date);
        }
        if (data.lines) {
            const { totalEarnings, totalDeductions, netPayment, normalizedLines } = this.calculateTotals(data.lines);
            updateData.subtotal = totalEarnings;
            updateData.discountAmount = totalDeductions;
            updateData.total = netPayment;
            updateData.metadata = {
                ...(existing.metadata ?? {}),
                remuneration: true,
                payrollDate: data.date ?? existing.metadata?.payrollDate,
                lines: normalizedLines,
                totalEarnings,
                totalDeductions,
                netPayment,
            };
        }
        await this.transactionRepository.update(id, updateData);
        return this.getRemunerationById(id);
    }
    async deleteRemuneration(id) {
        await this.transactionRepository.update({ id, transactionType: transaction_entity_1.TransactionType.PAYROLL }, { status: transaction_entity_1.TransactionStatus.CANCELLED });
        return { success: true };
    }
    calculateTotals(lines) {
        let totalEarnings = 0;
        let totalDeductions = 0;
        const normalizedLines = lines.map((line) => {
            const category = DEDUCTION_TYPE_IDS.has(line.typeId)
                ? 'DEDUCTION'
                : 'EARNING';
            const amount = Number(line.amount) || 0;
            if (category === 'DEDUCTION') {
                totalDeductions += amount;
            }
            else {
                totalEarnings += amount;
            }
            return {
                typeId: line.typeId,
                amount,
                category,
            };
        });
        return {
            totalEarnings,
            totalDeductions,
            netPayment: totalEarnings - totalDeductions,
            normalizedLines,
        };
    }
    formatRemuneration(tx) {
        const person = tx.employee?.person;
        const employeeName = person
            ? `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim()
            : '';
        const metadata = tx.metadata ?? {};
        const payrollDate = metadata.payrollDate ?? tx.paymentDueDate ?? tx.createdAt;
        return {
            id: tx.id,
            date: payrollDate,
            employeeId: tx.employeeId ?? null,
            employeeName,
            resultCenterId: tx.resultCenterId ?? null,
            totalEarnings: Number(metadata.totalEarnings ?? tx.subtotal ?? 0),
            totalDeductions: Number(metadata.totalDeductions ?? tx.discountAmount ?? 0),
            netPayment: Number(metadata.netPayment ?? tx.total ?? 0),
            status: tx.status,
            createdAt: tx.createdAt,
            updatedAt: tx.createdAt,
            lines: metadata.lines ?? [],
        };
    }
    async resolveBranchId(employee, resultCenterId) {
        if (employee.branchId) {
            return employee.branchId;
        }
        if (resultCenterId) {
            const resultCenter = await this.resultCenterRepository.findOne({
                where: { id: resultCenterId },
            });
            if (resultCenter?.branchId) {
                return resultCenter.branchId;
            }
        }
        const branches = await this.branchRepository.find({
            order: { name: 'ASC' },
            take: 1,
        });
        return branches[0]?.id ?? null;
    }
    async resolveUserId(userId) {
        if (userId) {
            return userId;
        }
        const users = await this.userRepository.find({
            order: { userName: 'ASC' },
            take: 1,
        });
        if (!users[0]) {
            throw new common_1.BadRequestException('No users available to register payroll');
        }
        return users[0].id;
    }
};
exports.RemunerationsService = RemunerationsService;
exports.RemunerationsService = RemunerationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(2, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(3, (0, typeorm_1.InjectRepository)(result_center_entity_1.ResultCenter)),
    __param(4, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RemunerationsService);
//# sourceMappingURL=remunerations.service.js.map