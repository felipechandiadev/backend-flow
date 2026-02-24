import { AttributesService } from '../application/attributes.service';
export declare class AttributesController {
    private readonly attributesService;
    constructor(attributesService: AttributesService);
    getAttributes(includeInactive?: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        options: string[];
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getAttributeById(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        options: string[];
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | {
        success: boolean;
        message: string;
        statusCode: number;
    }>;
    createAttribute(data: {
        name: string;
        description?: string | null;
        options: string[];
    }): Promise<{
        success: boolean;
        attribute: {
            id: string;
            name: string;
            description: string | null;
            options: string[];
            displayOrder: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }>;
    updateAttribute(id: string, data: Partial<{
        name: string;
        description: string | null;
        options: string[];
        isActive: boolean;
    }>): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
        attribute?: undefined;
    } | {
        success: boolean;
        attribute: {
            id: string;
            name: string;
            description: string | null;
            options: string[];
            displayOrder: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        message?: undefined;
        statusCode?: undefined;
    }>;
    deleteAttribute(id: string): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    } | {
        success: boolean;
        message?: undefined;
        statusCode?: undefined;
    }>;
}
