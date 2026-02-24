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
exports.RemunerationsController = void 0;
const common_1 = require("@nestjs/common");
const remunerations_service_1 = require("../application/remunerations.service");
let RemunerationsController = class RemunerationsController {
    constructor(remunerationsService) {
        this.remunerationsService = remunerationsService;
    }
    async getRemunerations(employeeId, status) {
        try {
            const statusFilter = status || undefined;
            const data = await this.remunerationsService.getAllRemunerations({
                employeeId,
                status: statusFilter,
            });
            return { success: true, data };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRemunerationById(id) {
        try {
            const remuneration = await this.remunerationsService.getRemunerationById(id);
            if (!remuneration) {
                throw new common_1.HttpException({ success: false, message: 'Remuneration not found' }, common_1.HttpStatus.NOT_FOUND);
            }
            return { success: true, data: remuneration };
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
    async createRemuneration(data) {
        try {
            const remuneration = await this.remunerationsService.createRemuneration(data);
            return { success: true, data: remuneration };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateRemuneration(id, data) {
        try {
            const updated = await this.remunerationsService.updateRemuneration(id, data);
            if (!updated) {
                throw new common_1.HttpException({ success: false, message: 'Remuneration not found' }, common_1.HttpStatus.NOT_FOUND);
            }
            return { success: true, data: updated };
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
    async deleteRemuneration(id) {
        try {
            await this.remunerationsService.deleteRemuneration(id);
            return { success: true };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.RemunerationsController = RemunerationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('employeeId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RemunerationsController.prototype, "getRemunerations", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RemunerationsController.prototype, "getRemunerationById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RemunerationsController.prototype, "createRemuneration", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RemunerationsController.prototype, "updateRemuneration", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RemunerationsController.prototype, "deleteRemuneration", null);
exports.RemunerationsController = RemunerationsController = __decorate([
    (0, common_1.Controller)('remunerations'),
    __metadata("design:paramtypes", [remunerations_service_1.RemunerationsService])
], RemunerationsController);
//# sourceMappingURL=remunerations.controller.js.map