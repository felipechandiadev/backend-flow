import { Repository } from 'typeorm';
import { ResultCenter, ResultCenterType } from '../domain/result-center.entity';
export declare class ResultCentersService {
    private readonly resultCenterRepository;
    constructor(resultCenterRepository: Repository<ResultCenter>);
    getResultCenterById(id: string): Promise<{
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
    } | null>;
    getAllResultCenters(params?: {
        includeInactive?: boolean;
        type?: ResultCenterType;
        branchId?: string;
        companyId?: string;
    }): Promise<{
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
    }[]>;
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
    } | null>;
    updateResultCenter(id: string, data: Partial<{
        parentId?: string | null;
        branchId?: string | null;
        code: string;
        name: string;
        description?: string | null;
        type?: ResultCenterType | string;
        isActive: boolean;
    }>): Promise<{
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
    } | null>;
    deleteResultCenter(id: string): Promise<{
        success: boolean;
    }>;
    private formatResultCenter;
}
