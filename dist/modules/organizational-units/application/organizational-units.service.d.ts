import { Repository } from 'typeorm';
import { OrganizationalUnit, OrganizationalUnitType } from '../domain/organizational-unit.entity';
import { Company } from '../../companies/domain/company.entity';
export declare class OrganizationalUnitsService {
    private readonly organizationalUnitRepository;
    private readonly companyRepository;
    constructor(organizationalUnitRepository: Repository<OrganizationalUnit>, companyRepository: Repository<Company>);
    getOrganizationalUnitById(id: string): Promise<{
        id: string;
        companyId: string;
        code: string;
        name: string;
        description: string | null;
        unitType: OrganizationalUnitType;
        parentId: string | null;
        branchId: string | null;
        resultCenterId: string | null;
        isActive: boolean;
        metadata: Record<string, unknown> | null;
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
        resultCenter: {
            id: string;
            name: string;
            code: string;
        } | null;
        parent: {
            id: string;
            name: string;
            code: string;
        } | null;
    } | null>;
    getAllOrganizationalUnits(params?: {
        includeInactive?: boolean;
        unitType?: OrganizationalUnitType;
        branchId?: string;
        companyId?: string;
        resultCenterId?: string;
    }): Promise<{
        id: string;
        companyId: string;
        code: string;
        name: string;
        description: string | null;
        unitType: OrganizationalUnitType;
        parentId: string | null;
        branchId: string | null;
        resultCenterId: string | null;
        isActive: boolean;
        metadata: Record<string, unknown> | null;
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
        resultCenter: {
            id: string;
            name: string;
            code: string;
        } | null;
        parent: {
            id: string;
            name: string;
            code: string;
        } | null;
    }[]>;
    createOrganizationalUnit(data: {
        companyId?: string;
        code?: string;
        name: string;
        description?: string | null;
        unitType?: OrganizationalUnitType | string;
        parentId?: string | null;
        branchId?: string | null;
        resultCenterId?: string | null;
        isActive?: boolean;
        metadata?: Record<string, unknown> | null;
    }): Promise<{
        id: string;
        companyId: string;
        code: string;
        name: string;
        description: string | null;
        unitType: OrganizationalUnitType;
        parentId: string | null;
        branchId: string | null;
        resultCenterId: string | null;
        isActive: boolean;
        metadata: Record<string, unknown> | null;
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
        resultCenter: {
            id: string;
            name: string;
            code: string;
        } | null;
        parent: {
            id: string;
            name: string;
            code: string;
        } | null;
    } | null>;
    updateOrganizationalUnit(id: string, data: Partial<{
        code: string;
        name: string;
        description?: string | null;
        unitType?: OrganizationalUnitType | string;
        parentId?: string | null;
        branchId?: string | null;
        resultCenterId?: string | null;
        isActive?: boolean;
        metadata?: Record<string, unknown> | null;
    }>): Promise<{
        id: string;
        companyId: string;
        code: string;
        name: string;
        description: string | null;
        unitType: OrganizationalUnitType;
        parentId: string | null;
        branchId: string | null;
        resultCenterId: string | null;
        isActive: boolean;
        metadata: Record<string, unknown> | null;
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
        resultCenter: {
            id: string;
            name: string;
            code: string;
        } | null;
        parent: {
            id: string;
            name: string;
            code: string;
        } | null;
    } | null>;
    deleteOrganizationalUnit(id: string): Promise<{
        success: boolean;
    }>;
    private formatOrganizationalUnit;
}
