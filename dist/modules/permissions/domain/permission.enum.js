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
exports.Permission = exports.ALL_ABILITIES = exports.Ability = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/domain/user.entity");
var Ability;
(function (Ability) {
    Ability["DASHBOARD_MENU"] = "DASHBOARD_MENU";
    Ability["RECEPTIONS_MENU"] = "RECEPTIONS_MENU";
    Ability["RECEPTIONS_CREATE_MENU"] = "RECEPTIONS_CREATE_MENU";
    Ability["RECEPTIONS_DELETE"] = "RECEPTIONS_DELETE";
    Ability["RECEPTIONS_UPDATE_IMPURITY"] = "RECEPTIONS_UPDATE_IMPURITY";
    Ability["RECEPTIONS_UPDATE_PRICE"] = "RECEPTIONS_UPDATE_PRICE";
    Ability["RECEPTIONS_UPDATE_DATE"] = "RECEPTIONS_UPDATE_DATE";
    Ability["RECEPTIONS_PRINT_DETAIL"] = "RECEPTIONS_PRINT_DETAIL";
    Ability["PRODUCERS_MENU"] = "PRODUCERS_MENU";
    Ability["PRODUCERS_CREATE"] = "PRODUCERS_CREATE";
    Ability["PRODUCERS_UPDATE"] = "PRODUCERS_UPDATE";
    Ability["PRODUCERS_DELETE"] = "PRODUCERS_DELETE";
    Ability["PRODUCERS_PRINT_DETAIL"] = "PRODUCERS_PRINT_DETAIL";
    Ability["PRODUCERS_CREATE_BANK_ACCOUNT"] = "PRODUCERS_CREATE_BANK_ACCOUNT";
    Ability["PRODUCERS_UPDATE_BANK_ACCOUNT"] = "PRODUCERS_UPDATE_BANK_ACCOUNT";
    Ability["PRODUCERS_DELETE_BANK_ACCOUNT"] = "PRODUCERS_DELETE_BANK_ACCOUNT";
    Ability["PRODUCTIVE_UNITS_MENU"] = "PRODUCTIVE_UNITS_MENU";
    Ability["PRODUCTIVE_UNITS_CREATE"] = "PRODUCTIVE_UNITS_CREATE";
    Ability["PRODUCTIVE_UNITS_UPDATE"] = "PRODUCTIVE_UNITS_UPDATE";
    Ability["PRODUCTIVE_UNITS_DELETE"] = "PRODUCTIVE_UNITS_DELETE";
    Ability["SEASONS_MENU"] = "SEASONS_MENU";
    Ability["SEASONS_CREATE"] = "SEASONS_CREATE";
    Ability["SEASONS_UPDATE"] = "SEASONS_UPDATE";
    Ability["SEASONS_DELETE"] = "SEASONS_DELETE";
    Ability["ADVANCES_MENU"] = "ADVANCES_MENU";
    Ability["ADVANCES_CREATE"] = "ADVANCES_CREATE";
    Ability["ADVANCES_DELETE"] = "ADVANCES_DELETE";
    Ability["ADVANCES_PRINT_RECEIPT"] = "ADVANCES_PRINT_RECEIPT";
    Ability["ADVANCES_DETAIL"] = "ADVANCES_DETAIL";
    Ability["ADVANCES_UPDATE_DATE"] = "ADVANCES_UPDATE_DATE";
    Ability["SETTLEMENTS_MENU"] = "SETTLEMENTS_MENU";
    Ability["SETTLEMENTS_VIEW"] = "SETTLEMENTS_VIEW";
    Ability["SETTLEMENTS_CREATE"] = "SETTLEMENTS_CREATE";
    Ability["SETTLEMENTS_UPDATE"] = "SETTLEMENTS_UPDATE";
    Ability["SETTLEMENTS_DELETE"] = "SETTLEMENTS_DELETE";
    Ability["SETTLEMENTS_PRINT_DETAIL"] = "SETTLEMENTS_PRINT_DETAIL";
    Ability["SETTLEMENTS_UPDATE_DATE"] = "SETTLEMENTS_UPDATE_DATE";
    Ability["ADMIN_BANK_ACCOUNTS_MENU"] = "ADMIN_BANK_ACCOUNTS_MENU";
    Ability["ADMIN_BANK_ACCOUNTS_VIEW"] = "ADMIN_BANK_ACCOUNTS_VIEW";
    Ability["ADMIN_BANK_ACCOUNTS_CREATE"] = "ADMIN_BANK_ACCOUNTS_CREATE";
    Ability["ADMIN_BANK_ACCOUNTS_UPDATE"] = "ADMIN_BANK_ACCOUNTS_UPDATE";
    Ability["ADMIN_BANK_ACCOUNTS_DELETE"] = "ADMIN_BANK_ACCOUNTS_DELETE";
    Ability["CUSTOMERS_MENU"] = "CUSTOMERS_MENU";
    Ability["CUSTOMERS_CREATE"] = "CUSTOMERS_CREATE";
    Ability["CUSTOMERS_UPDATE"] = "CUSTOMERS_UPDATE";
    Ability["CUSTOMERS_DELETE"] = "CUSTOMERS_DELETE";
    Ability["DISPATCHES_MENU"] = "DISPATCHES_MENU";
    Ability["DISPATCHES_CREATE"] = "DISPATCHES_CREATE";
    Ability["DISPATCHES_PRINT_DETAIL"] = "DISPATCHES_PRINT_DETAIL";
    Ability["DISPATCHES_UPDATE_DATE"] = "DISPATCHES_UPDATE_DATE";
    Ability["DISPATCHES_UPDATE_PRICE"] = "DISPATCHES_UPDATE_PRICE";
    Ability["DISPATCHES_UPDATE_PALLETS"] = "DISPATCHES_UPDATE_PALLETS";
    Ability["VARIETIES_MENU"] = "VARIETIES_MENU";
    Ability["VARIETIES_CREATE"] = "VARIETIES_CREATE";
    Ability["VARIETIES_UPDATE"] = "VARIETIES_UPDATE";
    Ability["VARIETIES_DELETE"] = "VARIETIES_DELETE";
    Ability["FORMATS_MENU"] = "FORMATS_MENU";
    Ability["FORMATS_CREATE"] = "FORMATS_CREATE";
    Ability["FORMATS_UPDATE"] = "FORMATS_UPDATE";
    Ability["FORMATS_DELETE"] = "FORMATS_DELETE";
    Ability["TRAYS_MENU"] = "TRAYS_MENU";
    Ability["TRAYS_CREATE"] = "TRAYS_CREATE";
    Ability["TRAYS_UPDATE"] = "TRAYS_UPDATE";
    Ability["TRAYS_DELETE"] = "TRAYS_DELETE";
    Ability["TRAYS_AJUST_STOCK"] = "TRAYS_AJUST_STOCK";
    Ability["TRAYS_DELIVERY"] = "TRAYS_DELIVERY";
    Ability["TRAYS_RECEPTION"] = "TRAYS_RECEPTION";
    Ability["AUDIT_MENU"] = "AUDIT_MENU";
    Ability["USERS_MENU"] = "USERS_MENU";
    Ability["USERS_CREATE"] = "USERS_CREATE";
    Ability["USERS_UPDATE"] = "USERS_UPDATE";
    Ability["USERS_DELETE"] = "USERS_DELETE";
})(Ability || (exports.Ability = Ability = {}));
exports.ALL_ABILITIES = Object.values(Ability);
let Permission = class Permission {
};
exports.Permission = Permission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Permission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Permission.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Permission.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Permission.prototype, "ability", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Permission.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Permission.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Permission.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Permission.prototype, "deletedAt", void 0);
exports.Permission = Permission = __decorate([
    (0, typeorm_1.Unique)(['userId', 'ability']),
    (0, typeorm_1.Entity)('permissions')
], Permission);
//# sourceMappingURL=permission.enum.js.map