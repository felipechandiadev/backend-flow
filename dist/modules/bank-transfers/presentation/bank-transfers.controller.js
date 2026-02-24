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
exports.BankTransfersController = void 0;
const common_1 = require("@nestjs/common");
const bank_transfers_service_1 = require("../application/bank-transfers.service");
let BankTransfersController = class BankTransfersController {
    constructor(bankTransfersService) {
        this.bankTransfersService = bankTransfersService;
    }
    async list() {
        return this.bankTransfersService.list();
    }
    async create(payload) {
        return this.bankTransfersService.create(payload);
    }
};
exports.BankTransfersController = BankTransfersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BankTransfersController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BankTransfersController.prototype, "create", null);
exports.BankTransfersController = BankTransfersController = __decorate([
    (0, common_1.Controller)('bank-transfers'),
    __metadata("design:paramtypes", [bank_transfers_service_1.BankTransfersService])
], BankTransfersController);
//# sourceMappingURL=bank-transfers.controller.js.map