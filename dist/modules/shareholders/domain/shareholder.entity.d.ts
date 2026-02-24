import "reflect-metadata";
import { Company } from '../../companies/domain/company.entity';
import { Person } from '../../persons/domain/person.entity';
export declare class Shareholder {
    id: string;
    companyId: string;
    personId: string;
    role?: string | null;
    ownershipPercentage?: number | null;
    notes?: string | null;
    metadata?: Record<string, any> | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    company?: Company;
    person?: Person;
}
