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
exports.TransactionLine = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
const product_entity_1 = require("../../products/domain/product.entity");
const product_variant_entity_1 = require("../../product-variants/domain/product-variant.entity");
const tax_entity_1 = require("../../taxes/domain/tax.entity");
const unit_entity_1 = require("../../units/domain/unit.entity");
let TransactionLine = class TransactionLine {
};
exports.TransactionLine = TransactionLine;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], TransactionLine.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], TransactionLine.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], TransactionLine.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], TransactionLine.prototype, "productVariantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], TransactionLine.prototype, "unitId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], TransactionLine.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], TransactionLine.prototype, "lineNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], TransactionLine.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], TransactionLine.prototype, "productSku", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], TransactionLine.prototype, "variantName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], TransactionLine.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 6, nullable: true }),
    __metadata("design:type", Object)
], TransactionLine.prototype, "quantityInBase", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], TransactionLine.prototype, "unitOfMeasure", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 9, nullable: true }),
    __metadata("design:type", Object)
], TransactionLine.prototype, "unitConversionFactor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], TransactionLine.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], TransactionLine.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], TransactionLine.prototype, "discountPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], TransactionLine.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], TransactionLine.prototype, "taxRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], TransactionLine.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], TransactionLine.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], TransactionLine.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TransactionLine.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TransactionLine.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => transaction_entity_1.Transaction, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'transactionId' }),
    __metadata("design:type", transaction_entity_1.Transaction)
], TransactionLine.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], TransactionLine.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'productVariantId' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], TransactionLine.prototype, "productVariant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_entity_1.Unit, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'unitId' }),
    __metadata("design:type", unit_entity_1.Unit)
], TransactionLine.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tax_entity_1.Tax, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'taxId' }),
    __metadata("design:type", tax_entity_1.Tax)
], TransactionLine.prototype, "tax", void 0);
exports.TransactionLine = TransactionLine = __decorate([
    (0, typeorm_1.Entity)("transaction_lines")
], TransactionLine);
;
globalThis.TransactionLine = TransactionLine;
//# sourceMappingURL=transaction-line.entity.js.map