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
exports.PosController = void 0;
const common_1 = require("@nestjs/common");
const pos_service_1 = require("../application/pos.service");
let PosController = class PosController {
    constructor(posService) {
        this.posService = posService;
    }
    async findAll(includeInactive) {
        const include = includeInactive === 'true' || includeInactive === '1';
        return this.posService.findAll(include);
    }
    async getById(id) {
        const pointOfSale = await this.posService.getPointOfSaleById(id);
        if (!pointOfSale) {
            return { success: false, message: 'Punto de venta no encontrado', statusCode: 404 };
        }
        return { success: true, pointOfSale };
    }
    async createPointOfSale(data) {
        return this.posService.createPointOfSale(data);
    }
    async updatePointOfSale(id, data) {
        return this.posService.updatePointOfSale(id, data);
    }
    async getPriceLists(id) {
        return this.posService.getPriceLists(id);
    }
    async deletePointOfSale(id) {
        return this.posService.deletePointOfSale(id);
    }
};
exports.PosController = PosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "createPointOfSale", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "updatePointOfSale", null);
__decorate([
    (0, common_1.Get)(':id/price-lists'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "getPriceLists", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "deletePointOfSale", null);
exports.PosController = PosController = __decorate([
    (0, common_1.Controller)('points-of-sale'),
    __metadata("design:paramtypes", [pos_service_1.PosService])
], PosController);
//# sourceMappingURL=pos.controller.js.map