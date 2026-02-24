import { Repository, DataSource } from 'typeorm';
import { Product } from '@modules/products/domain/product.entity';
import { ProductVariant } from '@modules/product-variants/domain/product-variant.entity';
import { Tax } from '@modules/taxes/domain/tax.entity';
import { Attribute } from '@modules/attributes/domain/attribute.entity';
import { PriceListItem } from '@modules/price-list-items/domain/price-list-item.entity';
import { SearchProductsDto } from './dto/search-products.dto';
export declare class ProductsService {
    private readonly productRepository;
    private readonly variantRepository;
    private readonly taxRepository;
    private readonly attributeRepository;
    private readonly priceListItemRepository;
    private readonly dataSource;
    constructor(productRepository: Repository<Product>, variantRepository: Repository<ProductVariant>, taxRepository: Repository<Tax>, attributeRepository: Repository<Attribute>, priceListItemRepository: Repository<PriceListItem>, dataSource: DataSource);
    private resolveDirection;
    search(searchDto: SearchProductsDto): Promise<{
        variants: any[];
        variantCount: number;
        id: string;
        categoryId?: string;
        name: string;
        description?: string;
        brand?: string;
        productType: import("@modules/products/domain/product.entity").ProductType;
        taxIds?: string[];
        imagePath?: string;
        isActive: boolean;
        resultCenterId?: string | null;
        resultCenter?: import("../../result-centers/domain/result-center.entity").ResultCenter;
        baseUnitId?: string;
        metadata?: Record<string, any>;
        changeHistory?: import("@modules/products/domain/product.entity").ProductChangeHistoryEntry[];
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date;
        category?: import("../../categories/domain/category.entity").Category;
        baseUnit?: import("../../units/domain/unit.entity").Unit;
    }[]>;
    create(data: any): Promise<{
        success: boolean;
        product: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        product?: undefined;
    }>;
    getStocks(productId: string): Promise<{
        success: boolean;
        stocks: {
            warehouseId: any;
            warehouseName: any;
            stock: number;
        }[];
    }>;
    update(id: string, data: any): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
        product?: undefined;
    } | {
        success: boolean;
        product: Product;
        message?: undefined;
        statusCode?: undefined;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    } | {
        success: boolean;
        message?: undefined;
        statusCode?: undefined;
    }>;
}
