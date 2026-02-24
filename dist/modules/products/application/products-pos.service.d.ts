import { Repository, DataSource } from 'typeorm';
import { ProductVariant } from '../../product-variants/domain/product-variant.entity';
import { Product } from '../../products/domain/product.entity';
import { PriceListItem } from '../../price-list-items/domain/price-list-item.entity';
import { StockLevel } from '../../stock-levels/domain/stock-level.entity';
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
export declare class ProductsPosService {
    private readonly variantRepository;
    private readonly productRepository;
    private readonly priceListItemRepository;
    private readonly stockLevelRepository;
    private readonly dataSource;
    constructor(variantRepository: Repository<ProductVariant>, productRepository: Repository<Product>, priceListItemRepository: Repository<PriceListItem>, stockLevelRepository: Repository<StockLevel>, dataSource: DataSource);
    searchForPos(dto: SearchPosProductsDto): Promise<{
        query: string;
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
        products: PosProductSearchResult[];
    }>;
}
