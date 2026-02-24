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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("../../customers/domain/customer.entity");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
const stock_level_entity_1 = require("../../stock-levels/domain/stock-level.entity");
let AnalyticsService = class AnalyticsService {
    constructor(customerRepository, transactionRepository, stockLevelRepository) {
        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
        this.stockLevelRepository = stockLevelRepository;
    }
    async getDashboardStats() {
        return this.computeStats();
    }
    async computeStats() {
        const totalCustomers = await this.customerRepository.count({ where: { isActive: true } });
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const raw = await this.transactionRepository
            .createQueryBuilder('t')
            .select('COALESCE(SUM(t.total),0)', 'sum')
            .where('t.transactionType = :sale', { sale: transaction_entity_1.TransactionType.SALE })
            .andWhere('t.createdAt >= :today', { today: todayStart })
            .getRawOne();
        const salesToday = Number(raw?.sum || 0);
        const threshold = 10;
        const lowStockItems = await this.stockLevelRepository.count({
            where: { availableStock: (0, typeorm_2.LessThan)(threshold) },
        });
        const openOrders = await this.transactionRepository.count({
            where: {
                transactionType: transaction_entity_1.TransactionType.PURCHASE_ORDER,
                status: (0, typeorm_2.Not)(transaction_entity_1.TransactionStatus.CANCELLED),
            },
        });
        return { salesToday, totalCustomers, lowStockItems, openOrders };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(2, (0, typeorm_1.InjectRepository)(stock_level_entity_1.StockLevel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map