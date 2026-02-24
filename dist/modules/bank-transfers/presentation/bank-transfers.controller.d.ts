import { BankTransfersService } from '../application/bank-transfers.service';
export declare class BankTransfersController {
    private readonly bankTransfersService;
    constructor(bankTransfersService: BankTransfersService);
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
