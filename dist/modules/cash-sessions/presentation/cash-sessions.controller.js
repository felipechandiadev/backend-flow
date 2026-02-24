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
exports.CashSessionsController = void 0;
const common_1 = require("@nestjs/common");
const cash_sessions_service_1 = require("../application/cash-sessions.service");
const cash_session_integrity_service_1 = require("../application/cash-session-integrity.service");
const cash_session_core_service_1 = require("../application/cash-session-core.service");
const sales_from_session_service_1 = require("../application/sales-from-session.service");
const opening_transaction_dto_1 = require("../application/dto/opening-transaction.dto");
const get_cash_sessions_dto_1 = require("../application/dto/get-cash-sessions.dto");
const open_cash_session_dto_1 = require("../application/dto/open-cash-session.dto");
const create_sale_dto_1 = require("../application/dto/create-sale.dto");
let CashSessionsController = class CashSessionsController {
    constructor(coreService, salesService, cashSessionsService, integrityService) {
        this.coreService = coreService;
        this.salesService = salesService;
        this.cashSessionsService = cashSessionsService;
        this.integrityService = integrityService;
    }
    async findAll(query) {
        return this.coreService.findAll(query);
    }
    async findOne(id) {
        return this.coreService.findOne(id);
    }
    async open(openDto) {
        return this.coreService.open(openDto);
    }
    async getSales(id) {
        return this.salesService.getSalesForSession(id);
    }
    async createSale(createSaleDto) {
        return this.salesService.createSale(createSaleDto);
    }
    async registerOpeningTransaction(dto) {
        return this.cashSessionsService.registerOpeningTransaction(dto);
    }
    async registerCashDeposit(dto) {
        return this.cashSessionsService.registerCashDeposit(dto);
    }
    async registerCashWithdrawal(dto) {
        return this.cashSessionsService.registerCashWithdrawal(dto);
    }
    async close(dto) {
        const sessionId = dto.sessionId || dto.cashSessionId;
        const userId = dto.userId || dto.closedById || dto.user?.id;
        const userName = dto.userName;
        if (!sessionId) {
            throw new common_1.BadRequestException('sessionId es requerido para cerrar la sesión');
        }
        if (userId) {
            return this.coreService.close(sessionId, userId);
        }
        if (userName) {
            return this.coreService.closeByUserName(sessionId, userName);
        }
        throw new common_1.BadRequestException('userId o userName es requerido para cerrar la sesión');
    }
    async checkIntegrity() {
        return this.integrityService.validateIntegrity();
    }
    async cleanupIntegrity() {
        return this.integrityService.cleanupCorruptSessions();
    }
};
exports.CashSessionsController = CashSessionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_cash_sessions_dto_1.GetCashSessionsDto]),
    __metadata("design:returntype", Promise)
], CashSessionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CashSessionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [open_cash_session_dto_1.OpenCashSessionDto]),
    __metadata("design:returntype", Promise)
], CashSessionsController.prototype, "open", null);
__decorate([
    (0, common_1.Get)(':id/sales'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CashSessionsController.prototype, "getSales", null);
__decorate([
    (0, common_1.Post)('sales'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sale_dto_1.CreateSaleDto]),
    __metadata("design:returntype", Promise)
], CashSessionsController.prototype, "createSale", null);
__decorate([
    (0, common_1.Post)('opening-transaction'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [opening_transaction_dto_1.OpeningTransactionDto]),
    __metadata("design:returntype", Promise)
], CashSessionsController.prototype, "registerOpeningTransaction", null);
__decorate([
    (0, common_1.Post)('cash-deposits'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CashSessionsController.prototype, "registerCashDeposit", null);
__decorate([
    (0, common_1.Post)('cash-withdrawals'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CashSessionsController.prototype, "registerCashWithdrawal", null);
__decorate([
    (0, common_1.Post)('close'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CashSessionsController.prototype, "close", null);
__decorate([
    (0, common_1.Get)('integrity/check'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CashSessionsController.prototype, "checkIntegrity", null);
__decorate([
    (0, common_1.Post)('integrity/cleanup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CashSessionsController.prototype, "cleanupIntegrity", null);
exports.CashSessionsController = CashSessionsController = __decorate([
    (0, common_1.Controller)('cash-sessions'),
    __metadata("design:paramtypes", [cash_session_core_service_1.CashSessionCoreService,
        sales_from_session_service_1.SalesFromSessionService,
        cash_sessions_service_1.CashSessionsService,
        cash_session_integrity_service_1.CashSessionIntegrityService])
], CashSessionsController);
//# sourceMappingURL=cash-sessions.controller.js.map