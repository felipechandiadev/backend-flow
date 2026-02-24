import { TreasuryAccountsService } from '../application/treasury-accounts.service';
export declare class TreasuryAccountsController {
    private readonly treasuryAccountsService;
    constructor(treasuryAccountsService: TreasuryAccountsService);
    findAll(): Promise<{
        success: boolean;
        data: {
            id: any;
            name: string;
            bankName: any;
            accountNumber: any;
            type: string;
        }[];
    }>;
}
