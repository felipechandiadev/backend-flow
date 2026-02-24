"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoldPricesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const gold_price_entity_1 = require("./domain/gold-price.entity");
const gold_prices_controller_1 = require("./presentation/gold-prices.controller");
const gold_prices_service_1 = require("./application/gold-prices.service");
let GoldPricesModule = class GoldPricesModule {
};
exports.GoldPricesModule = GoldPricesModule;
exports.GoldPricesModule = GoldPricesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([gold_price_entity_1.GoldPrice])],
        controllers: [gold_prices_controller_1.GoldPricesController],
        providers: [gold_prices_service_1.GoldPricesService],
        exports: [gold_prices_service_1.GoldPricesService],
    })
], GoldPricesModule);
//# sourceMappingURL=gold-prices.module.js.map