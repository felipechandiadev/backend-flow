import "reflect-metadata";
import { Category } from '../../categories/domain/category.entity';
import { Unit } from '../../units/domain/unit.entity';
import { ResultCenter } from '../../result-centers/domain/result-center.entity';
export type ProductChangeHistoryTargetType = 'PRODUCT' | 'VARIANT';
export type ProductChangeHistoryAction = 'CREATE' | 'UPDATE' | 'DELETE';
export interface ProductChangeHistoryChange {
    field: string;
    previousValue?: unknown;
    newValue?: unknown;
}
export interface ProductChangeHistoryEntry {
    id: string;
    timestamp: string;
    targetType: ProductChangeHistoryTargetType;
    targetId: string;
    targetLabel?: string;
    action: ProductChangeHistoryAction;
    summary: string;
    userId?: string;
    userName?: string;
    changes?: ProductChangeHistoryChange[];
    metadata?: Record<string, unknown>;
}
export declare enum ProductType {
    PHYSICAL = "PHYSICAL",
    SERVICE = "SERVICE",
    DIGITAL = "DIGITAL"
}
export declare class Product {
    id: string;
    categoryId?: string;
    name: string;
    description?: string;
    brand?: string;
    productType: ProductType;
    taxIds?: string[];
    imagePath?: string;
    isActive: boolean;
    resultCenterId?: string | null;
    resultCenter?: ResultCenter;
    baseUnitId?: string;
    metadata?: Record<string, any>;
    changeHistory?: ProductChangeHistoryEntry[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    category?: Category;
    baseUnit?: Unit;
}
