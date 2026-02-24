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
exports.Supplier = exports.SupplierType = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const person_entity_1 = require("../../persons/domain/person.entity");
var SupplierType;
(function (SupplierType) {
    SupplierType["MANUFACTURER"] = "MANUFACTURER";
    SupplierType["DISTRIBUTOR"] = "DISTRIBUTOR";
    SupplierType["WHOLESALER"] = "WHOLESALER";
    SupplierType["LOCAL"] = "LOCAL";
})(SupplierType || (exports.SupplierType = SupplierType = {}));
let Supplier = class Supplier {
};
exports.Supplier = Supplier;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Supplier.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Supplier.prototype, "personId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SupplierType, default: SupplierType.LOCAL }),
    __metadata("design:type", String)
], Supplier.prototype, "supplierType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "alias", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Supplier.prototype, "defaultPaymentTermDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Supplier.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Supplier.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Supplier.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Supplier.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => person_entity_1.Person, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'personId' }),
    __metadata("design:type", person_entity_1.Person)
], Supplier.prototype, "person", void 0);
exports.Supplier = Supplier = __decorate([
    (0, typeorm_1.Entity)("suppliers")
], Supplier);
//# sourceMappingURL=supplier.entity.js.map