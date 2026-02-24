import { OrganizationalUnitsService } from '../application/organizational-units.service';
import { OrganizationalUnitType } from '../domain/organizational-unit.entity';
export declare class OrganizationalUnitsController {
    private readonly organizationalUnitsService;
    constructor(organizationalUnitsService: OrganizationalUnitsService);
    getOrganizationalUnits(includeInactive?: string, unitType?: string, branchId?: string, companyId?: string, resultCenterId?: string): Promise<{
        success: boolean;
        data: {
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
        }[];
    }>;
    getOrganizationalUnitById(id: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
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
        success: boolean;
        data: {
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
        } | null;
    }>;
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
        success: boolean;
        data: {
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
        };
    }>;
    deleteOrganizationalUnit(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
