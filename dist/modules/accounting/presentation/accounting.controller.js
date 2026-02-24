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
exports.AccountingController = void 0;
const common_1 = require("@nestjs/common");
const accounting_service_1 = require("../application/accounting.service");
const build_ledger_dto_1 = require("../application/dto/build-ledger.dto");
let AccountingController = class AccountingController {
    constructor(accountingService) {
        this.accountingService = accountingService;
    }
    async getHierarchy(includeInactive, filters, page, pageSize) {
        const include = includeInactive === 'true' || includeInactive === '1';
        return this.accountingService.getHierarchy(include);
    }
    async getLedgerData(includeInactive) {
        const include = includeInactive === 'true' || includeInactive === '1';
        return this.accountingService.getLedgerData(include);
    }
    async buildLedger(dto) {
        return this.accountingService.buildLedger(dto);
    }
};
exports.AccountingController = AccountingController;
__decorate([
    (0, common_1.Get)('hierarchy'),
    __param(0, (0, common_1.Query)('includeInactive')),
    __param(1, (0, common_1.Query)('filters')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AccountingController.prototype, "getHierarchy", null);
__decorate([
    (0, common_1.Get)('ledger'),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountingController.prototype, "getLedgerData", null);
__decorate([
    (0, common_1.Post)('ledger'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [build_ledger_dto_1.BuildLedgerDto]),
    __metadata("design:returntype", Promise)
], AccountingController.prototype, "buildLedger", null);
exports.AccountingController = AccountingController = __decorate([
    (0, common_1.Controller)('accounting'),
    __metadata("design:paramtypes", [accounting_service_1.AccountingService])
], AccountingController);
//# sourceMappingURL=accounting.controller.js.map