import "reflect-metadata";
import { ResultCenter } from '../../result-centers/domain/result-center.entity';
export declare class Category {
    id: string;
    parentId?: string;
    name: string;
    description?: string;
    sortOrder: number;
    imagePath?: string;
    isActive: boolean;
    resultCenterId?: string | null;
    resultCenter?: ResultCenter;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    parent?: Category;
}
