import { ProductsService } from '../application/products.service';
import { ProductsPosService } from '../application/products-pos.service';
import { SearchProductsDto } from '../application/dto/search-products.dto';
import { SearchPosProductsDto } from '../application/dto/search-pos-products.dto';
export declare class ProductsController {
    private readonly productsService;
    private readonly productsPosService;
    constructor(productsService: ProductsService, productsPosService: ProductsPosService);
    findAll(query: any): Promise<{
        variants: any[];
        variantCount: number;
        id: string;
        categoryId?: string;
        name: string;
        description?: string;
        brand?: string;
        productType: import("../domain/product.entity").ProductType;
        taxIds?: string[];
        imagePath?: string;
        isActive: boolean;
        resultCenterId?: string | null;
        resultCenter?: import("../../result-centers/domain/result-center.entity").ResultCenter;
        baseUnitId?: string;
        metadata?: Record<string, any>;
        changeHistory?: import("../domain/product.entity").ProductChangeHistoryEntry[];
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date;
        category?: import("../../categories/domain/category.entity").Category;
        baseUnit?: import("../../units/domain/unit.entity").Unit;
    }[]>;
    search(searchDto: SearchProductsDto): Promise<{
        variants: any[];
        variantCount: number;
        id: string;
        categoryId?: string;
        name: string;
        description?: string;
        brand?: string;
        productType: import("../domain/product.entity").ProductType;
        taxIds?: string[];
        imagePath?: string;
        isActive: boolean;
        resultCenterId?: string | null;
        resultCenter?: import("../../result-centers/domain/result-center.entity").ResultCenter;
        baseUnitId?: string;
        metadata?: Record<string, any>;
        changeHistory?: import("../domain/product.entity").ProductChangeHistoryEntry[];
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date;
        category?: import("../../categories/domain/category.entity").Category;
        baseUnit?: import("../../units/domain/unit.entity").Unit;
    }[]>;
    searchForPos(searchDto: SearchPosProductsDto): Promise<{
        query: string;
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
        products: import("../application/products-pos.service").PosProductSearchResult[];
        success: boolean;
    }>;
    stocks(id: string): Promise<{
        success: boolean;
        stocks: {
            warehouseId: any;
            warehouseName: any;
            stock: number;
        }[];
    }>;
    create(body: any): Promise<{
        success: boolean;
        product: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        product?: undefined;
    }>;
    update(id: string, body: any): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
        product?: undefined;
    } | {
        success: boolean;
        product: import("../domain/product.entity").Product;
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
