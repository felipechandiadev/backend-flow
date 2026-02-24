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
exports.AccountsReceivableController = void 0;
const common_1 = require("@nestjs/common");
const installment_service_1 = require("../application/services/installment.service");
let AccountsReceivableController = class AccountsReceivableController {
    constructor(installmentService) {
        this.installmentService = installmentService;
    }
    async getAccountsReceivable(filtersRaw, page, pageSize) {
        let filters = {};
        if (filtersRaw) {
            try {
                filters = JSON.parse(filtersRaw);
            }
            catch (err) {
                filters = {};
            }
        }
        const includePaid = Boolean(filters.includePaid);
        const status = filters.status
            ? (Array.isArray(filters.status) ? filters.status : String(filters.status).split(','))
            : undefined;
        const { rows, total, page: resolvedPage, pageSize: resolvedPageSize } = await this.installmentService.getAccountsReceivable({
            includePaid,
            status: status,
            customerId: filters.customerId,
            search: filters.search,
            fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
            toDate: filters.toDate ? new Date(filters.toDate) : undefined,
            page: page ? Number(page) : undefined,
            pageSize: pageSize ? Number(pageSize) : undefined,
        });
        const mappedRows = rows.map((inst) => {
            const transaction = inst.saleTransaction;
            const person = transaction?.customer?.person;
            const customerName = (person?.businessName ?? '').trim() ||
                [person?.firstName, person?.lastName].filter(Boolean).join(' ').trim() ||
                null;
            return {
                id: inst.id,
                documentNumber: transaction?.documentNumber ?? inst.sourceTransactionId ?? null,
                customerName,
                quotaNumber: inst.installmentNumber,
                totalQuotas: inst.totalInstallments,
                dueDate: inst.dueDate,
                quotaAmount: Number(inst.amount),
                status: inst.status,
                createdAt: transaction?.createdAt ?? inst.createdAt,
            };
        });
        return {
            rows: mappedRows,
            total,
            page: resolvedPage,
            pageSize: resolvedPageSize,
        };
    }
};
exports.AccountsReceivableController = AccountsReceivableController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('filters')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AccountsReceivableController.prototype, "getAccountsReceivable", null);
exports.AccountsReceivableController = AccountsReceivableController = __decorate([
    (0, common_1.Controller)('accounts-receivable'),
    __metadata("design:paramtypes", [installment_service_1.InstallmentService])
], AccountsReceivableController);
//# sourceMappingURL=accounts-receivable.controller.js.map