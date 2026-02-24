import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from '@modules/product-variants/domain/product-variant.entity';
import { PriceListItem } from '@modules/price-list-items/domain/price-list-item.entity';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(PriceListItem)
    private readonly priceListItemRepository: Repository<PriceListItem>,
  ) {}

  async findAll(params?: Record<string, any>) {
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
    
    // Group variants by product for the frontend
    const productMap = new Map<string, any>();
    
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
      
      // Map price list items for frontend
      const priceListItems = (variant.priceListItems || []).map((item: any) => ({
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
  
  private generateDisplayName(variant: any): string {
    if (!variant.attributeValues || Object.keys(variant.attributeValues).length === 0) {
      return 'Variante estándar';
    }
    
    const parts = Object.entries(variant.attributeValues)
      .map(([key, value]) => `${value}`)
      .filter(Boolean);
    
    return parts.join(', ') || 'Variante sin nombre';
  }

  async findOne(id: string) {
    // Try to find by id first, then fall back to sku lookup to be resilient
    const v = await this.variantRepository.findOne({ where: [{ id }, { sku: id }] as any, relations: { product: true } as any });
    if (!v) throw new NotFoundException('Product variant not found');
    return v;
  }

  async create(data: any) {
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
      const saved = await this.variantRepository.save(variant as any);
      console.log('✅ [ProductVariantsService.create] Variant saved with ID:', saved.id);
      
      // Create price list items if provided
      if (data.priceListItems && Array.isArray(data.priceListItems) && data.priceListItems.length > 0) {
        console.log(`💰 [ProductVariantsService.create] Creating ${data.priceListItems.length} price list items for variant ${saved.sku}`);
        console.log(`💰 [ProductVariantsService.create] Price list items data:`, JSON.stringify(data.priceListItems, null, 2));
        
        const priceListItems = data.priceListItems.map((item: any) => {
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
      } else {
        console.log('⚠️ [ProductVariantsService.create] No priceListItems provided or empty array');
        console.log('⚠️ [ProductVariantsService.create] data.priceListItems:', data.priceListItems);
      }
      
      return { success: true, variant: saved };
    } catch (err) {
      console.error('❌ [ProductVariantsService.create] Error creating variant:', err);
      return { success: false, error: (err as any)?.message || 'Error creating variant' };
    }
  }

  async update(id: string, data: any) {
    const v = await this.variantRepository.findOne({ where: [{ id }, { sku: id }] as any });
    if (!v) throw new NotFoundException('Product variant not found');
    
    // Update variant fields
    Object.assign(v, data);
    const saved = await this.variantRepository.save(v as any);
    
    // Update price list items if provided
    if (data.priceListItems && Array.isArray(data.priceListItems) && data.priceListItems.length > 0) {
      console.log(`💰 [ProductVariantsService] Updating price list items for variant ${saved.sku}`);
      
      // Delete existing price list items for this variant
      await this.priceListItemRepository.delete({ productVariantId: saved.id });
      
      // Create new price list items
      const priceListItems = data.priceListItems.map((item: any) => {
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

  async remove(id: string) {
    const v = await this.variantRepository.findOne({ where: [{ id }, { sku: id }] as any });
    if (!v) return { success: false, error: 'Not found' };
    await this.variantRepository.softRemove(v as any);
    return { success: true };
  }
}
