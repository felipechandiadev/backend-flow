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
exports.CashSessionsServiceFacade = void 0;
const common_1 = require("@nestjs/common");
const cash_session_core_service_1 = require("./cash-session-core.service");
const sales_from_session_service_1 = require("./sales-from-session.service");
const session_inventory_service_1 = require("./session-inventory.service");
let CashSessionsServiceFacade = class CashSessionsServiceFacade {
    constructor(coreService, salesService, inventoryService) {
        this.coreService = coreService;
        this.salesService = salesService;
        this.inventoryService = inventoryService;
        this.logger = new common_1.Logger('CashSessionsServiceFacade');
    }
    async findOne(id) {
        this.logger.warn(`[DEPRECATED] findOne() called. Use CashSessionCoreService.findOne() instead`);
        return this.coreService.findOne(id);
    }
    async findAll(query) {
        this.logger.warn(`[DEPRECATED] findAll() called. Use CashSessionCoreService.findAll() instead`);
        return this.coreService.findAll(query);
    }
    async open(openDto) {
        this.logger.warn(`[DEPRECATED] open() called. Use CashSessionCoreService.open() instead`);
        return this.coreService.open(openDto);
    }
    async getSales(cashSessionId) {
        this.logger.warn(`[DEPRECATED] getSales() called. Use SalesFromSessionService.getSalesForSession() instead`);
        return this.salesService.getSalesForSession(cashSessionId);
    }
    async createSale(createSaleDto) {
        this.logger.warn(`[DEPRECATED] createSale() called. Use SalesFromSessionService.createSale() instead`);
        return this.salesService.createSale(createSaleDto);
    }
    async registerOpeningTransaction(dto) {
        this.logger.warn(`[TODO] registerOpeningTransaction() not yet migrated to new architecture. Placeholder response.`);
        return {
            success: false,
            error: 'registerOpeningTransaction requires refactoring. Use CashSessionCoreService.open() instead',
        };
    }
    async registerCashDeposit(dto) {
        this.logger.warn(`[TODO] registerCashDeposit() not yet migrated. Use CashDepositsService instead.`);
        return {
            success: false,
            error: 'registerCashDeposit requires refactoring. Use CashDepositsService instead',
        };
    }
    async registerCashWithdrawal(dto) {
        this.logger.warn(`[TODO] registerCashWithdrawal() not yet migrated. Use BankWithdrawalsService instead.`);
        return {
            success: false,
            error: 'registerCashWithdrawal requires refactoring. Use BankWithdrawalsService instead',
        };
    }
    async closeCashSession(dto) {
        this.logger.warn(`[DEPRECATED] closeCashSession() called. Use CashSessionCoreService.close() instead`);
        return this.coreService.close(dto.sessionId, dto.userId);
    }
    async addLineItem(saleId, lineItem) {
        this.logger.warn(`[TODO] addLineItem() placeholder. Use SalesFromSessionService.addLineItem() when implemented`);
        return {
            success: false,
            error: 'addLineItem not yet implemented in refactored services',
        };
    }
    async updateLineItem(saleId, lineItemId, updates) {
        this.logger.warn(`[TODO] updateLineItem() placeholder. Use SalesFromSessionService.updateLineItem() when implemented`);
        return {
            success: false,
            error: 'updateLineItem not yet implemented in refactored services',
        };
    }
    async deleteLineItem(saleId, lineItemId) {
        this.logger.warn(`[TODO] deleteLineItem() placeholder. Use SalesFromSessionService.deleteLineItem() when implemented`);
        return {
            success: false,
            error: 'deleteLineItem not yet implemented in refactored services',
        };
    }
    async reconcile(sessionId, physicalAmount) {
        this.logger.warn(`[TODO] reconcile() placeholder. Use CashSessionCoreService.reconcile() when implemented`);
        return {
            success: false,
            error: 'reconcile not yet implemented in refactored services',
        };
    }
    async getInventoryAllocations(sessionId) {
        this.logger.warn(`[TODO] getInventoryAllocations() placeholder. Use SessionInventoryService.getAllocations() when implemented`);
        return {
            success: false,
            error: 'getInventoryAllocations not yet implemented in refactored services',
        };
    }
};
exports.CashSessionsServiceFacade = CashSessionsServiceFacade;
exports.CashSessionsServiceFacade = CashSessionsServiceFacade = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cash_session_core_service_1.CashSessionCoreService,
        sales_from_session_service_1.SalesFromSessionService,
        session_inventory_service_1.SessionInventoryService])
], CashSessionsServiceFacade);
//# sourceMappingURL=cash-sessions-facade.service.js.map