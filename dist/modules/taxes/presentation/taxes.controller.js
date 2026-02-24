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
exports.TaxesController = void 0;
const common_1 = require("@nestjs/common");
const taxes_service_1 = require("../application/taxes.service");
let TaxesController = class TaxesController {
    constructor(taxesService) {
        this.taxesService = taxesService;
    }
    async getTaxes(includeInactive, isActive) {
        const include = includeInactive === 'true' || includeInactive === '1';
        const isActiveBool = isActive === 'true' || isActive === '1' ? true : isActive === 'false' || isActive === '0' ? false : undefined;
        return this.taxesService.getAllTaxes(include, isActiveBool);
    }
    async getTaxById(id) {
        const tax = await this.taxesService.getTaxById(id);
        if (!tax) {
            return { success: false, message: 'Tax not found', statusCode: 404 };
        }
        return tax;
    }
    async createTax(data) {
        return this.taxesService.createTax(data);
    }
    async updateTax(id, data) {
        return this.taxesService.updateTax(id, data);
    }
    async deleteTax(id) {
        return this.taxesService.deleteTax(id);
    }
};
exports.TaxesController = TaxesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('includeInactive')),
    __param(1, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TaxesController.prototype, "getTaxes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaxesController.prototype, "getTaxById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaxesController.prototype, "createTax", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TaxesController.prototype, "updateTax", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaxesController.prototype, "deleteTax", null);
exports.TaxesController = TaxesController = __decorate([
    (0, common_1.Controller)('taxes'),
    __metadata("design:paramtypes", [taxes_service_1.TaxesService])
], TaxesController);
//# sourceMappingURL=taxes.controller.js.map