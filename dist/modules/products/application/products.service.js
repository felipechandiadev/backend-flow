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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../domain/product.entity");
const product_variant_entity_1 = require("../../product-variants/domain/product-variant.entity");
const tax_entity_1 = require("../../taxes/domain/tax.entity");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
const attribute_entity_1 = require("../../attributes/domain/attribute.entity");
const stock_level_entity_1 = require("../../stock-levels/domain/stock-level.entity");
const price_list_item_entity_1 = require("../../price-list-items/domain/price-list-item.entity");
const MOVEMENT_DIRECTION = {
    [transaction_entity_1.TransactionType.SALE]: 'OUT',
    [transaction_entity_1.TransactionType.PURCHASE]: 'IN',
    [transaction_entity_1.TransactionType.PURCHASE_ORDER]: null,
    [transaction_entity_1.TransactionType.SALE_RETURN]: 'IN',
    [transaction_entity_1.TransactionType.PURCHASE_RETURN]: 'OUT',
    [transaction_entity_1.TransactionType.TRANSFER_OUT]: 'OUT',
    [transaction_entity_1.TransactionType.TRANSFER_IN]: 'IN',
    [transaction_entity_1.TransactionType.ADJUSTMENT_IN]: 'IN',
    [transaction_entity_1.TransactionType.ADJUSTMENT_OUT]: 'OUT',
    [transaction_entity_1.TransactionType.PAYMENT_IN]: null,
    [transaction_entity_1.TransactionType.PAYMENT_OUT]: null,
    [transaction_entity_1.TransactionType.PAYMENT_EXECUTION]: null,
    [transaction_entity_1.TransactionType.CASH_DEPOSIT]: null,
    [transaction_entity_1.TransactionType.OPERATING_EXPENSE]: null,
    [transaction_entity_1.TransactionType.CASH_SESSION_OPENING]: null,
    [transaction_entity_1.TransactionType.CASH_SESSION_WITHDRAWAL]: null,
    [transaction_entity_1.TransactionType.CASH_SESSION_DEPOSIT]: null,
    [transaction_entity_1.TransactionType.PAYROLL]: null,
    [transaction_entity_1.TransactionType.BANK_WITHDRAWAL_TO_SHAREHOLDER]: null,
    [transaction_entity_1.TransactionType.SUPPLIER_PAYMENT]: null,
    [transaction_entity_1.TransactionType.EXPENSE_PAYMENT]: null,
    [transaction_entity_1.TransactionType.CASH_SESSION_CLOSING]: null,
};
let ProductsService = class ProductsService {
    constructor(productRepository, variantRepository, taxRepository, attributeRepository, priceListItemRepository, dataSource) {
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.taxRepository = taxRepository;
        this.attributeRepository = attributeRepository;
        this.priceListItemRepository = priceListItemRepository;
        this.dataSource = dataSource;
    }
    resolveDirection(type) {
        return MOVEMENT_DIRECTION[type] ?? null;
    }
    async search(searchDto) {
        const qb = this.productRepository.createQueryBuilder('p').where('p.deletedAt IS NULL');
        if (searchDto.query) {
            qb.andWhere('(p.name LIKE :q OR p.brand LIKE :q)', { q: `%${searchDto.query}%` });
        }
        const products = await qb.getMany();
        if (!products || products.length === 0)
            return [];
        const productIds = products.map((p) => p.id);
        const variants = await this.variantRepository
            .createQueryBuilder('v')
            .leftJoinAndSelect('v.priceListItems', 'priceListItem', 'priceListItem.deletedAt IS NULL')
            .leftJoinAndSelect('priceListItem.priceList', 'priceList', 'priceList.deletedAt IS NULL AND priceList.isActive = true')
            .leftJoinAndSelect('v.unit', 'unit')
            .where('v.deletedAt IS NULL')
            .andWhere('v.productId IN (:...productIds)', { productIds })
            .getMany();
        const variantsByProduct = {};
        for (const v of variants) {
            if (!variantsByProduct[v.productId || ''])
                variantsByProduct[v.productId || ''] = [];
            const priceListItems = (v.priceListItems || []).map((item) => ({
                priceListId: item.priceListId,
                priceListName: item.priceList?.name || 'Lista sin nombre',
                currency: item.priceList?.currency || 'CLP',
                netPrice: Number(item.netPrice),
                grossPrice: Number(item.grossPrice),
                taxIds: item.taxIds || [],
            }));
            variantsByProduct[v.productId || ''].push({
                ...v,
                unitOfMeasure: v.unit?.name || 'Unidad',
                priceListItems,
            });
        }
        const enriched = products.map((p) => ({
            ...p,
            variants: variantsByProduct[p.id] ?? [],
            variantCount: (variantsByProduct[p.id] ?? []).length,
        }));
        return enriched;
    }
    async create(data) {
        const product = new product_entity_1.Product();
        product.name = String(data.name || '').trim();
        product.description = data.description ? String(data.description) : undefined;
        product.brand = data.brand ? String(data.brand) : undefined;
        product.categoryId = data.categoryId || undefined;
        product.productType = data.productType ?? product.productType;
        product.taxIds = Array.isArray(data.taxIds) ? data.taxIds : undefined;
        product.isActive = typeof data.isActive === 'boolean' ? data.isActive : true;
        product.baseUnitId = data.baseUnitId || undefined;
        try {
            const saved = await this.productRepository.save(product);
            return { success: true, product: saved };
        }
        catch (err) {
            console.error('Error creating product', err);
            return { success: false, error: err?.message || 'Error creating product' };
        }
    }
    async getStocks(productId) {
        const raw = await this.dataSource
            .getRepository(stock_level_entity_1.StockLevel)
            .createQueryBuilder('sl')
            .innerJoin('sl.variant', 'variant')
            .innerJoin('sl.storage', 'storage')
            .select('storage.id', 'warehouseId')
            .addSelect('storage.name', 'warehouseName')
            .addSelect('COALESCE(SUM(sl.availableStock), 0)', 'stock')
            .where('variant.productId = :productId', { productId })
            .andWhere('storage.deletedAt IS NULL')
            .groupBy('storage.id')
            .addGroupBy('storage.name')
            .getRawMany();
        return {
            success: true,
            stocks: raw.map((r) => ({
                warehouseId: r.warehouseId,
                warehouseName: r.warehouseName ?? null,
                stock: Number(r.stock ?? 0),
            })),
        };
    }
    async update(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = String(data.name || '').trim();
        if (data.description !== undefined)
            updateData.description = data.description ? String(data.description) : null;
        if (data.brand !== undefined)
            updateData.brand = data.brand ? String(data.brand) : null;
        if (data.categoryId !== undefined)
            updateData.categoryId = data.categoryId || null;
        if (data.productType !== undefined)
            updateData.productType = data.productType;
        if (data.taxIds !== undefined)
            updateData.taxIds = Array.isArray(data.taxIds) ? data.taxIds : undefined;
        if (data.isActive !== undefined)
            updateData.isActive = typeof data.isActive === 'boolean' ? data.isActive : true;
        if (data.baseUnitId !== undefined)
            updateData.baseUnitId = data.baseUnitId || null;
        await this.productRepository.update(id, updateData);
        const updated = await this.productRepository.findOne({ where: { id } });
        if (!updated)
            return { success: false, message: 'Product not found', statusCode: 404 };
        return { success: true, product: updated };
    }
    async remove(id) {
        const result = await this.productRepository.softDelete(id);
        if (!result.affected) {
            return { success: false, message: 'Product not found', statusCode: 404 };
        }
        return { success: true };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __param(2, (0, typeorm_1.InjectRepository)(tax_entity_1.Tax)),
    __param(3, (0, typeorm_1.InjectRepository)(attribute_entity_1.Attribute)),
    __param(4, (0, typeorm_1.InjectRepository)(price_list_item_entity_1.PriceListItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ProductsService);
//# sourceMappingURL=products.service.js.map