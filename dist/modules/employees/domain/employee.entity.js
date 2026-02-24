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
exports.Employee = exports.EmployeeStatus = exports.EmploymentType = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../../companies/domain/company.entity");
const person_entity_1 = require("../../persons/domain/person.entity");
const branch_entity_1 = require("../../branches/domain/branch.entity");
const result_center_entity_1 = require("../../result-centers/domain/result-center.entity");
const organizational_unit_entity_1 = require("../../organizational-units/domain/organizational-unit.entity");
var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FULL_TIME"] = "FULL_TIME";
    EmploymentType["PART_TIME"] = "PART_TIME";
    EmploymentType["CONTRACTOR"] = "CONTRACTOR";
    EmploymentType["TEMPORARY"] = "TEMPORARY";
    EmploymentType["INTERN"] = "INTERN";
})(EmploymentType || (exports.EmploymentType = EmploymentType = {}));
var EmployeeStatus;
(function (EmployeeStatus) {
    EmployeeStatus["ACTIVE"] = "ACTIVE";
    EmployeeStatus["SUSPENDED"] = "SUSPENDED";
    EmployeeStatus["TERMINATED"] = "TERMINATED";
})(EmployeeStatus || (exports.EmployeeStatus = EmployeeStatus = {}));
let Employee = class Employee {
};
exports.Employee = Employee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Employee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Employee.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Employee.prototype, "personId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], Employee.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], Employee.prototype, "resultCenterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], Employee.prototype, "organizationalUnitId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: EmploymentType, default: EmploymentType.FULL_TIME }),
    __metadata("design:type", String)
], Employee.prototype, "employmentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: EmployeeStatus, default: EmployeeStatus.ACTIVE }),
    __metadata("design:type", String)
], Employee.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], Employee.prototype, "hireDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Object)
], Employee.prototype, "terminationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", nullable: true }),
    __metadata("design:type", Object)
], Employee.prototype, "baseSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], Employee.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Employee.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Employee.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Employee.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "companyId" }),
    __metadata("design:type", company_entity_1.Company)
], Employee.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => person_entity_1.Person, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "personId" }),
    __metadata("design:type", person_entity_1.Person)
], Employee.prototype, "person", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "branchId" }),
    __metadata("design:type", Object)
], Employee.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => result_center_entity_1.ResultCenter, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "resultCenterId" }),
    __metadata("design:type", Object)
], Employee.prototype, "resultCenter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizational_unit_entity_1.OrganizationalUnit, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "organizationalUnitId" }),
    __metadata("design:type", Object)
], Employee.prototype, "organizationalUnit", void 0);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)("employees")
], Employee);
//# sourceMappingURL=employee.entity.js.map