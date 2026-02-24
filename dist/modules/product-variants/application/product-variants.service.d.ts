import { Repository } from 'typeorm';
import { ProductVariant } from '@modules/product-variants/domain/product-variant.entity';
import { PriceListItem } from '@modules/price-list-items/domain/price-list-item.entity';
export declare class ProductVariantsService {
    private readonly variantRepository;
    private readonly priceListItemRepository;
    constructor(variantRepository: Repository<ProductVariant>, priceListItemRepository: Repository<PriceListItem>);
    findAll(params?: Record<string, any>): Promise<any[]>;
    private generateDisplayName;
    findOne(id: string): Promise<ProductVariant>;
    create(data: any): Promise<{
        success: boolean;
        variant: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        variant?: undefined;
    }>;
    update(id: string, data: any): Promise<{
        success: boolean;
        variant: any;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    }>;
}
