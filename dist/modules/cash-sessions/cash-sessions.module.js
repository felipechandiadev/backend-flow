"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashSessionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cash_sessions_controller_1 = require("./presentation/cash-sessions.controller");
const cash_sessions_service_1 = require("./application/cash-sessions.service");
const cash_session_integrity_service_1 = require("./application/cash-session-integrity.service");
const cash_session_core_service_1 = require("./application/cash-session-core.service");
const sales_from_session_service_1 = require("./application/sales-from-session.service");
const session_inventory_service_1 = require("./application/session-inventory.service");
const cash_sessions_facade_service_1 = require("./application/cash-sessions-facade.service");
const cash_session_entity_1 = require("./domain/cash-session.entity");
const point_of_sale_entity_1 = require("../points-of-sale/domain/point-of-sale.entity");
const user_entity_1 = require("../users/domain/user.entity");
const transaction_entity_1 = require("../transactions/domain/transaction.entity");
const transaction_line_entity_1 = require("../transaction-lines/domain/transaction-line.entity");
const product_variant_entity_1 = require("../product-variants/domain/product-variant.entity");
const treasury_account_entity_1 = require("../treasury-accounts/domain/treasury-account.entity");
const stock_level_entity_1 = require("../stock-levels/domain/stock-level.entity");
const product_entity_1 = require("../products/domain/product.entity");
const storage_entity_1 = require("../storages/domain/storage.entity");
const transactions_module_1 = require("../transactions/transactions.module");
let CashSessionsModule = class CashSessionsModule {
};
exports.CashSessionsModule = CashSessionsModule;
exports.CashSessionsModule = CashSessionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                cash_session_entity_1.CashSession,
                point_of_sale_entity_1.PointOfSale,
                user_entity_1.User,
                transaction_entity_1.Transaction,
                transaction_line_entity_1.TransactionLine,
                product_variant_entity_1.ProductVariant,
                treasury_account_entity_1.TreasuryAccount,
                stock_level_entity_1.StockLevel,
                product_entity_1.Product,
                storage_entity_1.Storage,
            ]),
            transactions_module_1.TransactionsModule,
        ],
        controllers: [cash_sessions_controller_1.CashSessionsController],
        providers: [
            cash_sessions_service_1.CashSessionsService,
            cash_session_integrity_service_1.CashSessionIntegrityService,
            cash_session_core_service_1.CashSessionCoreService,
            sales_from_session_service_1.SalesFromSessionService,
            session_inventory_service_1.SessionInventoryService,
            cash_sessions_facade_service_1.CashSessionsServiceFacade,
        ],
        exports: [
            cash_sessions_service_1.CashSessionsService,
            cash_session_integrity_service_1.CashSessionIntegrityService,
            cash_session_core_service_1.CashSessionCoreService,
            sales_from_session_service_1.SalesFromSessionService,
            session_inventory_service_1.SessionInventoryService,
            cash_sessions_facade_service_1.CashSessionsServiceFacade,
        ],
    })
], CashSessionsModule);
//# sourceMappingURL=cash-sessions.module.js.map