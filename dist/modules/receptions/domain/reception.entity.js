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
exports.Reception = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const storage_entity_1 = require("../../storages/domain/storage.entity");
const branch_entity_1 = require("../../branches/domain/branch.entity");
const supplier_entity_1 = require("../../suppliers/domain/supplier.entity");
const user_entity_1 = require("../../users/domain/user.entity");
let Reception = class Reception {
};
exports.Reception = Reception;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Reception.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'direct' }),
    __metadata("design:type", String)
], Reception.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Reception.prototype, "storageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Reception.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Reception.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Reception.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Reception.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Reception.prototype, "documentNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Reception.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Reception.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Reception.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Reception.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Reception.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Reception.prototype, "lineCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Reception.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Reception.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Reception.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Reception.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => storage_entity_1.Storage, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'storageId' }),
    __metadata("design:type", storage_entity_1.Storage)
], Reception.prototype, "storage", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'branchId' }),
    __metadata("design:type", branch_entity_1.Branch)
], Reception.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'supplierId' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], Reception.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Reception.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('ReceptionLine', 'reception'),
    __metadata("design:type", Array)
], Reception.prototype, "lines", void 0);
exports.Reception = Reception = __decorate([
    (0, typeorm_1.Entity)('receptions'),
    (0, typeorm_1.Index)(['storageId']),
    (0, typeorm_1.Index)(['supplierId']),
    (0, typeorm_1.Index)(['branchId']),
    (0, typeorm_1.Index)(['createdAt'])
], Reception);
//# sourceMappingURL=reception.entity.js.map