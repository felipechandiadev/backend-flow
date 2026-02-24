import { UnitsService } from '../application/units.service';
export declare class UnitsController {
    private readonly unitsService;
    constructor(unitsService: UnitsService);
    getUnits(status?: string): Promise<{
        id: string;
        name: string;
        symbol: string;
        dimension: import("../domain/unit-dimension.enum").UnitDimension;
        conversionFactor: number;
        allowDecimals: boolean;
        isBase: boolean;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getUnitById(id: string): Promise<{
        id: string;
        name: string;
        symbol: string;
        dimension: import("../domain/unit-dimension.enum").UnitDimension;
        conversionFactor: number;
        allowDecimals: boolean;
        isBase: boolean;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | {
        success: boolean;
        message: string;
        statusCode: number;
    }>;
    createUnit(data: {
        name: string;
        symbol: string;
        dimension: string;
        conversionFactor: number;
        allowDecimals?: boolean;
        isBase?: boolean;
    }): Promise<{
        id: string;
        name: string;
        symbol: string;
        dimension: import("../domain/unit-dimension.enum").UnitDimension;
        conversionFactor: number;
        allowDecimals: boolean;
        isBase: boolean;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUnit(id: string, data: Partial<{
        name: string;
        dimension: string;
        conversionFactor: number;
        allowDecimals: boolean;
        active: boolean;
    }>): Promise<{
        id: string;
        name: string;
        symbol: string;
        dimension: import("../domain/unit-dimension.enum").UnitDimension;
        conversionFactor: number;
        allowDecimals: boolean;
        isBase: boolean;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    deleteUnit(id: string): Promise<{
        success: boolean;
    }>;
}
