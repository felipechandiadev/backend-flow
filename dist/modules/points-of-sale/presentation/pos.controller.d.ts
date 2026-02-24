import { PosService } from '../application/pos.service';
export declare class PosController {
    private readonly posService;
    constructor(posService: PosService);
    findAll(includeInactive?: string): Promise<{
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
    getById(id: string): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
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
        };
        message?: undefined;
        statusCode?: undefined;
    }>;
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
}
