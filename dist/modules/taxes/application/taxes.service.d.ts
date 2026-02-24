import { Repository } from 'typeorm';
import { Tax, TaxType } from '../domain/tax.entity';
export declare class TaxesService {
    private readonly taxRepository;
    constructor(taxRepository: Repository<Tax>);
    getAllTaxes(includeInactive: boolean, isActive?: boolean): Promise<{
        id: string;
        companyId: string;
        name: string;
        code: string;
        taxType: TaxType;
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
        taxType: TaxType;
        rate: number;
        description: string | null;
        isDefault: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    createTax(data: {
        companyId: string;
        name: string;
        code: string;
        taxType?: TaxType | string;
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
            taxType: TaxType;
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
        taxType: TaxType | string;
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
            taxType: TaxType;
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
    private mapTax;
}
