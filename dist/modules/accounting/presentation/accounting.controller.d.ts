import { AccountingService } from '../application/accounting.service';
import { BuildLedgerDto } from '../application/dto/build-ledger.dto';
export declare class AccountingController {
    private readonly accountingService;
    constructor(accountingService: AccountingService);
    getHierarchy(includeInactive?: string, filters?: string, page?: string, pageSize?: string): Promise<any[]>;
    getLedgerData(includeInactive?: string): Promise<{
        entries: {
            id: string;
            transactionId: string;
            accountId: string;
            accountCode: string;
            accountName: string;
            date: Date;
            description: string;
            debit: number;
            credit: number;
            reference: string | undefined;
        }[];
        accounts: {
            id: string;
            code: string;
            name: string;
        }[];
    }>;
    buildLedger(dto: BuildLedgerDto): Promise<{
        success: boolean;
        data: {
            accounts: import("../../accounting-accounts/domain/accounting-account.entity").AccountingAccount[];
            postings: import("../../../shared/application/AccountingEngine").LedgerPosting[];
            balanceByAccount: Record<string, number>;
        };
    }>;
}
