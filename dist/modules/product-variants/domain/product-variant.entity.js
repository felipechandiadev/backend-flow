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
exports.ProductVariant = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("../../products/domain/product.entity");
const unit_entity_1 = require("../../units/domain/unit.entity");
const price_list_item_entity_1 = require("../../price-list-items/domain/price-list-item.entity");
let ProductVariant = class ProductVariant {
};
exports.ProductVariant = ProductVariant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ProductVariant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "barcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "basePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "baseCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "pmp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 36, name: 'unit_id' }),
    __metadata("design:type", String)
], ProductVariant.prototype, "unitId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_entity_1.Unit, { onDelete: 'RESTRICT', eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'unit_id' }),
    __metadata("design:type", unit_entity_1.Unit)
], ProductVariant.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3, nullable: true }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 16, name: 'weight_unit', default: 'kg' }),
    __metadata("design:type", String)
], ProductVariant.prototype, "weightUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "attributeValues", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], ProductVariant.prototype, "taxIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "trackInventory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "allowNegativeStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "minimumStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "maximumStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "reorderPoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "imagePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProductVariant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ProductVariant.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], ProductVariant.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], ProductVariant.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => price_list_item_entity_1.PriceListItem, priceListItem => priceListItem.productVariant),
    __metadata("design:type", Array)
], ProductVariant.prototype, "priceListItems", void 0);
exports.ProductVariant = ProductVariant = __decorate([
    (0, typeorm_1.Entity)("product_variants")
], ProductVariant);
//# sourceMappingURL=product-variant.entity.js.map