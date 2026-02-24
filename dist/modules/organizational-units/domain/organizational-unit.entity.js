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
exports.OrganizationalUnit = exports.OrganizationalUnitType = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../../companies/domain/company.entity");
const branch_entity_1 = require("../../branches/domain/branch.entity");
const result_center_entity_1 = require("../../result-centers/domain/result-center.entity");
var OrganizationalUnitType;
(function (OrganizationalUnitType) {
    OrganizationalUnitType["HEADQUARTERS"] = "HEADQUARTERS";
    OrganizationalUnitType["STORE"] = "STORE";
    OrganizationalUnitType["BACKOFFICE"] = "BACKOFFICE";
    OrganizationalUnitType["OPERATIONS"] = "OPERATIONS";
    OrganizationalUnitType["SALES"] = "SALES";
    OrganizationalUnitType["OTHER"] = "OTHER";
})(OrganizationalUnitType || (exports.OrganizationalUnitType = OrganizationalUnitType = {}));
let OrganizationalUnit = class OrganizationalUnit {
};
exports.OrganizationalUnit = OrganizationalUnit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrganizationalUnit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrganizationalUnit.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], OrganizationalUnit.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 150 }),
    __metadata("design:type", String)
], OrganizationalUnit.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], OrganizationalUnit.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: OrganizationalUnitType, default: OrganizationalUnitType.OTHER }),
    __metadata("design:type", String)
], OrganizationalUnit.prototype, "unitType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], OrganizationalUnit.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], OrganizationalUnit.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], OrganizationalUnit.prototype, "resultCenterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], OrganizationalUnit.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], OrganizationalUnit.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OrganizationalUnit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], OrganizationalUnit.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], OrganizationalUnit.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "companyId" }),
    __metadata("design:type", company_entity_1.Company)
], OrganizationalUnit.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => OrganizationalUnit, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "parentId" }),
    __metadata("design:type", Object)
], OrganizationalUnit.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "branchId" }),
    __metadata("design:type", Object)
], OrganizationalUnit.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => result_center_entity_1.ResultCenter, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "resultCenterId" }),
    __metadata("design:type", Object)
], OrganizationalUnit.prototype, "resultCenter", void 0);
exports.OrganizationalUnit = OrganizationalUnit = __decorate([
    (0, typeorm_1.Entity)("organizational_units")
], OrganizationalUnit);
//# sourceMappingURL=organizational-unit.entity.js.map