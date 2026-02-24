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
exports.CashDepositsController = void 0;
const common_1 = require("@nestjs/common");
const cash_deposits_service_1 = require("../application/cash-deposits.service");
let CashDepositsController = class CashDepositsController {
    constructor(cashDepositsService) {
        this.cashDepositsService = cashDepositsService;
    }
    async list() {
        return this.cashDepositsService.list();
    }
    async create(payload) {
        return this.cashDepositsService.create(payload);
    }
};
exports.CashDepositsController = CashDepositsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CashDepositsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CashDepositsController.prototype, "create", null);
exports.CashDepositsController = CashDepositsController = __decorate([
    (0, common_1.Controller)('cash-deposits'),
    __metadata("design:paramtypes", [cash_deposits_service_1.CashDepositsService])
], CashDepositsController);
//# sourceMappingURL=cash-deposits.controller.js.map