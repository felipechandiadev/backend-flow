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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("../application/customers.service");
const create_customer_dto_1 = require("../application/dto/create-customer.dto");
const update_customer_dto_1 = require("../application/dto/update-customer.dto");
const search_customers_dto_1 = require("../application/dto/search-customers.dto");
const installment_service_1 = require("../../installments/application/services/installment.service");
let CustomersController = class CustomersController {
    constructor(customersService, installmentService) {
        this.customersService = customersService;
        this.installmentService = installmentService;
    }
    async search(searchDto) {
        return this.customersService.search(searchDto);
    }
    async list(searchDto) {
        return this.customersService.search(searchDto);
    }
    async create(createCustomerDto) {
        return this.customersService.create(createCustomerDto);
    }
    async update(id, updateCustomerDto) {
        return this.customersService.update(id, updateCustomerDto);
    }
    async delete(id) {
        return this.customersService.delete(id);
    }
    async getPendingPayments(id) {
        return this.customersService.getPendingPayments(id);
    }
    async getPendingQuotas(id) {
        const result = await this.installmentService.getAccountsReceivable({
            customerId: id,
            includePaid: false,
            page: 1,
            pageSize: 200,
        });
        const quotas = (result.rows ?? []).map((inst) => ({
            id: inst.id,
            transactionId: inst.sourceTransactionId || inst.saleTransactionId || null,
            documentNumber: inst.saleTransaction?.documentNumber ?? inst.sourceTransactionId ?? null,
            amount: Number(inst.amount ?? 0),
            dueDate: inst.dueDate,
            createdAt: inst.saleTransaction?.createdAt ?? inst.createdAt,
        }));
        return { success: true, quotas };
    }
    async getPurchases(id) {
        const purchases = await this.customersService.getPurchases(id);
        return { success: true, purchases };
    }
    async getPurchasesByStatus(id, status) {
        const purchases = await this.customersService.getPurchases(id, status);
        return { success: true, purchases };
    }
    async getPayments(id) {
        const payments = await this.customersService.getPayments(id);
        return { success: true, payments };
    }
    async findOne(id) {
        return { customer: await this.customersService.findOne(id) };
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_customers_dto_1.SearchCustomersDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_customers_dto_1.SearchCustomersDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_customer_dto_1.UpdateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(':id/pending-payments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getPendingPayments", null);
__decorate([
    (0, common_1.Get)(':id/pending-quotas'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getPendingQuotas", null);
__decorate([
    (0, common_1.Get)(':id/purchases'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getPurchases", null);
__decorate([
    (0, common_1.Get)(':id/purchases/:status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getPurchasesByStatus", null);
__decorate([
    (0, common_1.Get)(':id/payments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findOne", null);
exports.CustomersController = CustomersController = __decorate([
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customers_service_1.CustomersService,
        installment_service_1.InstallmentService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map