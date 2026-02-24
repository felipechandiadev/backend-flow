import { DataSource } from 'typeorm';
import { BuildLedgerDto } from './dto/build-ledger.dto';
import { AccountingAccount } from '@modules/accounting-accounts/domain/accounting-account.entity';
export declare class AccountingService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    getHierarchy(includeInactive: boolean): Promise<any[]>;
    getLedgerData(includeInactive: boolean): Promise<{
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
            accounts: AccountingAccount[];
            postings: import("../../../shared/application/AccountingEngine").LedgerPosting[];
            balanceByAccount: Record<string, number>;
        };
    }>;
}
