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
exports.Shareholder = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../../companies/domain/company.entity");
const person_entity_1 = require("../../persons/domain/person.entity");
let Shareholder = class Shareholder {
};
exports.Shareholder = Shareholder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Shareholder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Shareholder.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Shareholder.prototype, "personId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 120, nullable: true }),
    __metadata("design:type", Object)
], Shareholder.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Shareholder.prototype, "ownershipPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], Shareholder.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], Shareholder.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], Shareholder.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Shareholder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Shareholder.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Shareholder.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "companyId" }),
    __metadata("design:type", company_entity_1.Company)
], Shareholder.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => person_entity_1.Person, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "personId" }),
    __metadata("design:type", person_entity_1.Person)
], Shareholder.prototype, "person", void 0);
exports.Shareholder = Shareholder = __decorate([
    (0, typeorm_1.Entity)("shareholders"),
    (0, typeorm_1.Index)(["companyId", "isActive"]),
    (0, typeorm_1.Index)(["companyId", "personId"], { unique: true })
], Shareholder);
//# sourceMappingURL=shareholder.entity.js.map