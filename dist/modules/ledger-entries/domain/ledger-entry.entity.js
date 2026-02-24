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
exports.LedgerEntry = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
const accounting_account_entity_1 = require("../../accounting-accounts/domain/accounting-account.entity");
const person_entity_1 = require("../../persons/domain/person.entity");
let LedgerEntry = class LedgerEntry {
};
exports.LedgerEntry = LedgerEntry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], LedgerEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", Object)
], LedgerEntry.prototype, "personId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime" }),
    __metadata("design:type", Date)
], LedgerEntry.prototype, "entryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], LedgerEntry.prototype, "debit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], LedgerEntry.prototype, "credit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], LedgerEntry.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LedgerEntry.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => transaction_entity_1.Transaction, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "transactionId" }),
    __metadata("design:type", transaction_entity_1.Transaction)
], LedgerEntry.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => accounting_account_entity_1.AccountingAccount, { onDelete: "RESTRICT" }),
    (0, typeorm_1.JoinColumn)({ name: "accountId" }),
    __metadata("design:type", accounting_account_entity_1.AccountingAccount)
], LedgerEntry.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => person_entity_1.Person, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "personId" }),
    __metadata("design:type", Object)
], LedgerEntry.prototype, "person", void 0);
exports.LedgerEntry = LedgerEntry = __decorate([
    (0, typeorm_1.Entity)("ledger_entries"),
    (0, typeorm_1.Index)(['transactionId']),
    (0, typeorm_1.Index)(['accountId', 'entryDate']),
    (0, typeorm_1.Index)(['personId', 'entryDate'])
], LedgerEntry);
//# sourceMappingURL=ledger-entry.entity.js.map