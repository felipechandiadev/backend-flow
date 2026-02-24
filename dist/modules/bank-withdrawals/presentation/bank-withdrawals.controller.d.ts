import { BankWithdrawalsService } from '../application/bank-withdrawals.service';
export declare class BankWithdrawalsController {
    private readonly bankWithdrawalsService;
    constructor(bankWithdrawalsService: BankWithdrawalsService);
    list(): Promise<never[]>;
    create(payload: Record<string, unknown>): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: string;
            documentNumber: string;
            createdAt: Date;
            asientos: any;
        };
        error?: undefined;
    }>;
}
