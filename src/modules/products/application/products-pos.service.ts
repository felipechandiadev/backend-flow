import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import { ProductVariant } from '@modules/product-variants/domain/product-variant.entity';
import { Product } from '@modules/products/domain/product.entity';
import { PriceListItem } from '@modules/price-list-items/domain/price-list-item.entity';
import { StockLevel } from '@modules/stock-levels/domain/stock-level.entity';
import { SearchPosProductsDto } from './dto/search-pos-products.dto';

export type PosProductSearchResult = {
  productId: string;
  productName: string;
  productDescription: string | null;
  productImagePath: string | null;
  variantId: string;
  sku: string | null;
  barcode: string | null;
  unitSymbol: string | null;
  unitId: string | null;
  unitPrice: number;
  unitTaxRate: number;
  unitTaxAmount: number;
  unitPriceWithTax: number;
  trackInventory: boolean;
  availableStock: number | null;
  availableStockBase: number | null;
  attributes: Array<{
    attributeId: string;
    attributeName: string;
    attributeValue: string;
  }>;
  metadata: Record<string, unknown> | null;
};

@Injectable()
export class ProductsPosService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(PriceListItem)
    private readonly priceListItemRepository: Repository<PriceListItem>,
    @InjectRepository(StockLevel)
    private readonly stockLevelRepository: Repository<StockLevel>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Búsqueda optimizada de productos para POS
   * - Filtra por lista de precios específica
   * - Retorna solo productos con precio en esa lista
   * - Incluye stock disponible por bodega (branch)
   */
  async searchForPos(dto: SearchPosProductsDto) {
    const { query, priceListId, branchId, page = 1, pageSize = 20 } = dto;

    if (!priceListId) {
      throw new NotFoundException('priceListId es requerido para búsqueda en POS');
    }

    // Construir query base
    const qb = this.variantRepository
      .createQueryBuilder('v')
      .innerJoin('v.product', 'product')
      .innerJoin('v.priceListItems', 'priceListItem', 'priceListItem.priceListId = :priceListId AND priceListItem.deletedAt IS NULL', { priceListId })
      .leftJoin('v.unit', 'unit')
      .where('v.deletedAt IS NULL')
      .andWhere('v.isActive = :isActive', { isActive: true })
      .andWhere('product.deletedAt IS NULL')
      .andWhere('product.isActive = :isActive', { isActive: true });

    // Filtrar por búsqueda de texto (nombre, SKU, barcode)
    if (query && query.trim()) {
      qb.andWhere(
        '(product.name LIKE :q OR v.sku LIKE :q OR v.barcode LIKE :q)',
        { q: `%${query.trim()}%` }
      );
    }

    // Seleccionar campos necesarios
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

    // Paginación
    const skip = (page - 1) * pageSize;
    qb.skip(skip).take(pageSize);

    // Ejecutar query
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

    // Cargar stock por bodega si se especifica branchId
    const variantIds = variants.map(v => v.id);
    let stockByVariant: Record<string, number> = {};

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
      }, {} as Record<string, number>);
    }

    // Mapear resultados al formato esperado por el POS
    const products: PosProductSearchResult[] = variants
      .filter(variant => variant.productId) // Filtrar variantes sin productId
      .map(variant => {
        const priceItem = variant.priceListItems?.[0];
        const netPrice = priceItem ? Number(priceItem.netPrice) : 0;
        const grossPrice = priceItem ? Number(priceItem.grossPrice) : 0;
        const taxAmount = grossPrice - netPrice;
        const taxRate = netPrice > 0 ? (taxAmount / netPrice) * 100 : 0;

        // Parsear atributos
        let attributes: Array<{ attributeId: string; attributeName: string; attributeValue: string }> = [];
        if (variant.attributeValues) {
          try {
            const parsed = typeof variant.attributeValues === 'string' 
              ? JSON.parse(variant.attributeValues) 
              : variant.attributeValues;
            if (Array.isArray(parsed)) {
              attributes = parsed;
            }
          } catch (e) {
            // Ignorar error de parsing
          }
        }

        return {
          productId: variant.productId!,
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
}
