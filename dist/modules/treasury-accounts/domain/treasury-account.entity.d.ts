import "reflect-metadata";
import { Company } from '../../companies/domain/company.entity';
import { Branch } from '../../branches/domain/branch.entity';
export declare enum TreasuryAccountType {
    BANK = "BANK",
    CASH = "CASH",
    VIRTUAL = "VIRTUAL"
}
export interface TreasuryAccountMetadata {
    notes?: string;
}
export declare class TreasuryAccount {
    id: string;
    companyId: string;
    branchId?: string | null;
    type: TreasuryAccountType;
    name: string;
    bankName?: string | null;
    accountNumber?: string | null;
    isActive: boolean;
    metadata?: TreasuryAccountMetadata | null;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
    branch?: Branch | null;
}
