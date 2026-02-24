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
exports.User = exports.UserRole = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const person_entity_1 = require("../../persons/domain/person.entity");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["OPERATOR"] = "OPERATOR";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar"),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar"),
    __metadata("design:type", String)
], User.prototype, "pass", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar"),
    __metadata("design:type", String)
], User.prototype, "mail", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserRole,
        default: UserRole.OPERATOR
    }),
    __metadata("design:type", String)
], User.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => person_entity_1.Person, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", person_entity_1.Person)
], User.prototype, "person", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)("users")
], User);
//# sourceMappingURL=user.entity.js.map