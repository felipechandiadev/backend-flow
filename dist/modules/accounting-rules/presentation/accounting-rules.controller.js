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
exports.AccountingRulesController = void 0;
const common_1 = require("@nestjs/common");
const accounting_rules_service_1 = require("../application/accounting-rules.service");
let AccountingRulesController = class AccountingRulesController {
    constructor(service) {
        this.service = service;
    }
    async create(dto) {
        return this.service.create(dto);
    }
    async findAll(companyId) {
        if (!companyId) {
            return { error: 'companyId is required' };
        }
        return this.service.findAll(companyId);
    }
    async findById(id) {
        return this.service.findById(id);
    }
    async update(id, dto) {
        return this.service.update(id, dto);
    }
    async delete(id) {
        await this.service.deactivate(id);
        return { message: 'Rule deactivated' };
    }
    async findByTransactionType(transactionType, companyId) {
        if (!companyId) {
            return { error: 'companyId is required' };
        }
        return this.service.findByTransactionType(companyId, transactionType);
    }
};
exports.AccountingRulesController = AccountingRulesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountingRulesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountingRulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountingRulesController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AccountingRulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountingRulesController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('type/:transactionType'),
    __param(0, (0, common_1.Param)('transactionType')),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AccountingRulesController.prototype, "findByTransactionType", null);
exports.AccountingRulesController = AccountingRulesController = __decorate([
    (0, common_1.Controller)('accounting/rules'),
    __metadata("design:paramtypes", [accounting_rules_service_1.AccountingRulesService])
], AccountingRulesController);
//# sourceMappingURL=accounting-rules.controller.js.map