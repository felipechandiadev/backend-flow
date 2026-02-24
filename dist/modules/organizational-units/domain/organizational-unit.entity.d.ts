import "reflect-metadata";
import { Company } from '@modules/companies/domain/company.entity';
import { Branch } from '@modules/branches/domain/branch.entity';
import { ResultCenter } from '@modules/result-centers/domain/result-center.entity';
export declare enum OrganizationalUnitType {
    HEADQUARTERS = "HEADQUARTERS",
    STORE = "STORE",
    BACKOFFICE = "BACKOFFICE",
    OPERATIONS = "OPERATIONS",
    SALES = "SALES",
    OTHER = "OTHER"
}
export declare class OrganizationalUnit {
    id: string;
    companyId: string;
    code: string;
    name: string;
    description?: string | null;
    unitType: OrganizationalUnitType;
    parentId?: string | null;
    branchId?: string | null;
    resultCenterId?: string | null;
    isActive: boolean;
    metadata?: Record<string, unknown> | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    company: Company;
    parent?: OrganizationalUnit | null;
    branch?: Branch | null;
    resultCenter?: ResultCenter | null;
}
