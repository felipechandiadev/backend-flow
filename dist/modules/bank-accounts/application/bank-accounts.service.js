"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountsService = void 0;
const common_1 = require("@nestjs/common");
let BankAccountsService = class BankAccountsService {
    async getCashBalance() {
        return { balance: 0 };
    }
    async list() {
        return [];
    }
    async findOne() {
        return null;
    }
    async create() {
        return { success: true };
    }
    async update() {
        return { success: true };
    }
    async remove() {
        return { success: true };
    }
};
exports.BankAccountsService = BankAccountsService;
exports.BankAccountsService = BankAccountsService = __decorate([
    (0, common_1.Injectable)()
], BankAccountsService);
//# sourceMappingURL=bank-accounts.service.js.map