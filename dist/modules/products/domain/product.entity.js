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
exports.Product = exports.ProductType = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../../categories/domain/category.entity");
const unit_entity_1 = require("../../units/domain/unit.entity");
const result_center_entity_1 = require("../../result-centers/domain/result-center.entity");
var ProductType;
(function (ProductType) {
    ProductType["PHYSICAL"] = "PHYSICAL";
    ProductType["SERVICE"] = "SERVICE";
    ProductType["DIGITAL"] = "DIGITAL";
})(ProductType || (exports.ProductType = ProductType = {}));
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProductType, default: ProductType.PHYSICAL }),
    __metadata("design:type", String)
], Product.prototype, "productType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "taxIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "imagePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "resultCenterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => result_center_entity_1.ResultCenter, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'resultCenterId' }),
    __metadata("design:type", result_center_entity_1.ResultCenter)
], Product.prototype, "resultCenter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'base_unit_id' }),
    __metadata("design:type", String)
], Product.prototype, "baseUnitId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "changeHistory", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'categoryId' }),
    __metadata("design:type", category_entity_1.Category)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_entity_1.Unit, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'base_unit_id' }),
    __metadata("design:type", unit_entity_1.Unit)
], Product.prototype, "baseUnit", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)("products")
], Product);
//# sourceMappingURL=product.entity.js.map