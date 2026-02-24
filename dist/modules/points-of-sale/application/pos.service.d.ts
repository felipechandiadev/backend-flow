import { Repository } from 'typeorm';
import { PointOfSale } from '@modules/points-of-sale/domain/point-of-sale.entity';
export declare class PosService {
    private posRepository;
    constructor(posRepository: Repository<PointOfSale>);
    findAll(includeInactive: boolean): Promise<{
        success: boolean;
        pointsOfSale: {
            id: string;
            name: string;
            branchId: string | undefined;
            branch: {
                id: string;
                name: string;
            } | undefined;
            priceLists: {
                id: string;
                name: string;
                isActive: boolean;
            }[];
            deviceId: string | undefined;
            isActive: boolean;
            defaultPriceListId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    getPointOfSaleById(id: string): Promise<{
        id: string;
        name: string;
        branchId: string | undefined;
        branch: {
            id: string;
            name: string;
        } | undefined;
        priceLists: {
            id: string;
            name: string;
            isActive: boolean;
        }[];
        deviceId: string | undefined;
        isActive: boolean;
        defaultPriceListId: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    createPointOfSale(data: {
        name: string;
        branchId?: string | null;
        deviceId?: string | null;
        isActive?: boolean;
        priceLists?: Array<{
            id: string;
            name: string;
            isActive: boolean;
        }>;
        defaultPriceListId?: string | null;
    }): Promise<{
        success: boolean;
        error: string;
        pointOfSale?: undefined;
    } | {
        success: boolean;
        pointOfSale: {
            id: string;
            name: string;
            branchId: string | undefined;
            branch: {
                id: string;
                name: string;
            } | undefined;
            priceLists: {
                id: string;
                name: string;
                isActive: boolean;
            }[];
            deviceId: string | undefined;
            isActive: boolean;
            defaultPriceListId: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        error?: undefined;
    }>;
    updatePointOfSale(id: string, data: Partial<{
        name: string;
        branchId: string | null;
        deviceId: string | null;
        isActive: boolean;
        priceLists: Array<{
            id: string;
            name: string;
            isActive: boolean;
        }>;
        defaultPriceListId: string | null;
    }>): Promise<{
        success: boolean;
        error: string;
        pointOfSale?: undefined;
    } | {
        success: boolean;
        pointOfSale: {
            id: string;
            name: string;
            branchId: string | undefined;
            branch: {
                id: string;
                name: string;
            } | undefined;
            priceLists: {
                id: string;
                name: string;
                isActive: boolean;
            }[];
            deviceId: string | undefined;
            isActive: boolean;
            defaultPriceListId: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        error?: undefined;
    }>;
    getPriceLists(id: string): Promise<{
        success: boolean;
        message: string;
        priceLists: never[];
    } | {
        success: boolean;
        priceLists: {
            id: string;
            name: string;
            isActive: boolean;
        }[];
        message?: undefined;
    }>;
    deletePointOfSale(id: string): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    private mapPointOfSale;
}
