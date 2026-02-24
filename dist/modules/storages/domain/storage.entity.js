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
exports.Storage = exports.StorageCategory = exports.StorageType = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const branch_entity_1 = require("../../branches/domain/branch.entity");
var StorageType;
(function (StorageType) {
    StorageType["WAREHOUSE"] = "WAREHOUSE";
    StorageType["STORE"] = "STORE";
    StorageType["COLD_ROOM"] = "COLD_ROOM";
    StorageType["TRANSIT"] = "TRANSIT";
})(StorageType || (exports.StorageType = StorageType = {}));
var StorageCategory;
(function (StorageCategory) {
    StorageCategory["IN_BRANCH"] = "IN_BRANCH";
    StorageCategory["CENTRAL"] = "CENTRAL";
    StorageCategory["EXTERNAL"] = "EXTERNAL";
})(StorageCategory || (exports.StorageCategory = StorageCategory = {}));
let Storage = class Storage {
};
exports.Storage = Storage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Storage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Storage.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Storage.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Storage.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: StorageType, default: StorageType.WAREHOUSE }),
    __metadata("design:type", String)
], Storage.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: StorageCategory, default: StorageCategory.IN_BRANCH }),
    __metadata("design:type", String)
], Storage.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Storage.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Storage.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Storage.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Storage.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Storage.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Storage.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Storage.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'branchId' }),
    __metadata("design:type", branch_entity_1.Branch)
], Storage.prototype, "branch", void 0);
exports.Storage = Storage = __decorate([
    (0, typeorm_1.Entity)("storages")
], Storage);
//# sourceMappingURL=storage.entity.js.map