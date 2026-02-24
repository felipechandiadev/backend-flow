import { Repository } from 'typeorm';
import { PriceList, PriceListType } from '../domain/price-list.entity';
export declare class PriceListsService {
    private readonly priceListRepository;
    constructor(priceListRepository: Repository<PriceList>);
    getAllPriceLists(includeInactive: boolean): Promise<{
        id: string;
        name: string;
        priceListType: PriceListType;
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
        priceListType: PriceListType;
        currency: string;
        validFrom: Date | undefined;
        validUntil: Date | undefined;
        priority: number;
        isDefault: boolean;
        isActive: boolean;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    createPriceList(data: {
        name: string;
        priceListType: PriceListType | string;
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
            priceListType: PriceListType;
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
        priceListType: PriceListType | string;
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
            priceListType: PriceListType;
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
    private mapPriceList;
}
