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
exports.ResultCentersController = void 0;
const common_1 = require("@nestjs/common");
const result_centers_service_1 = require("../application/result-centers.service");
let ResultCentersController = class ResultCentersController {
    constructor(resultCentersService) {
        this.resultCentersService = resultCentersService;
    }
    async getResultCenters(includeInactive, type, branchId, companyId) {
        try {
            const include = includeInactive === 'true' || includeInactive === '1';
            const typeFilter = type || undefined;
            const resultCenters = await this.resultCentersService.getAllResultCenters({
                includeInactive: include,
                type: typeFilter,
                branchId,
                companyId,
            });
            return {
                success: true,
                data: resultCenters,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getResultCenterById(id) {
        try {
            const resultCenter = await this.resultCentersService.getResultCenterById(id);
            if (!resultCenter) {
                throw new common_1.HttpException({ success: false, message: 'Result center not found' }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                data: resultCenter,
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
    async createResultCenter(data) {
        try {
            const resultCenter = await this.resultCentersService.createResultCenter(data);
            return {
                success: true,
                data: resultCenter,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateResultCenter(id, data) {
        try {
            const updated = await this.resultCentersService.updateResultCenter(id, data);
            if (!updated) {
                throw new common_1.HttpException({ success: false, message: 'Result center not found' }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                data: updated,
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
    async deleteResultCenter(id) {
        try {
            await this.resultCentersService.deleteResultCenter(id);
            return {
                success: true,
                message: 'Result center deleted successfully',
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ResultCentersController = ResultCentersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('includeInactive')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('branchId')),
    __param(3, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ResultCentersController.prototype, "getResultCenters", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResultCentersController.prototype, "getResultCenterById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResultCentersController.prototype, "createResultCenter", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResultCentersController.prototype, "updateResultCenter", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResultCentersController.prototype, "deleteResultCenter", null);
exports.ResultCentersController = ResultCentersController = __decorate([
    (0, common_1.Controller)('result-centers'),
    __metadata("design:paramtypes", [result_centers_service_1.ResultCentersService])
], ResultCentersController);
//# sourceMappingURL=result-centers.controller.js.map