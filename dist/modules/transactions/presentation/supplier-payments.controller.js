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
exports.SupplierPaymentsController = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("../application/transactions.service");
const transaction_entity_1 = require("../domain/transaction.entity");
let SupplierPaymentsController = class SupplierPaymentsController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async list(limit, page, includeCancelled, includePaid, supplierId) {
        const limitNum = parseInt(limit || '100', 10);
        const pageNum = parseInt(page || '1', 10);
        const searchDto = {
            page: pageNum,
            limit: limitNum,
            type: transaction_entity_1.TransactionType.PAYMENT_OUT,
        };
        if (includeCancelled === 'false') {
        }
        if (includePaid === 'false') {
            searchDto.status = transaction_entity_1.TransactionStatus.DRAFT;
        }
        const result = await this.transactionsService.search(searchDto);
        return {
            rows: result.data || [],
            total: result.total || 0,
            page: result.page || pageNum,
            pageSize: result.limit || limitNum,
        };
    }
    async findOne(id) {
        return this.transactionsService.findOne(id);
    }
    async getContext(id) {
        const transaction = await this.transactionsService.findOne(id);
        const payment = transaction;
        const supplierAccounts = payment?.supplier?.person?.bankAccounts ?? [];
        const companyAccounts = payment?.branch?.company?.bankAccounts ?? [];
        const total = Number(payment?.total ?? 0);
        const amountPaid = Number(payment?.amountPaid ?? 0);
        const pendingAmount = Math.max(total - amountPaid, 0);
        return {
            payment: { ...payment, pendingAmount },
            supplierAccounts,
            companyAccounts,
            supplier: payment?.supplier,
            branch: payment?.branch,
        };
    }
    async create(data) {
        const dto = {
            ...data,
            transactionType: transaction_entity_1.TransactionType.PAYMENT_OUT,
        };
        return this.transactionsService.createTransaction(dto);
    }
    async update(id, data) {
        throw new Error('Method not implemented. Use transactions API directly.');
    }
    async complete(id, data) {
        return this.transactionsService.completePayment(id, data || {});
    }
    async delete(id) {
        throw new Error('Method not implemented. Use transactions API directly.');
    }
};
exports.SupplierPaymentsController = SupplierPaymentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('includeCancelled')),
    __param(3, (0, common_1.Query)('includePaid')),
    __param(4, (0, common_1.Query)('supplierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/context'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "getContext", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "complete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierPaymentsController.prototype, "delete", null);
exports.SupplierPaymentsController = SupplierPaymentsController = __decorate([
    (0, common_1.Controller)('supplier-payments'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], SupplierPaymentsController);
//# sourceMappingURL=supplier-payments.controller.js.map