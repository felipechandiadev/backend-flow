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
exports.AccountingPeriodsController = void 0;
const common_1 = require("@nestjs/common");
const accounting_periods_service_1 = require("../application/accounting-periods.service");
const accounting_period_entity_1 = require("../domain/accounting-period.entity");
let AccountingPeriodsController = class AccountingPeriodsController {
    constructor(accountingPeriodsService) {
        this.accountingPeriodsService = accountingPeriodsService;
    }
    async findAll(companyId, status, year) {
        try {
            const params = {
                companyId,
                status,
                year: year ? parseInt(year, 10) : undefined,
            };
            const periods = await this.accountingPeriodsService.findAll(params);
            return {
                success: true,
                data: periods,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const period = await this.accountingPeriodsService.findOne(id);
            if (!period) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Accounting period not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                data: period,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(data) {
        try {
            const period = await this.accountingPeriodsService.create(data);
            return {
                success: true,
                data: period,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, error instanceof Error && error.message.includes('overlaps')
                ? common_1.HttpStatus.CONFLICT
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async ensurePeriod(data) {
        try {
            const period = await this.accountingPeriodsService.ensurePeriod(data.date, data.companyId);
            return {
                success: true,
                data: period,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async closePeriod(id, data) {
        try {
            const period = await this.accountingPeriodsService.closePeriod(id, data?.userId);
            return {
                success: true,
                data: period,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, error instanceof Error && error.message.includes('not found')
                ? common_1.HttpStatus.NOT_FOUND
                : common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async reopenPeriod(id) {
        try {
            const period = await this.accountingPeriodsService.reopenPeriod(id);
            return {
                success: true,
                data: period,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, error instanceof Error && error.message.includes('not found')
                ? common_1.HttpStatus.NOT_FOUND
                : common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.AccountingPeriodsController = AccountingPeriodsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AccountingPeriodsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountingPeriodsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountingPeriodsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('ensure'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountingPeriodsController.prototype, "ensurePeriod", null);
__decorate([
    (0, common_1.Put)(':id/close'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AccountingPeriodsController.prototype, "closePeriod", null);
__decorate([
    (0, common_1.Put)(':id/reopen'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountingPeriodsController.prototype, "reopenPeriod", null);
exports.AccountingPeriodsController = AccountingPeriodsController = __decorate([
    (0, common_1.Controller)('accounting/periods'),
    __metadata("design:paramtypes", [accounting_periods_service_1.AccountingPeriodsService])
], AccountingPeriodsController);
//# sourceMappingURL=accounting-periods.controller.js.map