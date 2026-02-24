import { Repository } from 'typeorm';
import { Attribute } from '../domain/attribute.entity';
export declare class AttributesService {
    private readonly attributeRepository;
    constructor(attributeRepository: Repository<Attribute>);
    getAllAttributes(includeInactive: boolean): Promise<{
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
    } | null>;
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
    private mapAttribute;
}
