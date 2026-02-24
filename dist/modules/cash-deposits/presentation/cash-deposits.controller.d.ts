import { CashDepositsService } from '../application/cash-deposits.service';
export declare class CashDepositsController {
    private readonly cashDepositsService;
    constructor(cashDepositsService: CashDepositsService);
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
