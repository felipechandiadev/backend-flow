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
exports.Unit = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const unit_dimension_enum_1 = require("./unit-dimension.enum");
const decimalTransformer = {
    to: (value) => (value ?? null),
    from: (value) => (value === null || value === undefined ? null : Number(value)),
};
let Unit = class Unit {
};
exports.Unit = Unit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Unit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Unit.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Unit.prototype, "symbol", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: unit_dimension_enum_1.UnitDimension }),
    __metadata("design:type", String)
], Unit.prototype, "dimension", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 9,
        transformer: decimalTransformer,
    }),
    __metadata("design:type", Number)
], Unit.prototype, "conversionFactor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Unit.prototype, "allowDecimals", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Unit.prototype, "isBase", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 36, name: 'base_unit_id', nullable: true }),
    __metadata("design:type", Object)
], Unit.prototype, "baseUnitId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Unit, (unit) => unit.derivedUnits, {
        nullable: true,
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'base_unit_id' }),
    __metadata("design:type", Object)
], Unit.prototype, "baseUnit", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Unit, (unit) => unit.baseUnit),
    __metadata("design:type", Array)
], Unit.prototype, "derivedUnits", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Unit.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Unit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Unit.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Unit.prototype, "deletedAt", void 0);
exports.Unit = Unit = __decorate([
    (0, typeorm_1.Index)('uq_units_symbol', ['symbol'], {
        unique: true,
    }),
    (0, typeorm_1.Entity)('units')
], Unit);
//# sourceMappingURL=unit.entity.js.map