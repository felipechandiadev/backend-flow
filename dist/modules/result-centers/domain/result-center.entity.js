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
exports.ResultCenter = exports.ResultCenterType = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../../companies/domain/company.entity");
const branch_entity_1 = require("../../branches/domain/branch.entity");
var ResultCenterType;
(function (ResultCenterType) {
    ResultCenterType["DIRECT"] = "DIRECT";
    ResultCenterType["SUPPORT"] = "SUPPORT";
    ResultCenterType["ADMIN"] = "ADMIN";
    ResultCenterType["INVESTMENT"] = "INVESTMENT";
    ResultCenterType["SALES"] = "SALES";
    ResultCenterType["OPERATIONS"] = "OPERATIONS";
    ResultCenterType["MARKETING"] = "MARKETING";
    ResultCenterType["OTHER"] = "OTHER";
})(ResultCenterType || (exports.ResultCenterType = ResultCenterType = {}));
let ResultCenter = class ResultCenter {
};
exports.ResultCenter = ResultCenter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ResultCenter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], ResultCenter.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], ResultCenter.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], ResultCenter.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], ResultCenter.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], ResultCenter.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], ResultCenter.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ResultCenterType, default: ResultCenterType.OTHER }),
    __metadata("design:type", String)
], ResultCenter.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], ResultCenter.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ResultCenter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ResultCenter.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "companyId" }),
    __metadata("design:type", company_entity_1.Company)
], ResultCenter.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ResultCenter, (rc) => rc.children, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "parentId" }),
    __metadata("design:type", Object)
], ResultCenter.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ResultCenter, (rc) => rc.parent),
    __metadata("design:type", Array)
], ResultCenter.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "branchId" }),
    __metadata("design:type", Object)
], ResultCenter.prototype, "branch", void 0);
exports.ResultCenter = ResultCenter = __decorate([
    (0, typeorm_1.Entity)("result_centers")
], ResultCenter);
//# sourceMappingURL=result-center.entity.js.map