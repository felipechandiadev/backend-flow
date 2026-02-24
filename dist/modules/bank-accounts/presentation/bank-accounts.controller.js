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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountsController = void 0;
const common_1 = require("@nestjs/common");
const bank_accounts_service_1 = require("../application/bank-accounts.service");
let BankAccountsController = class BankAccountsController {
    constructor(bankAccountsService) {
        this.bankAccountsService = bankAccountsService;
    }
    async getCashBalance() {
        return this.bankAccountsService.getCashBalance();
    }
    async list() {
        return this.bankAccountsService.list();
    }
    async findOne(_id) {
        return this.bankAccountsService.findOne();
    }
    async create(_data) {
        return this.bankAccountsService.create();
    }
    async update(_id, _data) {
        return this.bankAccountsService.update();
    }
    async remove(_id) {
        return this.bankAccountsService.remove();
    }
};
exports.BankAccountsController = BankAccountsController;
__decorate([
    (0, common_1.Get)('cash-balance'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "getCashBalance", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "remove", null);
exports.BankAccountsController = BankAccountsController = __decorate([
    (0, common_1.Controller)('bank-accounts'),
    __metadata("design:paramtypes", [bank_accounts_service_1.BankAccountsService])
], BankAccountsController);
//# sourceMappingURL=bank-accounts.controller.js.map