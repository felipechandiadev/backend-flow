import "reflect-metadata";
import { Company } from '../../companies/domain/company.entity';
import { ResultCenter } from '../../result-centers/domain/result-center.entity';
export declare class ExpenseCategory {
    id: string;
    companyId: string;
    code: string;
    name: string;
    groupName?: string | null;
    description?: string;
    requiresApproval: boolean;
    approvalThreshold: string;
    defaultResultCenterId?: string | null;
    isActive: boolean;
    examples?: string[] | null;
    metadata?: Record<string, unknown> | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    company: Company;
    defaultResultCenter?: ResultCenter | null;
}
