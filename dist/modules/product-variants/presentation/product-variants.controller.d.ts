import { ProductVariantsService } from '../application/product-variants.service';
export declare class ProductVariantsController {
    private readonly variantsService;
    constructor(variantsService: ProductVariantsService);
    findAll(query: any): Promise<any[]>;
    findOne(id: string): Promise<import("../domain/product-variant.entity").ProductVariant>;
    create(body: any): Promise<{
        success: boolean;
        variant: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        variant?: undefined;
    }>;
    update(id: string, body: any): Promise<{
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
