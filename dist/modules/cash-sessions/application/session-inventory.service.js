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
exports.SessionInventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stock_level_entity_1 = require("../../stock-levels/domain/stock-level.entity");
const product_entity_1 = require("../../products/domain/product.entity");
const product_variant_entity_1 = require("../../product-variants/domain/product-variant.entity");
const storage_entity_1 = require("../../storages/domain/storage.entity");
let SessionInventoryService = class SessionInventoryService {
    constructor(stockLevelRepository, productRepository, productVariantRepository, storageRepository, dataSource) {
        this.stockLevelRepository = stockLevelRepository;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.storageRepository = storageRepository;
        this.dataSource = dataSource;
    }
    async reserveStock(sessionId, productVariantId, qty, storageId) {
        const variant = await this.productVariantRepository.findOne({
            where: { id: productVariantId },
        });
        if (!variant) {
            throw new common_1.NotFoundException(`Variante ${productVariantId} no encontrada`);
        }
        const storage = await this.storageRepository.findOne({
            where: { id: storageId },
        });
        if (!storage) {
            throw new common_1.NotFoundException(`Storage ${storageId} no encontrado`);
        }
        const stockLevel = await this.stockLevelRepository.findOne({
            where: {
                productVariantId,
                storageId,
            },
        });
        const availableQty = stockLevel?.availableStock ?? 0;
        if (availableQty < qty) {
            throw new common_1.ConflictException(`Stock insuficiente. Disponible: ${availableQty}, Solicitado: ${qty}`);
        }
        return {
            success: true,
            allocation: {
                id: `alloc-${Date.now()}`,
                sessionId,
                productVariantId,
                qtyAllocated: qty,
                status: 'RESERVED',
                createdAt: new Date(),
            },
        };
    }
    async releaseStock(allocationId) {
    }
    async commitStock(sessionId) {
        return {
            committed: 0,
            failed: 0,
        };
    }
    async rollbackStock(sessionId) {
        return {
            rolledBack: 0,
        };
    }
    async getAllocations(sessionId) {
        return {
            allocations: [],
        };
    }
    async getStockSummary(sessionId) {
        return {
            summary: [],
        };
    }
};
exports.SessionInventoryService = SessionInventoryService;
exports.SessionInventoryService = SessionInventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_level_entity_1.StockLevel)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __param(3, (0, typeorm_1.InjectRepository)(storage_entity_1.Storage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], SessionInventoryService);
//# sourceMappingURL=session-inventory.service.js.map