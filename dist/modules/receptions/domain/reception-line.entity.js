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
exports.ReceptionLine = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const reception_entity_1 = require("./reception.entity");
const product_entity_1 = require("../../products/domain/product.entity");
const product_variant_entity_1 = require("../../product-variants/domain/product-variant.entity");
let ReceptionLine = class ReceptionLine {
};
exports.ReceptionLine = ReceptionLine;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReceptionLine.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ReceptionLine.prototype, "receptionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], ReceptionLine.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], ReceptionLine.prototype, "productVariantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ReceptionLine.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ReceptionLine.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ReceptionLine.prototype, "variantName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], ReceptionLine.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], ReceptionLine.prototype, "receivedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], ReceptionLine.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ReceptionLine.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ReceptionLine.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], ReceptionLine.prototype, "lineNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reception_entity_1.Reception, (reception) => reception.lines),
    (0, typeorm_1.JoinColumn)({ name: 'receptionId' }),
    __metadata("design:type", reception_entity_1.Reception)
], ReceptionLine.prototype, "reception", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], ReceptionLine.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'productVariantId' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], ReceptionLine.prototype, "productVariant", void 0);
exports.ReceptionLine = ReceptionLine = __decorate([
    (0, typeorm_1.Entity)('reception_lines'),
    (0, typeorm_1.Index)(['receptionId']),
    (0, typeorm_1.Index)(['productVariantId'])
], ReceptionLine);
//# sourceMappingURL=reception-line.entity.js.map