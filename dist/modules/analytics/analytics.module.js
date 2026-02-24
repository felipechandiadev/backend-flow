"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const analytics_service_1 = require("./application/analytics.service");
const analytics_controller_1 = require("./presentation/analytics.controller");
const customer_entity_1 = require("../customers/domain/customer.entity");
const transaction_entity_1 = require("../transactions/domain/transaction.entity");
const stock_level_entity_1 = require("../stock-levels/domain/stock-level.entity");
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([customer_entity_1.Customer, transaction_entity_1.Transaction, stock_level_entity_1.StockLevel]),
        ],
        providers: [analytics_service_1.AnalyticsService],
        controllers: [analytics_controller_1.AnalyticsController],
    })
], AnalyticsModule);
//# sourceMappingURL=analytics.module.js.map