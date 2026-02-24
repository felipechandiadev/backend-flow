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
exports.PriceListsController = void 0;
const common_1 = require("@nestjs/common");
const price_lists_service_1 = require("../application/price-lists.service");
let PriceListsController = class PriceListsController {
    constructor(priceListsService) {
        this.priceListsService = priceListsService;
    }
    async getPriceLists(includeInactive) {
        const include = includeInactive === 'true' || includeInactive === '1';
        return this.priceListsService.getAllPriceLists(include);
    }
    async getPriceListById(id) {
        const priceList = await this.priceListsService.getPriceListById(id);
        if (!priceList) {
            return { success: false, message: 'Price list not found', statusCode: 404 };
        }
        return priceList;
    }
    async createPriceList(data) {
        return this.priceListsService.createPriceList(data);
    }
    async updatePriceList(id, data) {
        return this.priceListsService.updatePriceList(id, data);
    }
    async deletePriceList(id) {
        return this.priceListsService.deletePriceList(id);
    }
};
exports.PriceListsController = PriceListsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "getPriceLists", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "getPriceListById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "createPriceList", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "updatePriceList", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PriceListsController.prototype, "deletePriceList", null);
exports.PriceListsController = PriceListsController = __decorate([
    (0, common_1.Controller)('price-lists'),
    __metadata("design:paramtypes", [price_lists_service_1.PriceListsService])
], PriceListsController);
//# sourceMappingURL=price-lists.controller.js.map