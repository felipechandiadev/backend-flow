import { Repository } from 'typeorm';
import { Company } from '../domain/company.entity';
export declare class CompaniesService {
    private readonly companyRepository;
    constructor(companyRepository: Repository<Company>);
    getCompany(): Promise<{
        id: string;
        name: string;
        defaultCurrency: string;
        isActive: boolean;
        bankAccounts: never[];
        fiscalYearStart?: undefined;
        settings?: undefined;
    } | {
        id: string;
        name: string;
        defaultCurrency: string;
        fiscalYearStart: Date | undefined;
        isActive: boolean;
        settings: Record<string, any>;
        bankAccounts: import("../../persons/domain/person.entity").PersonBankAccount[];
    }>;
}
