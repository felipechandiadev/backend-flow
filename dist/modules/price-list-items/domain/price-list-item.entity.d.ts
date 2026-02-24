import "reflect-metadata";
import { PriceList } from '@modules/price-lists/domain/price-list.entity';
import { Product } from '@modules/products/domain/product.entity';
import { ProductVariant } from '@modules/product-variants/domain/product-variant.entity';
export declare class PriceListItem {
    id: string;
    priceListId?: string;
    productId?: string;
    productVariantId?: string;
    netPrice: number;
    grossPrice: number;
    taxIds?: string[] | null;
    minPrice?: number;
    discountPercentage?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    priceList?: PriceList;
    product?: Product;
    productVariant?: ProductVariant;
}
