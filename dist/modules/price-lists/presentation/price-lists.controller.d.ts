import { PriceListsService } from '../application/price-lists.service';
export declare class PriceListsController {
    private readonly priceListsService;
    constructor(priceListsService: PriceListsService);
    getPriceLists(includeInactive?: string): Promise<{
        id: string;
        name: string;
        priceListType: import("../domain/price-list.entity").PriceListType;
        currency: string;
        validFrom: Date | undefined;
        validUntil: Date | undefined;
        priority: number;
        isDefault: boolean;
        isActive: boolean;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getPriceListById(id: string): Promise<{
        id: string;
        name: string;
        priceListType: import("../domain/price-list.entity").PriceListType;
        currency: string;
        validFrom: Date | undefined;
        validUntil: Date | undefined;
        priority: number;
        isDefault: boolean;
        isActive: boolean;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | {
        success: boolean;
        message: string;
        statusCode: number;
    }>;
    createPriceList(data: {
        name: string;
        priceListType: string;
        currency?: string;
        validFrom?: Date | string;
        validUntil?: Date | string;
        priority?: number;
        isDefault?: boolean;
        isActive?: boolean;
        description?: string | null;
    }): Promise<{
        success: boolean;
        priceList: {
            id: string;
            name: string;
            priceListType: import("../domain/price-list.entity").PriceListType;
            currency: string;
            validFrom: Date | undefined;
            validUntil: Date | undefined;
            priority: number;
            isDefault: boolean;
            isActive: boolean;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }>;
    updatePriceList(id: string, data: Partial<{
        name: string;
        priceListType: string;
        currency: string;
        validFrom?: Date | string | null;
        validUntil?: Date | string | null;
        priority: number;
        isDefault: boolean;
        isActive: boolean;
        description: string | null;
    }>): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
        priceList?: undefined;
    } | {
        success: boolean;
        priceList: {
            id: string;
            name: string;
            priceListType: import("../domain/price-list.entity").PriceListType;
            currency: string;
            validFrom: Date | undefined;
            validUntil: Date | undefined;
            priority: number;
            isDefault: boolean;
            isActive: boolean;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message?: undefined;
        statusCode?: undefined;
    }>;
    deletePriceList(id: string): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    } | {
        success: boolean;
        message?: undefined;
        statusCode?: undefined;
    }>;
}
