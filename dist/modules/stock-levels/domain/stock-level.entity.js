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
exports.StockLevel = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const product_variant_entity_1 = require("../../product-variants/domain/product-variant.entity");
const storage_entity_1 = require("../../storages/domain/storage.entity");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
let StockLevel = class StockLevel {
};
exports.StockLevel = StockLevel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], StockLevel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], StockLevel.prototype, "productVariantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], StockLevel.prototype, "storageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], StockLevel.prototype, "physicalStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], StockLevel.prototype, "committedStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], StockLevel.prototype, "availableStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], StockLevel.prototype, "incomingStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], StockLevel.prototype, "lastTransactionId", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StockLevel.prototype, "lastUpdated", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StockLevel.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "productVariantId" }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], StockLevel.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => storage_entity_1.Storage, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "storageId" }),
    __metadata("design:type", storage_entity_1.Storage)
], StockLevel.prototype, "storage", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => transaction_entity_1.Transaction, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "lastTransactionId" }),
    __metadata("design:type", Object)
], StockLevel.prototype, "lastTransaction", void 0);
exports.StockLevel = StockLevel = __decorate([
    (0, typeorm_1.Entity)("stock_levels"),
    (0, typeorm_1.Index)(['productVariantId', 'storageId'], { unique: true })
], StockLevel);
//# sourceMappingURL=stock-level.entity.js.map