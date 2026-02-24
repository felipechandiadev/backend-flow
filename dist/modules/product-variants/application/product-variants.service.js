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
exports.ProductVariantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_variant_entity_1 = require("../domain/product-variant.entity");
const price_list_item_entity_1 = require("../../price-list-items/domain/price-list-item.entity");
let ProductVariantsService = class ProductVariantsService {
    constructor(variantRepository, priceListItemRepository) {
        this.variantRepository = variantRepository;
        this.priceListItemRepository = priceListItemRepository;
    }
    async findAll(params) {
        const qb = this.variantRepository
            .createQueryBuilder('v')
            .leftJoinAndSelect('v.priceListItems', 'priceListItem', 'priceListItem.deletedAt IS NULL')
            .leftJoinAndSelect('priceListItem.priceList', 'priceList', 'priceList.deletedAt IS NULL AND priceList.isActive = true')
            .leftJoinAndSelect('v.product', 'product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('v.unit', 'unit')
            .where('v.deletedAt IS NULL');
        if (params?.productId) {
            qb.andWhere('v.productId = :productId', { productId: params.productId });
        }
        const variants = await qb.getMany();
        console.log('📦 [ProductVariantsService] Loaded variants:', variants.length);
        if (variants.length > 0 && variants[0].priceListItems) {
            console.log('💰 [ProductVariantsService] First variant priceListItems:', variants[0].priceListItems.length);
        }
        const productMap = new Map();
        for (const variant of variants) {
            const productId = variant.productId || 'no-product';
            if (!productMap.has(productId)) {
                const product = variant.product;
                productMap.set(productId, {
                    id: productId,
                    name: product?.name || 'Producto sin nombre',
                    brand: product?.brand || null,
                    categoryId: product?.categoryId || null,
                    categoryName: product?.category?.name || null,
                    isActive: product?.isActive ?? true,
                    isMultiVariant: false,
                    variantCount: 0,
                    variants: [],
                });
            }
            const productData = productMap.get(productId);
            productData.variantCount++;
            const priceListItems = (variant.priceListItems || []).map((item) => ({
                priceListId: item.priceListId,
                priceListName: item.priceList?.name || 'Lista sin nombre',
                currency: item.priceList?.currency || 'CLP',
                netPrice: Number(item.netPrice),
                grossPrice: Number(item.grossPrice),
                taxIds: item.taxIds || [],
            }));
            console.log(`💵 [ProductVariantsService] Variant ${variant.sku} has ${priceListItems.length} price list items`);
            productData.variants.push({
                id: variant.id,
                productId: variant.productId,
                sku: variant.sku,
                barcode: variant.barcode,
                basePrice: Number(variant.basePrice),
                baseCost: Number(variant.baseCost),
                unitId: variant.unitId,
                unitOfMeasure: variant.unit?.name || 'Unidad',
                attributeValues: variant.attributeValues || {},
                displayName: this.generateDisplayName(variant),
                trackInventory: variant.trackInventory,
                allowNegativeStock: variant.allowNegativeStock,
                isActive: variant.isActive,
                weight: variant.weight ? Number(variant.weight) : null,
                weightUnit: variant.weightUnit,
                priceListItems,
            });
        }
        return Array.from(productMap.values());
    }
    generateDisplayName(variant) {
        if (!variant.attributeValues || Object.keys(variant.attributeValues).length === 0) {
            return 'Variante estándar';
        }
        const parts = Object.entries(variant.attributeValues)
            .map(([key, value]) => `${value}`)
            .filter(Boolean);
        return parts.join(', ') || 'Variante sin nombre';
    }
    async findOne(id) {
        const v = await this.variantRepository.findOne({ where: [{ id }, { sku: id }], relations: { product: true } });
        if (!v)
            throw new common_1.NotFoundException('Product variant not found');
        return v;
    }
    async create(data) {
        console.log('🔵 [ProductVariantsService.create] Received data:', JSON.stringify(data, null, 2));
        const variant = this.variantRepository.create({
            productId: data.productId || null,
            sku: data.sku || '',
            barcode: data.barcode || null,
            basePrice: data.basePrice ?? 0,
            baseCost: data.baseCost ?? 0,
            pmp: data.pmp ?? 0,
            unitId: data.unitId,
            weight: data.weight ?? null,
            weightUnit: data.weightUnit ?? 'kg',
            attributeValues: data.attributeValues ?? null,
            taxIds: data.taxIds ?? null,
            trackInventory: typeof data.trackInventory === 'boolean' ? data.trackInventory : true,
            allowNegativeStock: Boolean(data.allowNegativeStock),
            minimumStock: data.minimumStock ?? 0,
            maximumStock: data.maximumStock ?? 0,
            reorderPoint: data.reorderPoint ?? 0,
            imagePath: data.imagePath ?? null,
            isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
        });
        try {
            const saved = await this.variantRepository.save(variant);
            console.log('✅ [ProductVariantsService.create] Variant saved with ID:', saved.id);
            if (data.priceListItems && Array.isArray(data.priceListItems) && data.priceListItems.length > 0) {
                console.log(`💰 [ProductVariantsService.create] Creating ${data.priceListItems.length} price list items for variant ${saved.sku}`);
                console.log(`💰 [ProductVariantsService.create] Price list items data:`, JSON.stringify(data.priceListItems, null, 2));
                const priceListItems = data.priceListItems.map((item) => {
                    const priceItem = this.priceListItemRepository.create({
                        priceListId: item.priceListId,
                        productId: data.productId || null,
                        productVariantId: saved.id,
                        netPrice: item.netPrice ?? 0,
                        grossPrice: item.grossPrice ?? 0,
                        taxIds: item.taxIds || null,
                    });
                    console.log(`📋 [ProductVariantsService.create] Created price item:`, {
                        priceListId: priceItem.priceListId,
                        productVariantId: priceItem.productVariantId,
                        netPrice: priceItem.netPrice,
                        grossPrice: priceItem.grossPrice,
                    });
                    return priceItem;
                });
                const savedItems = await this.priceListItemRepository.save(priceListItems);
                console.log(`✅ [ProductVariantsService.create] Saved ${savedItems.length} price list items`);
            }
            else {
                console.log('⚠️ [ProductVariantsService.create] No priceListItems provided or empty array');
                console.log('⚠️ [ProductVariantsService.create] data.priceListItems:', data.priceListItems);
            }
            return { success: true, variant: saved };
        }
        catch (err) {
            console.error('❌ [ProductVariantsService.create] Error creating variant:', err);
            return { success: false, error: err?.message || 'Error creating variant' };
        }
    }
    async update(id, data) {
        const v = await this.variantRepository.findOne({ where: [{ id }, { sku: id }] });
        if (!v)
            throw new common_1.NotFoundException('Product variant not found');
        Object.assign(v, data);
        const saved = await this.variantRepository.save(v);
        if (data.priceListItems && Array.isArray(data.priceListItems) && data.priceListItems.length > 0) {
            console.log(`💰 [ProductVariantsService] Updating price list items for variant ${saved.sku}`);
            await this.priceListItemRepository.delete({ productVariantId: saved.id });
            const priceListItems = data.priceListItems.map((item) => {
                return this.priceListItemRepository.create({
                    priceListId: item.priceListId,
                    productId: saved.productId || null,
                    productVariantId: saved.id,
                    netPrice: item.netPrice ?? 0,
                    grossPrice: item.grossPrice ?? 0,
                    taxIds: item.taxIds || null,
                });
            });
            await this.priceListItemRepository.save(priceListItems);
            console.log(`✅ [ProductVariantsService] Updated ${priceListItems.length} price list items`);
        }
        return { success: true, variant: saved };
    }
    async remove(id) {
        const v = await this.variantRepository.findOne({ where: [{ id }, { sku: id }] });
        if (!v)
            return { success: false, error: 'Not found' };
        await this.variantRepository.softRemove(v);
        return { success: true };
    }
};
exports.ProductVariantsService = ProductVariantsService;
exports.ProductVariantsService = ProductVariantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __param(1, (0, typeorm_1.InjectRepository)(price_list_item_entity_1.PriceListItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductVariantsService);
//# sourceMappingURL=product-variants.service.js.map