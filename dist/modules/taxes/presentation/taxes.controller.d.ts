import { TaxesService } from '../application/taxes.service';
export declare class TaxesController {
    private readonly taxesService;
    constructor(taxesService: TaxesService);
    getTaxes(includeInactive?: string, isActive?: string): Promise<{
        id: string;
        companyId: string;
        name: string;
        code: string;
        taxType: import("../domain/tax.entity").TaxType;
        rate: number;
        description: string | null;
        isDefault: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getTaxById(id: string): Promise<{
        id: string;
        companyId: string;
        name: string;
        code: string;
        taxType: import("../domain/tax.entity").TaxType;
        rate: number;
        description: string | null;
        isDefault: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | {
        success: boolean;
        message: string;
        statusCode: number;
    }>;
    createTax(data: {
        companyId: string;
        name: string;
        code: string;
        taxType?: string;
        rate: number;
        description?: string | null;
        isDefault?: boolean;
        isActive?: boolean;
    }): Promise<{
        success: boolean;
        tax: {
            id: string;
            companyId: string;
            name: string;
            code: string;
            taxType: import("../domain/tax.entity").TaxType;
            rate: number;
            description: string | null;
            isDefault: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }>;
    updateTax(id: string, data: Partial<{
        name: string;
        code: string;
        taxType: string;
        rate: number;
        description: string | null;
        isDefault: boolean;
        isActive: boolean;
    }>): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
        tax?: undefined;
    } | {
        success: boolean;
        tax: {
            id: string;
            companyId: string;
            name: string;
            code: string;
            taxType: import("../domain/tax.entity").TaxType;
            rate: number;
            description: string | null;
            isDefault: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        message?: undefined;
        statusCode?: undefined;
    }>;
    deleteTax(id: string): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    } | {
        success: boolean;
        message?: undefined;
        statusCode?: undefined;
    }>;
}
