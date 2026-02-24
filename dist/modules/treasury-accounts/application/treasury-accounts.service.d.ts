import { Repository } from 'typeorm';
import { TreasuryAccount } from '../../treasury-accounts/domain/treasury-account.entity';
import { Company } from '../../companies/domain/company.entity';
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
