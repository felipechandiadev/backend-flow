export declare class BankAccountsService {
    getCashBalance(): Promise<{
        balance: number;
    }>;
    list(): Promise<never[]>;
    findOne(): Promise<null>;
    create(): Promise<{
        success: boolean;
    }>;
    update(): Promise<{
        success: boolean;
    }>;
    remove(): Promise<{
        success: boolean;
    }>;
}
