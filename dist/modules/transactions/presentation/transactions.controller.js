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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("../application/transactions.service");
const search_transactions_dto_1 = require("../application/dto/search-transactions.dto");
let TransactionsController = class TransactionsController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async search(query) {
        return this.transactionsService.search(query);
    }
    async listJournal(page, pageSize, limit, filters, type, status, dateFrom, dateTo, search) {
        const pageNum = parseInt(page || '1', 10);
        const pageSizeNum = parseInt(pageSize || limit || '25', 10);
        return this.transactionsService.listJournal({
            page: pageNum,
            pageSize: pageSizeNum,
            limit: pageSizeNum,
            filters: filters ? JSON.parse(filters) : undefined,
            type,
            status,
            dateFrom,
            dateTo,
            search,
        });
    }
    async findOne(id) {
        return this.transactionsService.findOne(id);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_transactions_dto_1.SearchTransactionsDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('journal'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('filters')),
    __param(4, (0, common_1.Query)('type')),
    __param(5, (0, common_1.Query)('status')),
    __param(6, (0, common_1.Query)('dateFrom')),
    __param(7, (0, common_1.Query)('dateTo')),
    __param(8, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "listJournal", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findOne", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map