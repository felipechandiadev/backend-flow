import { BankAccountsService } from '../application/bank-accounts.service';
export declare class BankAccountsController {
    private readonly bankAccountsService;
    constructor(bankAccountsService: BankAccountsService);
    getCashBalance(): Promise<{
        balance: number;
    }>;
    list(): Promise<never[]>;
    findOne(_id: string): Promise<null>;
    create(_data: Record<string, unknown>): Promise<{
        success: boolean;
    }>;
    update(_id: string, _data: Record<string, unknown>): Promise<{
        success: boolean;
    }>;
    remove(_id: string): Promise<{
        success: boolean;
    }>;
}
