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
exports.ProductsPosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_variant_entity_1 = require("../../product-variants/domain/product-variant.entity");
const product_entity_1 = require("../domain/product.entity");
const price_list_item_entity_1 = require("../../price-list-items/domain/price-list-item.entity");
const stock_level_entity_1 = require("../../stock-levels/domain/stock-level.entity");
let ProductsPosService = class ProductsPosService {
    constructor(variantRepository, productRepository, priceListItemRepository, stockLevelRepository, dataSource) {
        this.variantRepository = variantRepository;
        this.productRepository = productRepository;
        this.priceListItemRepository = priceListItemRepository;
        this.stockLevelRepository = stockLevelRepository;
        this.dataSource = dataSource;
    }
    async searchForPos(dto) {
        const { query, priceListId, branchId, page = 1, pageSize = 20 } = dto;
        if (!priceListId) {
            throw new common_1.NotFoundException('priceListId es requerido para búsqueda en POS');
        }
        const qb = this.variantRepository
            .createQueryBuilder('v')
            .innerJoin('v.product', 'product')
            .innerJoin('v.priceListItems', 'priceListItem', 'priceListItem.priceListId = :priceListId AND priceListItem.deletedAt IS NULL', { priceListId })
            .leftJoin('v.unit', 'unit')
            .where('v.deletedAt IS NULL')
            .andWhere('v.isActive = :isActive', { isActive: true })
            .andWhere('product.deletedAt IS NULL')
            .andWhere('product.isActive = :isActive', { isActive: true });
        if (query && query.trim()) {
            qb.andWhere('(product.name LIKE :q OR v.sku LIKE :q OR v.barcode LIKE :q)', { q: `%${query.trim()}%` });
        }
        qb.select([
            'v.id',
            'v.productId',
            'v.sku',
            'v.barcode',
            'v.trackInventory',
            'v.attributeValues',
            'product.id',
            'product.name',
            'product.description',
            'product.imagePath',
            'unit.id',
            'unit.symbol',
            'priceListItem.id',
            'priceListItem.netPrice',
            'priceListItem.grossPrice',
            'priceListItem.taxIds',
        ]);
        const skip = (page - 1) * pageSize;
        qb.skip(skip).take(pageSize);
        const [variants, total] = await qb.getManyAndCount();
        if (!variants || variants.length === 0) {
            return {
                query: query || '',
                pagination: {
                    page,
                    pageSize,
                    total: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
                },
                products: [],
            };
        }
        const variantIds = variants.map(v => v.id);
        let stockByVariant = {};
        if (branchId) {
            const stockLevels = await this.stockLevelRepository
                .createQueryBuilder('sl')
                .innerJoin('sl.storage', 'storage')
                .where('sl.productVariantId IN (:...variantIds)', { variantIds })
                .andWhere('storage.branchId = :branchId', { branchId })
                .andWhere('storage.deletedAt IS NULL')
                .select('sl.productVariantId', 'variantId')
                .addSelect('COALESCE(SUM(sl.availableStock), 0)', 'stock')
                .groupBy('sl.productVariantId')
                .getRawMany();
            stockByVariant = stockLevels.reduce((acc, row) => {
                acc[row.variantId] = Number(row.stock || 0);
                return acc;
            }, {});
        }
        const products = variants
            .filter(variant => variant.productId)
            .map(variant => {
            const priceItem = variant.priceListItems?.[0];
            const netPrice = priceItem ? Number(priceItem.netPrice) : 0;
            const grossPrice = priceItem ? Number(priceItem.grossPrice) : 0;
            const taxAmount = grossPrice - netPrice;
            const taxRate = netPrice > 0 ? (taxAmount / netPrice) * 100 : 0;
            let attributes = [];
            if (variant.attributeValues) {
                try {
                    const parsed = typeof variant.attributeValues === 'string'
                        ? JSON.parse(variant.attributeValues)
                        : variant.attributeValues;
                    if (Array.isArray(parsed)) {
                        attributes = parsed;
                    }
                }
                catch (e) {
                }
            }
            return {
                productId: variant.productId,
                productName: variant.product?.name || 'Producto sin nombre',
                productDescription: variant.product?.description || null,
                productImagePath: variant.product?.imagePath || null,
                variantId: variant.id,
                sku: variant.sku || null,
                barcode: variant.barcode || null,
                unitSymbol: variant.unit?.symbol || null,
                unitId: variant.unit?.id || null,
                unitPrice: netPrice,
                unitTaxRate: taxRate,
                unitTaxAmount: taxAmount,
                unitPriceWithTax: grossPrice,
                trackInventory: variant.trackInventory ?? false,
                availableStock: variant.trackInventory ? (stockByVariant[variant.id] ?? 0) : null,
                availableStockBase: variant.trackInventory ? (stockByVariant[variant.id] ?? 0) : null,
                attributes,
                metadata: null,
            };
        });
        return {
            query: query || '',
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
                hasNextPage: page < Math.ceil(total / pageSize),
                hasPreviousPage: page > 1,
            },
            products,
        };
    }
};
exports.ProductsPosService = ProductsPosService;
exports.ProductsPosService = ProductsPosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(price_list_item_entity_1.PriceListItem)),
    __param(3, (0, typeorm_1.InjectRepository)(stock_level_entity_1.StockLevel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ProductsPosService);
//# sourceMappingURL=products-pos.service.js.map