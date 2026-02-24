import { LedgerEntriesService, LedgerEntryGeneratorResponse } from '@modules/ledger-entries/application/ledger-entries.service';
export declare class LedgerEntriesController {
    private ledgerService;
    constructor(ledgerService: LedgerEntriesService);
    generateFromTransaction(payload: {
        transactionId: string;
        branchId: string;
        companyId: string;
    }): Promise<LedgerEntryGeneratorResponse>;
    getByTransactionId(transactionId: string): Promise<{
        message: string;
    }>;
}
