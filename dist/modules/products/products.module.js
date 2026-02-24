"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_variant_entity_1 = require("../product-variants/domain/product-variant.entity");
const product_entity_1 = require("./domain/product.entity");
const tax_entity_1 = require("../taxes/domain/tax.entity");
const attribute_entity_1 = require("../attributes/domain/attribute.entity");
const price_list_item_entity_1 = require("../price-list-items/domain/price-list-item.entity");
const stock_level_entity_1 = require("../stock-levels/domain/stock-level.entity");
const products_controller_1 = require("./presentation/products.controller");
const products_service_1 = require("./application/products.service");
const products_pos_service_1 = require("./application/products-pos.service");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product, product_variant_entity_1.ProductVariant, tax_entity_1.Tax, attribute_entity_1.Attribute, price_list_item_entity_1.PriceListItem, stock_level_entity_1.StockLevel])],
        controllers: [products_controller_1.ProductsController],
        providers: [products_service_1.ProductsService, products_pos_service_1.ProductsPosService],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map