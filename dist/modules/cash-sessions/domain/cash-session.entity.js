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
exports.CashSession = exports.CashSessionStatus = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const point_of_sale_entity_1 = require("../../points-of-sale/domain/point-of-sale.entity");
const user_entity_1 = require("../../users/domain/user.entity");
var CashSessionStatus;
(function (CashSessionStatus) {
    CashSessionStatus["OPEN"] = "OPEN";
    CashSessionStatus["CLOSED"] = "CLOSED";
    CashSessionStatus["RECONCILED"] = "RECONCILED";
})(CashSessionStatus || (exports.CashSessionStatus = CashSessionStatus = {}));
let CashSession = class CashSession {
};
exports.CashSession = CashSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], CashSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CashSession.prototype, "pointOfSaleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CashSession.prototype, "openedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CashSession.prototype, "closedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CashSessionStatus, default: CashSessionStatus.OPEN }),
    __metadata("design:type", String)
], CashSession.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CashSession.prototype, "openingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], CashSession.prototype, "closingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], CashSession.prototype, "expectedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], CashSession.prototype, "difference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], CashSession.prototype, "openedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], CashSession.prototype, "closedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CashSession.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], CashSession.prototype, "closingDetails", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CashSession.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CashSession.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], CashSession.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => point_of_sale_entity_1.PointOfSale, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'pointOfSaleId' }),
    __metadata("design:type", point_of_sale_entity_1.PointOfSale)
], CashSession.prototype, "pointOfSale", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'openedById' }),
    __metadata("design:type", user_entity_1.User)
], CashSession.prototype, "openedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'closedById' }),
    __metadata("design:type", user_entity_1.User)
], CashSession.prototype, "closedBy", void 0);
exports.CashSession = CashSession = __decorate([
    (0, typeorm_1.Entity)("cash_sessions")
], CashSession);
//# sourceMappingURL=cash-session.entity.js.map