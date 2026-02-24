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
exports.GoldPricesController = void 0;
const common_1 = require("@nestjs/common");
const gold_prices_service_1 = require("../application/gold-prices.service");
const create_gold_price_dto_1 = require("../application/dto/create-gold-price.dto");
const update_gold_price_dto_1 = require("../application/dto/update-gold-price.dto");
let GoldPricesController = class GoldPricesController {
    constructor(goldPricesService) {
        this.goldPricesService = goldPricesService;
    }
    async findAll() {
        return this.goldPricesService.findAll();
    }
    async findOne(id) {
        return this.goldPricesService.findOne(id);
    }
    async create(createDto) {
        return this.goldPricesService.create(createDto);
    }
    async update(id, updateDto) {
        return this.goldPricesService.update(id, updateDto);
    }
    async remove(id) {
        return this.goldPricesService.remove(id);
    }
};
exports.GoldPricesController = GoldPricesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GoldPricesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GoldPricesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gold_price_dto_1.CreateGoldPriceDto]),
    __metadata("design:returntype", Promise)
], GoldPricesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_gold_price_dto_1.UpdateGoldPriceDto]),
    __metadata("design:returntype", Promise)
], GoldPricesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GoldPricesController.prototype, "remove", null);
exports.GoldPricesController = GoldPricesController = __decorate([
    (0, common_1.Controller)('gold-prices'),
    __metadata("design:paramtypes", [gold_prices_service_1.GoldPricesService])
], GoldPricesController);
//# sourceMappingURL=gold-prices.controller.js.map