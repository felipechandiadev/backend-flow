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
exports.Person = exports.BankName = exports.AccountTypeName = exports.DocumentType = exports.PersonType = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
var PersonType;
(function (PersonType) {
    PersonType["NATURAL"] = "NATURAL";
    PersonType["COMPANY"] = "COMPANY";
})(PersonType || (exports.PersonType = PersonType = {}));
var DocumentType;
(function (DocumentType) {
    DocumentType["RUN"] = "RUN";
    DocumentType["RUT"] = "RUT";
    DocumentType["PASSPORT"] = "PASSPORT";
    DocumentType["OTHER"] = "OTHER";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var AccountTypeName;
(function (AccountTypeName) {
    AccountTypeName["CUENTA_CORRIENTE"] = "Cuenta Corriente";
    AccountTypeName["CUENTA_AHORRO"] = "Cuenta de Ahorro";
    AccountTypeName["CUENTA_VISTA"] = "Cuenta Vista";
    AccountTypeName["CUENTA_RUT"] = "Cuenta RUT";
    AccountTypeName["CUENTA_CHEQUERA"] = "Cuenta Chequera Electr\u00F3nica";
    AccountTypeName["OTRO_TIPO"] = "Otro";
})(AccountTypeName || (exports.AccountTypeName = AccountTypeName = {}));
var BankName;
(function (BankName) {
    BankName["BANCO_CHILE"] = "Banco de Chile";
    BankName["BANCO_ESTADO"] = "Banco del Estado de Chile";
    BankName["BANCO_SANTANDER"] = "Banco Santander Chile";
    BankName["BANCO_BCI"] = "Banco de Cr\u00E9dito e Inversiones";
    BankName["BANCO_FALABELLA"] = "Banco Falabella";
    BankName["BANCO_SECURITY"] = "Banco Security";
    BankName["BANCO_CREDICHILE"] = "Banco CrediChile";
    BankName["BANCO_ITAU"] = "Banco Ita\u00FA Corpbanca";
    BankName["BANCO_SCOTIABANK"] = "Scotiabank Chile";
    BankName["BANCO_CONSORCIO"] = "Banco Consorcio";
    BankName["BANCO_RIPLEY"] = "Banco Ripley";
    BankName["BANCO_INTERNACIONAL"] = "Banco Internacional";
    BankName["BANCO_BICE"] = "Banco BICE";
    BankName["BANCO_PARIS"] = "Banco Paris";
    BankName["BANCO_MERCADO_PAGO"] = "Banco Mercado Pago";
    BankName["OTRO"] = "Otro";
})(BankName || (exports.BankName = BankName = {}));
let Person = class Person {
};
exports.Person = Person;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Person.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PersonType, default: PersonType.NATURAL }),
    __metadata("design:type", String)
], Person.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Person.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "businessName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DocumentType, nullable: true }),
    __metadata("design:type", Object)
], Person.prototype, "documentType", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "documentNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Person.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Person.prototype, "bankAccounts", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Person.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Person.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Person.prototype, "deletedAt", void 0);
exports.Person = Person = __decorate([
    (0, typeorm_1.Entity)("persons")
], Person);
//# sourceMappingURL=person.entity.js.map