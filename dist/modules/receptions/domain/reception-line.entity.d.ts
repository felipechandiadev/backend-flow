import 'reflect-metadata';
import { Reception } from './reception.entity';
import { Product } from '../../products/domain/product.entity';
import { ProductVariant } from '../../product-variants/domain/product-variant.entity';
export declare class ReceptionLine {
    id: string;
    receptionId: string;
    productId?: string;
    productVariantId?: string;
    productName: string;
    sku?: string;
    variantName?: string;
    quantity: number;
    receivedQuantity?: number;
    unitPrice: number;
    unitCost?: number;
    subtotal: number;
    lineNumber: number;
    reception: Reception;
    product?: Product;
    productVariant?: ProductVariant;
}
