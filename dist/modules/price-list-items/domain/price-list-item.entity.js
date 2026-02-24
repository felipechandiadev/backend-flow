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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceListItem = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const price_list_entity_1 = require("../../price-lists/domain/price-list.entity");
const product_entity_1 = require("../../products/domain/product.entity");
const product_variant_entity_1 = require("../../product-variants/domain/product-variant.entity");
let PriceListItem = class PriceListItem {
};
exports.PriceListItem = PriceListItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], PriceListItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], PriceListItem.prototype, "priceListId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], PriceListItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], PriceListItem.prototype, "productVariantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], PriceListItem.prototype, "netPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], PriceListItem.prototype, "grossPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], PriceListItem.prototype, "taxIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], PriceListItem.prototype, "minPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], PriceListItem.prototype, "discountPercentage", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PriceListItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PriceListItem.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], PriceListItem.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => price_list_entity_1.PriceList, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'priceListId' }),
    __metadata("design:type", price_list_entity_1.PriceList)
], PriceListItem.prototype, "priceList", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], PriceListItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'productVariantId' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], PriceListItem.prototype, "productVariant", void 0);
exports.PriceListItem = PriceListItem = __decorate([
    (0, typeorm_1.Entity)("price_list_items"),
    (0, typeorm_1.Unique)(['priceListId', 'productId', 'productVariantId'])
], PriceListItem);
//# sourceMappingURL=price-list-item.entity.js.map