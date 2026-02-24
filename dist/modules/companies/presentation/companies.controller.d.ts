import { CompaniesService } from '../application/companies.service';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
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
