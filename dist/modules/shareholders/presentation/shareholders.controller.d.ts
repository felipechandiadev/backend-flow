import { ShareholdersService } from '../application/shareholders.service';
export declare class ShareholdersController {
    private readonly shareholdersService;
    constructor(shareholdersService: ShareholdersService);
    listShareholders(): Promise<(import("../domain/shareholder.entity").Shareholder | {
        person: {
            displayName: string;
            id: string;
            type: import("../../persons/domain/person.entity").PersonType;
            firstName: string;
            lastName?: string;
            businessName?: string;
            documentType?: import("../../persons/domain/person.entity").DocumentType | null;
            documentNumber?: string;
            email?: string;
            phone?: string;
            address?: string;
            bankAccounts?: import("../../persons/domain/person.entity").PersonBankAccount[] | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt?: Date;
        };
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
        company?: import("../../companies/domain/company.entity").Company;
    })[]>;
}
