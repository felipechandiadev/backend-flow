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
exports.InstallmentController = void 0;
const common_1 = require("@nestjs/common");
const installment_service_1 = require("../application/services/installment.service");
const create_installment_dto_1 = require("./dto/create-installment.dto");
const pay_installment_dto_1 = require("./dto/pay-installment.dto");
let InstallmentController = class InstallmentController {
    constructor(installmentService) {
        this.installmentService = installmentService;
    }
    async getAccountsPayable(sourceType, status, payeeType, fromDate, toDate) {
        const filters = {};
        if (sourceType) {
            filters.sourceType = sourceType.includes(',')
                ? sourceType.split(',')
                : sourceType;
        }
        if (status) {
            filters.status = status.includes(',')
                ? status.split(',')
                : status;
        }
        if (payeeType) {
            filters.payeeType = payeeType;
        }
        if (fromDate) {
            filters.fromDate = new Date(fromDate);
        }
        if (toDate) {
            filters.toDate = new Date(toDate);
        }
        const installments = await this.installmentService.getAccountsPayable(filters);
        return installments.map((inst) => {
            const sourceTransaction = inst.sourceTransaction ?? inst.saleTransaction;
            const supplier = sourceTransaction?.supplier;
            const supplierPerson = supplier?.person;
            const supplierPersonName = [supplierPerson?.firstName, supplierPerson?.lastName]
                .filter(Boolean)
                .join(' ')
                .trim();
            const supplierName = supplier?.alias
                || supplierPerson?.businessName
                || supplierPersonName
                || inst.metadata?.supplierName;
            return ({
                id: inst.id,
                sourceType: inst.sourceType,
                sourceTransactionId: inst.sourceTransactionId,
                payeeType: inst.payeeType,
                payeeId: inst.payeeId,
                payeeName: supplierName,
                installmentNumber: inst.installmentNumber,
                totalInstallments: inst.totalInstallments,
                fromReceptionNumber: sourceTransaction?.documentNumber || inst.metadata?.receptionNumber || null,
                amount: inst.amount,
                amountPaid: inst.amountPaid,
                pendingAmount: inst.getPendingAmount(),
                dueDate: inst.dueDate,
                status: inst.status,
                isOverdue: inst.isOverdue(),
                daysOverdue: inst.getDaysOverdue(),
                paymentTransactionId: inst.paymentTransactionId,
                metadata: inst.metadata,
                createdAt: inst.createdAt,
            });
        });
    }
    async getInstallmentsByTransaction(transactionId) {
        return this.installmentService.getInstallmentsByTransaction(transactionId);
    }
    async getTransactionCarteraStatus(transactionId) {
        return this.installmentService.getTransactionCarteraStatus(transactionId);
    }
    async getInstallmentById(id) {
        return this.installmentService.getInstallmentById(id);
    }
    async getInstallmentPaymentContext(id) {
        return this.installmentService.getPaymentContext(id);
    }
    async payInstallment(id, dto) {
        return this.installmentService.payInstallment(id, dto);
    }
    async getCarteraByDueDate(fromDate, toDate) {
        return this.installmentService.getCarteraByDueDate(new Date(fromDate), new Date(toDate));
    }
    async getOverdueReport(today) {
        return this.installmentService.getOverdueReport(today ? new Date(today) : undefined);
    }
    async createInstallments(dto) {
        return this.installmentService.createInstallmentsForTransaction(dto.transactionId, dto.totalAmount, dto.numberOfInstallments, dto.firstDueDate);
    }
};
exports.InstallmentController = InstallmentController;
__decorate([
    (0, common_1.Get)('accounts-payable'),
    __param(0, (0, common_1.Query)('sourceType')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('payeeType')),
    __param(3, (0, common_1.Query)('fromDate')),
    __param(4, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], InstallmentController.prototype, "getAccountsPayable", null);
__decorate([
    (0, common_1.Get)('transaction/:transactionId'),
    __param(0, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentController.prototype, "getInstallmentsByTransaction", null);
__decorate([
    (0, common_1.Get)('cartera/:transactionId'),
    __param(0, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentController.prototype, "getTransactionCarteraStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentController.prototype, "getInstallmentById", null);
__decorate([
    (0, common_1.Get)(':id/context'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentController.prototype, "getInstallmentPaymentContext", null);
__decorate([
    (0, common_1.Post)(':id/pay'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pay_installment_dto_1.PayInstallmentDto]),
    __metadata("design:returntype", Promise)
], InstallmentController.prototype, "payInstallment", null);
__decorate([
    (0, common_1.Get)('reports/cartera-by-date'),
    __param(0, (0, common_1.Query)('fromDate')),
    __param(1, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InstallmentController.prototype, "getCarteraByDueDate", null);
__decorate([
    (0, common_1.Get)('reports/overdue'),
    __param(0, (0, common_1.Query)('today')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentController.prototype, "getOverdueReport", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_installment_dto_1.CreateInstallmentDto]),
    __metadata("design:returntype", Promise)
], InstallmentController.prototype, "createInstallments", null);
exports.InstallmentController = InstallmentController = __decorate([
    (0, common_1.Controller)('installments'),
    __metadata("design:paramtypes", [installment_service_1.InstallmentService])
], InstallmentController);
//# sourceMappingURL=installment.controller.js.map