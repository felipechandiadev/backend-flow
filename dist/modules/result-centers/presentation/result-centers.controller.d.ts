import { ResultCentersService } from '../application/result-centers.service';
import { ResultCenterType } from '../domain/result-center.entity';
export declare class ResultCentersController {
    private readonly resultCentersService;
    constructor(resultCentersService: ResultCentersService);
    getResultCenters(includeInactive?: string, type?: string, branchId?: string, companyId?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            companyId: string;
            parentId: string | null;
            branchId: string | null;
            code: string;
            name: string;
            description: string | null;
            type: ResultCenterType;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            company: {
                id: string;
                name: string;
            } | null;
            branch: {
                id: string;
                name: string;
            } | null;
            parent: {
                id: string;
                name: string;
                code: string;
            } | null;
        }[];
    }>;
    getResultCenterById(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            companyId: string;
            parentId: string | null;
            branchId: string | null;
            code: string;
            name: string;
            description: string | null;
            type: ResultCenterType;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            company: {
                id: string;
                name: string;
            } | null;
            branch: {
                id: string;
                name: string;
            } | null;
            parent: {
                id: string;
                name: string;
                code: string;
            } | null;
        };
    }>;
    createResultCenter(data: {
        companyId: string;
        parentId?: string | null;
        branchId?: string | null;
        code: string;
        name: string;
        description?: string | null;
        type?: ResultCenterType | string;
        isActive?: boolean;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            companyId: string;
            parentId: string | null;
            branchId: string | null;
            code: string;
            name: string;
            description: string | null;
            type: ResultCenterType;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            company: {
                id: string;
                name: string;
            } | null;
            branch: {
                id: string;
                name: string;
            } | null;
            parent: {
                id: string;
                name: string;
                code: string;
            } | null;
        } | null;
    }>;
    updateResultCenter(id: string, data: Partial<{
        parentId?: string | null;
        branchId?: string | null;
        code: string;
        name: string;
        description?: string | null;
        type?: ResultCenterType | string;
        isActive: boolean;
    }>): Promise<{
        success: boolean;
        data: {
            id: string;
            companyId: string;
            parentId: string | null;
            branchId: string | null;
            code: string;
            name: string;
            description: string | null;
            type: ResultCenterType;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            company: {
                id: string;
                name: string;
            } | null;
            branch: {
                id: string;
                name: string;
            } | null;
            parent: {
                id: string;
                name: string;
                code: string;
            } | null;
        };
    }>;
    deleteResultCenter(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
