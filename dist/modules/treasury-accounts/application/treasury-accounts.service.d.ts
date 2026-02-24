import { Repository } from 'typeorm';
import { TreasuryAccount } from '@modules/treasury-accounts/domain/treasury-account.entity';
import { Company } from '@modules/companies/domain/company.entity';
export declare class TreasuryAccountsService {
    private readonly treasuryAccountRepository;
    private readonly companyRepository;
    constructor(treasuryAccountRepository: Repository<TreasuryAccount>, companyRepository: Repository<Company>);
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
